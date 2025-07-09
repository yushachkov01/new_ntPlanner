import { Modal, TimePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import './TimeIntervalModal.css';

interface Props {
  /**
   * флаг «показать / скрыть» модалку
   */
  open: boolean;
  /**
   * закрыть без изменений
   */
  onCancel: () => void;

  /**
   * сохранить выбранный интервал в формате «HH:mm–HH:mm»
   */
  onOk: (interval: string) => void; // «HH:mm–HH:mm»
}

const getPopupContainer = (el: HTMLElement) => el.parentElement!;

export const TimeIntervalModal: React.FC<Props> = ({ open, onCancel, onOk }) => {
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);

  return (
    <Modal
      rootClassName="time-interval-modal"
      open={open}
      title="Выберите интервал работ"
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ disabled: !from || !to }}
      onCancel={onCancel}
      onOk={() => {
        if (from && to) onOk(`${from.format('HH:mm')}–${to.format('HH:mm')}`);
      }}
    >
      <Space>
        <TimePicker
          value={from}
          onChange={setFrom}
          placeholder="Начало"
          format="HH:mm"
          minuteStep={5}
          getPopupContainer={getPopupContainer}
        />
        —
        <TimePicker
          value={to}
          onChange={setTo}
          placeholder="Окончание"
          format="HH:mm"
          minuteStep={5}
          getPopupContainer={getPopupContainer}
        />
      </Space>
    </Modal>
  );
};

export default TimeIntervalModal;
