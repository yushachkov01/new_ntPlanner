/**
 * Модальное окно удаления шаблона
 */
import { Modal } from 'antd';
import React from 'react';

import type { Template } from '@entities/template/model/store/templateStore';

type Props = {
  open: boolean;
  kind?: 'main' | 'extra';
  index?: number;

  mainTemplate?: Template;
  additionalTemplates?: Template[];
  executorsByTemplate: any[];
  normalizeExecId: (ex: any) => string;
  removeBySourcePrefix?: (args: { execIds: string[]; prefix: string }) => void;

  setMainTemplate: (tpl: Template | undefined) => void;
  setParamsConfirmed: (v: boolean) => void;
  setTabsConfirmed: (v: boolean) => void;
  setAdditionalTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setHiddenExtraSlots: React.Dispatch<React.SetStateAction<Set<number>>>;

  onCancel: () => void;
  text?: string;
};

const ConfirmDeleteDialog: React.FC<Props> = ({
  open,
  kind,
  index,
  mainTemplate,
  additionalTemplates = [],
  executorsByTemplate,
  normalizeExecId,
  removeBySourcePrefix,
  setMainTemplate,
  setParamsConfirmed,
  setTabsConfirmed,
  setAdditionalTemplates,
  setHiddenExtraSlots,
  onCancel,
  text = 'Удалить выбранный шаблон и его блоки на таймлайне?',
}) => {
  const handleOk = () => {
    if (kind === 'main' && mainTemplate) {
      const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
      removeBySourcePrefix?.({ execIds, prefix: String((mainTemplate as any)?.key ?? '') });
      setMainTemplate(undefined);
      setParamsConfirmed(false);
      setTabsConfirmed(false);
    }

    if (kind === 'extra' && typeof index === 'number') {
      const tpl = additionalTemplates[index] as any;
      if (tpl?.key) {
        const execIds = (executorsByTemplate[index + 1] ?? []).map(normalizeExecId);
        removeBySourcePrefix?.({ execIds, prefix: String(tpl.key) });
      }
      setAdditionalTemplates((prev) => prev.map((t, i) => (i === index ? ({} as Template) : t)));
      setHiddenExtraSlots((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }

    onCancel();
  };

  return (
    <Modal
      title="Подтвердите действие"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="ОК"
      cancelText="Отмена"
      maskClosable={false}
      closable={false}
      centered
      destroyOnClose
    >
      <div style={{ fontSize: 16 }}>{text}</div>
    </Modal>
  );
};

export default ConfirmDeleteDialog;
