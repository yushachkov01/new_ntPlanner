import React, { useEffect, useMemo, useState } from 'react';

import './PprEditorPage.css';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
import type { Template } from '@entities/template/model/store/templateStore.ts';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
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
  const removeBySourcePrefix = useTimelineStore((s) => s.removeBySourcePrefix);

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

  /**
   * Добавляет новый пустой шаблон:
   *   расширяет массив шаблонов,
   *   добавляет окно подсветки,
   *   создаёт пустой слот исполнителей.
   */
  const addTemplate = () => {
    setAdditionalTemplates((prev) => [...prev, {} as Template]);
    setExecutorsByTemplate((prevList) => [
      ...prevList,
      currentUser ? [normalizeExec(currentUser)] : [],
    ]);
  };

  /** Сменить шаблон (точечно удаляем блоки ) */
  const changeTemplate = (index: number, newTemplate: Template) => {
    const prevKey = (additionalTemplates[index] as any)?.key;
    const execIds = (executorsByTemplate[index + 1] ?? []).map((e) => e.id);
    if (prevKey) {
      /** удаляем только блоки, созданные «старым» шаблоном этой вкладки */
      removeBySourcePrefix({ execIds, prefix: String(prevKey) });
    }
    setAdditionalTemplates((prev) => prev.map((item, idx) => (idx === index ? newTemplate : item)));
  };

  /** Все пользователи из userStore */
  useUserStore((s) => s.users || []);

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
                  removeBySourcePrefix({ execIds, prefix: String(prevMainKey) });
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
            />
          </div>
        </>
      )}
    </section>
  );
};

export default PprEditorPage;
