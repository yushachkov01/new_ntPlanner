import React, { useEffect, useMemo, useState } from 'react';

import './PprEditorPage.css';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
import type { Template } from '@entities/template/model/store/templateStore.ts';
import useTimelineStore, { toRowId } from '@entities/timeline/model/store/timelineStore';
import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import PprPage from '@pages/PprPage';

import { Button } from 'antd';

/** нормализуем структуру исполнителя */
const normalizeExec = (u: any) => ({
  /** id может быть числом ИЛИ строкой (UUID)  */
  id: u?.id ?? u?.user_id ?? u?.value ?? u?.key,
  author:
    u?.author ??
    u?.fio ??
    u?.name ??
    `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim() ??
    `User ${u?.id ?? ''}`,
  role: u?.role?.name ?? u?.role ?? '',
});

const PprEditorPage: React.FC = () => {
  /** UI-состояния */
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [mainTemplate, setMainTemplate] = useState<Template>();
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  const currentUser = userStore((s) => s.user)!;

  /** Исполнители по шаблонам */
  const [executorsByTemplate, setExecutorsByTemplate] = useState<any[][]>(
    currentUser ? [[normalizeExec(currentUser)]] : [[]],
  );
  const [tabExecutors, setTabExecutors] = useState<any[]>(
    (executorsByTemplate[0] ?? []).map(normalizeExec),
  );

  /** Методы стора рабочего времени */
  const { timelineWindow, setTimelineWindow } = WorkTimeStore();

  /** используем «точечное» удаление блоков по префиксу sourceKey (templateKey) */
  const removeBySourcePrefix = useTimelineStore((s) => (s as any).removeBySourcePrefix);

  /** Все пользователи чтобы по rowId восстановить исполнителя */
  const allUsers = useUserStore((s) => s.users || []);

  /** util из стора таймлайна: принадлежность строк одному исполнителю */
  const isSamePersonRow = useTimelineStore((s) => s.isSamePersonRow);
  /**  экшен схлопывания пустой доп. строки (для возврата «+») */
  const collapseEmptyExtraFor = useTimelineStore((s) => s.collapseEmptyExtraFor);

  /** Если есть основной шаблон, а исполнителей нет — добавляем текущего */
  useEffect(() => {
    if (mainTemplate && executorsByTemplate[0].length === 0 && currentUser) {
      setExecutorsByTemplate((prevList) => {
        const nextList = [...prevList];
        nextList[0] = [normalizeExec(currentUser)];
        return nextList;
      });
      setTabExecutors([normalizeExec(currentUser)]);
    }
  }, [mainTemplate, currentUser, executorsByTemplate]);

  /**
   * Добавляет исполнителя к указанному шаблону по индексу
   * @param templateIndex — индекс шаблона в массиве executorsByTemplate
   * @param executor — объект исполнителя
   */
  const addExecutor = (templateIndex: number, executor: any) =>
    setExecutorsByTemplate((prevList) => {
      const nextList = [...prevList];
      if (!Array.isArray(nextList[templateIndex])) {
        nextList[templateIndex] = [];
      }
      const ex = normalizeExec(executor);
      const key = String(ex.id);
      if (!nextList[templateIndex].some((item: any) => String(item.id) === key)) {
        nextList[templateIndex].push(ex);
      }
      return nextList;
    });

  /**
   * Удаляет исполнителя из указанного шаблона по индексу
   * @param templateIndex — индекс шаблона
   * @param executorId — id исполнителя
   */
  const removeExecutor = (templateIndex: number, executorId: number | string) =>
    setExecutorsByTemplate((prevList) => {
      const nextList = [...prevList];
      nextList[templateIndex] = (nextList[templateIndex] ?? []).filter(
        (item: any) => String(item.id) !== String(executorId),
      );
      return nextList;
    });

  /** Итоговый список исполнителей для таймлайна */
  const pprExecutors = useMemo(
    () =>
      Array.from(
        new Map(
          (executorsByTemplate.flat() as any[]).map(normalizeExec).map((e) => [String(e.id), e]),
        ).values(),
      ),
    [executorsByTemplate],
  );

  /** helper: получить корневой id строки (если это extra — берём parentId) */
  const getRootRowId = (rowId: number) => {
    const rows = useTimelineStore.getState().rows ?? [];
    const row = rows.find((r) => r.id === rowId);
    return row?.isExtra ? row.parentId! : rowId;
  };

  /**
   * По rowId (числовой id строки таймлайна) находим пользователя и возвращаем исполнителя.
   */
  const resolveExecutorByRowId = (rowId: number) => {
    const baseId = getRootRowId(rowId);
    const fromPpr = (pprExecutors as any[]).find(
      (u) => toRowId(u?.id ?? u?.user_id ?? u?.value ?? u?.key) === baseId,
    );
    if (fromPpr) return normalizeExec(fromPpr);

    const found = allUsers.find(
      (u) => toRowId(u?.id ?? u?.user_id ?? u?.value ?? u?.key) === baseId,
    );
    if (found) return normalizeExec(found);

    if (currentUser && toRowId(currentUser?.id) === baseId) {
      return normalizeExec(currentUser);
    }

    return null;
  };

  /**
   * Определяем, к какому слоту шаблонов относится templateKey.
   * Возвращает индекс в executorsByTemplate: 0 — основной, 1 — дополнительные; -1 если не найден.
   */
  const resolveTemplateSlotIndex = (templateKey?: string): number => {
    if (!templateKey) return -1;
    if ((mainTemplate as any)?.key === templateKey) return 0;
    const addIdx = additionalTemplates.findIndex((t) => (t as any)?.key === templateKey);
    return addIdx >= 0 ? addIdx + 1 : -1;
  };

  /**
   * Колбэк от таймлайна: перенос бандла между исполнителями.
   * Добавляем целевого исполнителя в слот шаблона,
   * и, если исходная строка опустела — удаляем исходного исполнителя.
   */
  const handleMoveBetweenExecutors = ({
    templateKey,
    sourceKey,
    sourceRowId,
    targetRowId,
    sourceEmptyAfter,
  }: {
    templateKey?: string;
    sourceKey?: string;
    sourceRowId: number;
    targetRowId: number;
    sourceEmptyAfter: boolean;
  }) => {
    /** если перенос в ту же строку — схлопываем пустую доп. строку и выходим */
    if (sourceRowId === targetRowId) {
      collapseEmptyExtraFor?.(sourceRowId);
      return;
    }

    /** перенос внутри одного и того же исполнителя (в/из доп. строки) — списки не меняем */
    if (isSamePersonRow?.(sourceRowId, targetRowId)) {
      if (sourceEmptyAfter) collapseEmptyExtraFor?.(sourceRowId);
      return;
    }

    /** ключ шаблона */
    const keyFromSource = sourceKey ? String(sourceKey).split('::')[0] : undefined;
    const effectiveKey = templateKey ?? keyFromSource;

    /**  первичная попытка — по ключу шаблона */
    let slotIndex = resolveTemplateSlotIndex(effectiveKey);

    const addExec = resolveExecutorByRowId(targetRowId);
    const removeExec = resolveExecutorByRowId(sourceRowId);
    const removeIdStr = removeExec ? String(removeExec.id) : null;

    setExecutorsByTemplate((prev) => {
      const next = prev.map((slot) => [...(slot ?? [])]);

      /** Слоты, где присутствует исходный исполнитель */
      const slotsWithSource: number[] = [];
      if (removeIdStr) {
        for (let i = 0; i < next.length; i++) {
          if ((next[i] ?? []).some((e) => String(e.id) === removeIdStr)) {
            slotsWithSource.push(i);
          }
        }
      }

      /** Какие слоты правим (если ключ не распознан — правим те, где был исходный) */
      const slotsToAffect =
        slotIndex >= 0 ? [slotIndex] : slotsWithSource.length ? slotsWithSource : [0];

      /**  переключаем «текущего» исполнителя на целевого */
      if (addExec) {
        const addIdStr = String(addExec.id);
        for (const idx of slotsToAffect) {
          const list = next[idx] ?? [];
          if (list.length <= 1) {
            next[idx] = [addExec];
          } else {
            next[idx] = [addExec, ...list.filter((e) => String(e.id) !== addIdStr)];
          }
        }
      }

      /** если исходная строка пустая — удаляем исходного из ВСЕХ слотов, где он встречается */
      if (sourceEmptyAfter && removeIdStr) {
        for (let i = 0; i < next.length; i++) {
          const list = next[i] ?? [];
          next[i] = list.filter((e) => String(e.id) !== removeIdStr);
        }
      }

      return next;
    });
  };

  /**
   * Добавляет новый пустой шаблон:
   *   расширяет массив шаблонов,
   *   добавляет окно подсветки,
   *   создаёт пустой слот исполнителей.
   */
  const addTemplate = () => {
    const me = normalizeExec(currentUser);
    setAdditionalTemplates((prev) => [...prev, {} as Template]);
    setExecutorsByTemplate((prevList) => [...prevList, currentUser ? [me] : []]);
  };

  /** Сменить шаблон (точечно удаляем блоки ) */
  const changeTemplate = (index: number, newTemplate: Template) => {
    const prevKey = (additionalTemplates[index] as any)?.key;
    const execIds = (executorsByTemplate[index + 1] ?? []).map((e) => e.id);
    if (prevKey) {
      /** удаляем только блоки, созданные «старым» шаблоном этой вкладки */
      removeBySourcePrefix?.({ execIds, prefix: String(prevKey) });
    }
    setAdditionalTemplates((prev) => prev.map((item, idx) => (idx === index ? newTemplate : item)));
  };

  return (
    <section className="ppr-editor-card">
      <header className="ppr-editor-card__header">
        <LocationOverview />
      </header>
      <div className="ppr-editor-card__controls">
        <div className="ppr-editor-card__controls-left">
          <PlannedTaskDropdown
            className="ppr-editor-card__select"
            placeholder="Выберите задачу"
            value={selectedTaskId}
            onChange={setSelectedTaskId}
          />
          {selectedTaskId && (
            <YamlTemplateSelect
              bucket="yamls"
              value={(mainTemplate as any)?.key}
              onChange={(tpl) => {
                const prevMainKey = (mainTemplate as any)?.key;
                const execIds = (executorsByTemplate[0] ?? []).map((e) => e.id);
                if (prevMainKey) {
                  removeBySourcePrefix?.({ execIds, prefix: String(prevMainKey) });
                }
                setMainTemplate(tpl);
              }}
              executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
              addExecutor={(executor) => addExecutor(0, executor)}
              removeExecutor={(executorId) => removeExecutor(0, executorId)}
            />
          )}
        </div>
        {selectedTaskId && (
          <div className="ppr-editor-card__controls-right">
            <div className="ppr-editor-card__tabs">
              <PprEditorTabs
                taskId={selectedTaskId}
                onWorkTimeChange={setTimelineWindow}
                executors={tabExecutors}
                addExecutor={(exe) =>
                  setTabExecutors((prev) =>
                    prev.some((e) => String(e.id) === String(exe.id))
                      ? prev
                      : [...prev, normalizeExec(exe)],
                  )
                }
                removeExecutor={(id) =>
                  setTabExecutors((prev) => prev.filter((e) => String(e.id) !== String(id)))
                }
              />
            </div>
          </div>
        )}
      </div>
      {mainTemplate?.raw && (
        <DynamicYamlForm
          schema={mainTemplate.raw}
          templateKey={(mainTemplate as any)?.key}
          executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
        />
      )}

      {additionalTemplates.map((template, idx) => (
        <React.Fragment key={idx}>
          <YamlTemplateSelect
            bucket="yamls"
            value={(template as any).key}
            onChange={(newTpl) => changeTemplate(idx, newTpl)}
            executors={(executorsByTemplate[idx + 1] ?? []).map(normalizeExec)}
            addExecutor={(executor) => addExecutor(idx + 1, executor)}
            removeExecutor={(executorId) => removeExecutor(idx + 1, executorId)}
          />
          {template.raw && (
            <DynamicYamlForm
              schema={template.raw}
              templateKey={(template as any)?.key}
              executors={(executorsByTemplate[idx + 1] ?? []).map(normalizeExec)}
            />
          )}
        </React.Fragment>
      ))}

      {selectedTaskId && (
        <>
          <Button type="dashed" onClick={addTemplate}>
            Добавить шаблон
          </Button>

          <div className="ppr-editor-card__timeline">
            <PprPage
              gridStart={timelineWindow.start}
              gridEnd={timelineWindow.end}
              executors={pprExecutors as any}
              onBlockClick={() => {}}
              onTimerChange={() => {}}
              onMoveBetweenExecutors={handleMoveBetweenExecutors}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default PprEditorPage;
