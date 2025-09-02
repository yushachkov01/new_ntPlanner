import { ROLE_TITLES_RU, PLANNED_TASKS_KIND } from '@/shared/constants';

import { collectStageFieldKeys, buildStagesForRow, findIdByRole } from './stages';
import { isEmptyValue, deepSort } from './utils';

/**
 * Формирует итоговый документ planned_tasks на основе выбранного YAML-шаблона,
 * исполнителей, строк параметров и переопределений этапов.
 *
 * @param {Object} opts                          Параметры построения документа
 * @param {string} opts.plannedTaskId            Идентификатор итоговой planned_task (UUID)
 * @param {string} [opts.description]            Описание задачи (description)
 * @param {string} opts.templateKey              Ключ (путь/имя) YAML-шаблона
 * @param {any[]}  opts.execs                    Список доступных исполнителей (для поиска по ролям)
 * @param {any[]}  opts.rows                     Строки параметров (по ним формируются args)
 * @param {string[]} opts.stageOrder             Порядок прохождения success-этапов
 * @param {Record<string, any>} opts.stagesDict  Словарь мета-информации этапов по ключу
 * @param {Record<string, any>} [opts.overridesForTpl]     Переопределения времени/полей из таймлайна и явных правок
 * @param {Record<string, any>} [opts.stageFieldEditsFlat] Плоские правки полей этапов (которые надо учесть при сборке)
 */
export function buildPlannedTasksDocument(opts: {
  plannedTaskId: string;
  description?: string;
  templateKey: string;
  execs: any[];
  rows: any[];
  stageOrder: string[];
  stagesDict: Record<string, any>;
  overridesForTpl?: Record<string, any>;
  stageFieldEditsFlat?: Record<string, any>;
}) {
  const {
    plannedTaskId,
    description,
    templateKey,
    execs,
    rows,
    stageOrder,
    stagesDict,
    overridesForTpl,
    stageFieldEditsFlat,
  } = opts;

  /**
   * Идентификаторы исполнителей по ролям из централизованных заголовков
   */
  const engineerId = findIdByRole(execs, ROLE_TITLES_RU.engineer);
  const installerId = findIdByRole(execs, ROLE_TITLES_RU.installer);
  const auditorId = findIdByRole(execs, ROLE_TITLES_RU.auditor);

  /**
   * Множество ключей, относящихся к полям этапов (их не включаем в базовые аргументы строки)
   */
  const stageFieldKeys = collectStageFieldKeys(stagesDict);
  const seenSignatures = new Set<string>();

  /**
   * Список аргументов для задачи (args): каждая уникальная строка `rows` превращается в элемент args.
   */
  const args = (rows ?? []).reduce<any[]>((argsAcc, currentRow) => {
    /** Базовые аргументы строки */
    const rowArgs: any = {};

    Object.entries(currentRow).forEach(([key, value]) => {
      if (key === '__sourceKey') return;
      if (stageFieldKeys.has(key)) return;
      if (!isEmptyValue(value)) rowArgs[key] = value;
    });

    //  для исключения дублей
    const signature = JSON.stringify(deepSort(rowArgs));
    if (seenSignatures.has(signature)) return argsAcc;
    seenSignatures.add(signature);

    // Построение секции stages
    const stages = buildStagesForRow(
      currentRow,
      stageOrder,
      stagesDict,
      overridesForTpl,
      stageFieldEditsFlat,
      engineerId,
      installerId,
      auditorId,
    );

    if (!isEmptyValue(stages)) rowArgs.stages = stages;

    argsAcc.push(rowArgs);
    return argsAcc;
  }, []);

  /** Задача внутри таймлайна */
  const taskDefinition: any = { template: templateKey };
  if (installerId) taskDefinition.installer = installerId;
  if (auditorId) taskDefinition.auditor = auditorId;
  taskDefinition.args = args;

  // Один элемент таймлайна: если есть engineer — кладём его
  const timelineEntry: any = engineerId
    ? { engineer: engineerId, tasks: [taskDefinition] }
    : { tasks: [taskDefinition] };

  return {
    kind: PLANNED_TASKS_KIND,
    description: description ?? '',
    id: plannedTaskId,
    timelines: [timelineEntry],
  };
}
