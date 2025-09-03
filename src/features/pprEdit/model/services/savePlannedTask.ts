/**
 * Сохранение planned_task + YAML в MinIO.
 */
import { message } from 'antd';
import * as YAML from 'js-yaml';

import { YAML_BUCKET, DEFAULT_TASK_NAME, PLANNED_TASK_STATUS } from '@/shared/constants';
import { getMinioClient } from '@/shared/minio/getMinioClient';
import type { PlannedTask } from '@entities/PlannedTask/model/mapping/mapper';
import { toRawTaskInsert, toRawTaskSet } from '@entities/PlannedTask/model/mapping/mapper';
import {
  insertPlannedTaskOne,
  namesLike,
  plannedTaskByPk,
  updatePlannedTask,
} from '@entities/work';
import { buildPlannedTasksDocument } from '@features/pprEdit/lib/utils/buildPlannedTasksDocument';
import { collectAllParamRows } from '@features/pprEdit/lib/utils/params';
import { computeAllReachableStages } from '@features/pprEdit/lib/utils/stages';
import { pickUuid } from '@features/pprEdit/lib/utils/utils';

export async function ensureUniqueName(baseRaw: string): Promise<string> {
  const base = (baseRaw || '').trim() || DEFAULT_TASK_NAME;

  // Экранируем спецсимволы
  const escapeLike = (value: string) => value.replace(/([_%\\])/g, '\\$1');
  const pattern = `${escapeLike(base)}%`;

  const queryResult = await namesLike({ pattern });
  const takenNames = new Set((queryResult.public7_planned_tasks ?? []).map((row) => row.name));

  if (!takenNames.has(base)) return base;

  let suffixIndex = 2;
  while (takenNames.has(`${base} (${suffixIndex})`)) suffixIndex++;
  return `${base} (${suffixIndex})`;
}

/**
 * Аргументы сохранения planned_task.
 */
export type SavePlannedTaskArgs = {
  /** Разрешённый, уже загруженный YAML-шаблон (ключ + сырая схема). */
  mainTemplate: any;
  /** Выбранная запись planned_task (для обновления) или undefined. */
  selectedTask: any | undefined;
  /** Исполнители по шаблонам: executorsByTemplate[tplIdx] -> массив исполнителей. */
  executorsByTemplate: any[][];
  /** Возвращает аргументные overrides (time/fields) по tplIdx. */
  getMergedStageOverrides?: (
    tplIdx: number,
  ) => Record<string, { time?: number; fields?: Record<string, any> }>;
  /** Достаёт актуальное состояние таймлайна (rows/blocks). */
  getTimelineState?: () => any;
  /** Значения формы (для сборки параметрических строк). */
  mainFormValues: any;
  /** true — создаём новую запись; false — обновляем выбранную. */
  createNew: boolean;
  /** ID выбранной записи для обновления (если createNew=false). */
  selectedTaskId?: string;
  /** UUID автора (обязателен при создании). */
  authorUuid?: string;
  /** UUID смены/окна времени (обязателен при создании). */
  timeWorkUuid?: string;
};

/**
 * Загружает текстовый Blob в MinIO и возвращает URL
 *
 * @param {string} bucketName - Имя бакета MinIO.
 * @param {string} objectKey - Ключ объекта в бакете.
 * @param {Blob} blob - Загружаемый контент.
 * @param {string} [fallbackMime="text/plain"] - MIME по умолчанию.
 * @returns {Promise<string>} Ссылка
 */
async function uploadTextToMinio(
  bucketName: string,
  objectKey: string,
  blob: Blob,
  fallbackMime = 'text/plain',
): Promise<string> {
  let asText: string | null = null;
  const { putObjectText } = await getMinioClient();
  try {
    asText = await blob.text();
  } catch {
    asText = null;
  }

  if (asText == null) {
    const buf = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    await putObjectText(bucketName, objectKey, base64, 'application/base64');
  } else {
    const mime = (blob as any).type || fallbackMime;
    await putObjectText(bucketName, objectKey, asText, mime);
  }
  return `minio://${bucketName}/${objectKey}`;
}

/**
 * Преобразует поля attachments/logs в overrides: загружает Blob-файлы в MinIO
 *
 * @param {Record<string, any>|undefined} overrides - стейджовые overrides.
 * @param {string} yamlId - Идентификатор YAML (часть пути для вложений).
 * @returns {Promise<Record<string, any>|undefined>} Обновлённые overrides.
 */
async function ensureStageAttachmentsUrls(
  overrides: Record<string, any> | undefined,
  yamlId: string,
): Promise<Record<string, any> | undefined> {
  if (!overrides) return overrides;

  const normalized: Record<string, any> = {};
  for (const [stageKey, stagePatch] of Object.entries(overrides)) {
    const nextPatch = { ...(stagePatch ?? {}) };
    const fields = { ...(nextPatch.fields ?? {}) };

    for (const listKey of ['attachments', 'logs']) {
      const inputList = Array.isArray(fields[listKey]) ? fields[listKey] : null;
      if (!inputList) continue;

      const processedList: Array<{ name: string; url: string }> = [];
      for (const item of inputList) {
        // Уже строка-URL — используем как есть.
        if (typeof item === 'string') {
          const name = item.split('/').pop() ?? 'file';
          processedList.push({ name, url: item });
          continue;
        }

        const itemName = String(item?.name ?? item?.filename ?? 'file.txt');
        const directUrl = item?.url ?? item?.href ?? item?.link;
        if (directUrl) {
          processedList.push({ name: itemName, url: String(directUrl) });
          continue;
        }

        const blob: Blob | undefined = item?.file ?? item?.blob;
        if (blob) {
          const key = `attachments/${yamlId}/${encodeURIComponent(stageKey)}/${Date.now()}_${itemName}`;
          const url = await uploadTextToMinio(YAML_BUCKET, key, blob, 'text/plain');
          processedList.push({ name: itemName, url });
        }
      }

      // Уникализация (name|url)
      const uniqueMap = new Map<string, { name: string; url: string }>();
      for (const entry of processedList) {
        const signature = `${entry.name}|${entry.url}`;
        if (!uniqueMap.has(signature)) uniqueMap.set(signature, entry);
      }
      fields[listKey] = Array.from(uniqueMap.values());
    }

    normalized[stageKey] = { ...nextPatch, fields };
  }

  return normalized;
}

/**
 * Собирает отсортированный список уникальных tplIdx, встречающихся в таймлайне.
 *
 * @returns {number[]} Отсортированный список tplIdx (по возрастанию).
 */
function collectTplIdxListFromTimeline(getTimelineState?: () => any): number[] {
  const rows = getTimelineState?.()?.rows ?? [];
  const indexSet = new Set<number>();

  for (const rowItem of rows ?? []) {
    for (const blockItem of rowItem?.blocks ?? []) {
      if (typeof blockItem?.tplIdx === 'number') indexSet.add(blockItem.tplIdx);
    }
  }
  return Array.from(indexSet).sort((a, b) => a - b);
}

/**
 * Применяет аргументные overrides к документу:
 * для каждой записи args[i] накладывает patch из overridesPerArg[i].
 *
 * @param {any} doc - Документ planned_tasks.
 * @param {Array<Record<string,{time?:number,fields?:Record<string,any>}>>} overridesPerArg
 *  Массив патчей по индексам аргументов.
 * @returns {any} Изменённый документ.
 */
function applyOverridesPerArgToDoc(
  doc: any,
  overridesPerArg: Array<Record<string, { time?: number; fields?: Record<string, any> }>>,
) {
  const timelines = Array.isArray(doc?.timelines) ? doc.timelines : [];
  if (!timelines.length) return doc;

  for (const timeline of timelines) {
    const tasks = Array.isArray(timeline?.tasks) ? timeline.tasks : [];
    for (const task of tasks) {
      const args = Array.isArray(task?.args) ? task.args : [];
      args.forEach((argItem, argIndex) => {
        const overrideByStage = overridesPerArg[argIndex];
        if (!overrideByStage) return;

        argItem.stages = argItem.stages ?? {};
        for (const [stageKey, patch] of Object.entries(overrideByStage)) {
          const stage = (argItem.stages[stageKey] = { ...(argItem.stages[stageKey] ?? {}) });

          if (typeof patch.time === 'number' && patch.time > 0) {
            stage.time = `${Math.max(1, Math.floor(patch.time))}m`;
          }
          if (patch.fields && typeof patch.fields === 'object') {
            Object.assign(stage, patch.fields);
          }
        }
      });
    }
  }
  return doc;
}

/**
 * Сохраняет planned_task и YAML в MinIO.
 *
 * @param {SavePlannedTaskArgs} params - Аргументы сохранения.
 * @returns {Promise<{createdId?: string; updatedId?: string; yamlId: string} | void>}
 *   createdId — если запись создана, updatedId — если обновлена, yamlId — имя YAML-файла без расширения.
 */
export async function savePlannedTask({
  mainTemplate,
  selectedTask,
  executorsByTemplate,
  getMergedStageOverrides,
  getTimelineState,
  mainFormValues,
  createNew,
  selectedTaskId,
  authorUuid,
  timeWorkUuid,
}: SavePlannedTaskArgs) {
  if (!(mainTemplate as any)?.key) {
    message.error('Не выбран YAML-шаблон (шаг «Шаблон»).');
    return;
  }

  // Идентификатор YAML-файла
  const yamlId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(16)}-0000-4000-8000-${Math.random()
      .toString(16)
      .slice(2, 14)
      .padEnd(12, '0')}`;

  const templateKey = (mainTemplate as any)?.key as string | undefined;
  const schemaRaw = (mainTemplate as any)?.raw ?? {};
  const { stageOrder, stagesDict } = computeAllReachableStages(schemaRaw);

  // Строки параметров (args)
  const rows: any[] = collectAllParamRows(schemaRaw, templateKey, mainFormValues);
  const execs = (executorsByTemplate[0] ?? []).map((x) => x);

  /**
   *   overrides (для success и rollback)
   *    Собираем по tplIdx в порядке их появления в таймлайне.
   */
  const tplIdxList = collectTplIdxListFromTimeline(getTimelineState);
  const overridesPerArgRaw: Array<Record<string, { time?: number; fields?: Record<string, any> }>> =
    tplIdxList.map((idx) => getMergedStageOverrides?.(idx) ?? {});

  //  Прогоняем attachments/logs -> MinIO
  const overridesPerArg: Array<Record<string, { time?: number; fields?: Record<string, any> }>> =
    [];
  for (const perArgOverrides of overridesPerArgRaw) {
    overridesPerArg.push((await ensureStageAttachmentsUrls(perArgOverrides, yamlId)) ?? {});
  }

  /**
   *    Базовый документ без глобальных правок
   *    Ничего не «размазываем» по всем args
   */
  const docBase = buildPlannedTasksDocument({
    plannedTaskId: yamlId,
    description: selectedTask?.description ?? DEFAULT_TASK_NAME,
    templateKey: templateKey ?? 'template.yaml',
    execs,
    rows,
    stageOrder,
    stagesDict,
    overridesForTpl: {},
    stageFieldEditsFlat: {},
  });

  /**  Накладываем аргументные правки */
  const doc = applyOverridesPerArgToDoc(docBase, overridesPerArg);

  /**
   * Разносим args по инженерам (timelines):
   */
  function extractEngineerIds(): string[] {
    const templateExecutors = Array.isArray(executorsByTemplate?.[0]) ? executorsByTemplate[0] : [];
    const engineerIdsByRole = templateExecutors
      .filter((user: any) =>
        String(user?.role ?? '')
          .toLowerCase()
          .includes('engineer'),
      )
      .map((user: any) => user?.uuid || user?.id)
      .filter(Boolean);

    if (engineerIdsByRole.length) return engineerIdsByRole;

    //  смотрим executors в самих args
    const firstTimeline = Array.isArray(doc?.timelines) ? doc.timelines[0] : undefined;
    const firstTask = firstTimeline?.tasks?.[0];
    const args = Array.isArray(firstTask?.args) ? firstTask.args : [];
    const guessedEngineerIds: string[] = [];

    for (const argItem of args) {
      const stages = argItem?.stages ?? {};
      const stageKeys = Object.keys(stages);
      let foundId: string | undefined;
      for (const stageKey of stageKeys) {
        const executorIdMaybe = stages[stageKey]?.executor;
        if (typeof executorIdMaybe === 'string' && executorIdMaybe) {
          foundId = executorIdMaybe;
          break;
        }
      }
      if (foundId) guessedEngineerIds.push(foundId);
    }
    return guessedEngineerIds;
  }

  (function splitArgsPerEngineer() {
    const timelinesArr = Array.isArray(doc?.timelines) ? doc.timelines : [];
    if (!timelinesArr.length) return;

    const firstTimeline = timelinesArr[0];
    const firstTask = Array.isArray(firstTimeline?.tasks) ? firstTimeline.tasks[0] : undefined;
    const allArgs = Array.isArray(firstTask?.args) ? firstTask.args : [];

    const engineerIds = extractEngineerIds();
    if (!engineerIds.length || !allArgs.length) return;

    const makeTaskClone = (argsChunk: any[]) => ({
      template: firstTask.template,
      installer: firstTask.installer,
      auditor: firstTask.auditor,
      args: argsChunk,
    });

    const newTimelines: any[] = [];

    for (let i = 0; i < engineerIds.length; i++) {
      const argItem = allArgs[i];
      if (!argItem) break;
      newTimelines.push({
        engineer: engineerIds[i],
        tasks: [makeTaskClone([argItem])],
      });
    }

    if (allArgs.length > engineerIds.length) {
      const tail = allArgs.slice(engineerIds.length);
      if (newTimelines.length) {
        newTimelines[0].tasks[0].args.push(...tail);
      } else {
        return;
      }
    }

    doc.timelines = newTimelines;
  })();

  /** YAML-сериализация и загрузка в MinIO */
  let yamlBody = '';
  try {
    yamlBody = YAML.dump(doc, { noRefs: true, lineWidth: 120 });
  } catch {
    yamlBody = `# YAML dump failed, fallback to JSON\n${JSON.stringify(doc, null, 2)}\n`;
  }

  try {
    const { putObjectText } = await getMinioClient();
    await putObjectText(YAML_BUCKET, `${yamlId}.yaml`, yamlBody, 'text/yaml');
  } catch (err) {
    console.error('[savePlannedTask] MinIO upload error:', err);
    message.error('Не удалось загрузить файл в MinIO.');
    return;
  }

  // Связка с RM
  const rmTaskUuid = pickUuid((selectedTask as any)?.rmTaskId, (selectedTask as any)?.rm_task_id);

  // Создание новой записи
  if (createNew) {
    if (!authorUuid || !timeWorkUuid) {
      message.error('Для создания записи нужны author_id и time_work_id (оба UUID).');
      return;
    }

    const uniqueName = await ensureUniqueName(selectedTask?.name ?? DEFAULT_TASK_NAME);
    const domain: PlannedTask = {
      id: '',
      name: uniqueName,
      description: selectedTask?.description ?? '',
      rmTaskId: rmTaskUuid ?? '',
      yamlUrl: yamlId,
      timeWorkId: timeWorkUuid,
      authorId: authorUuid,
    };

    const insertObject = toRawTaskInsert(domain) as any;
    insertObject.status = PLANNED_TASK_STATUS.ON_REVIEW;

    const insertResult = await insertPlannedTaskOne({ object: insertObject });
    const created = insertResult.insert_public7_planned_tasks_one;

    if (created?.id) {
      message.success(`Создана новая запись planned_tasks (id: ${created.id})`);
      return { createdId: created.id, yamlId };
    } else {
      message.warning('Вставка выполнена, но сервер не вернул созданную строку.');
      return { createdId: undefined, yamlId };
    }
  }

  //  Обновление существующей записи
  if (!selectedTaskId) {
    message.error('Не выбрана запись для обновления.');
    return;
  }

  const patchSet = toRawTaskSet({
    name: selectedTask?.name,
    description: selectedTask?.description,
    rmTaskId: rmTaskUuid,
    yamlUrl: yamlId,
    authorId: authorUuid,
    timeWorkId: timeWorkUuid,
  }) as any;

  patchSet.status = PLANNED_TASK_STATUS.ON_REVIEW;

  const updateResult = await updatePlannedTask({ id: selectedTaskId as any, _set: patchSet });
  const affectedRows = updateResult.update_public7_planned_tasks?.affected_rows ?? 0;

  if (affectedRows > 0) {
    message.success('Плановая задача обновлена и отправлена на проверку');
  } else {
    message.warning('Запрос выполнен, но ни одна строка не была обновлена.');
  }

  await plannedTaskByPk({ id: selectedTaskId as any });
  return { updatedId: selectedTaskId, yamlId };
}
