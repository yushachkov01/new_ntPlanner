import { Modal, TimePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import './TimeIntervalModal.css';

interface Props {
  /** Флаг: показать или скрыть модальное окно */
  open: boolean;
  /** Функция: отмена выбора, закрытие без изменений */
  onCancel: () => void;
  /** Функция: сохранение выбранного интервала в формате «HH:mm–HH:mm» */
  onOk: (interval: string) => void;
}

/**
 * Возвращает контейнер для всплывающего TimePicker
 */
const getPopupContainer = (triggerElement: HTMLElement): HTMLElement =>
  triggerElement.parentElement!;

/**
 * Модальное окно выбора интервала времени работ.
 */
export const TimeIntervalModal: React.FC<Props> = ({ open, onCancel, onOk }) => {
  /** Выбранное время начала (Dayjs) */
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  /** Выбранное время окончания (Dayjs) */
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  return (
    <Modal
      rootClassName="time-interval-modal"
      open={open}
      title="Выберите интервал работ"
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ disabled: !startTime || !endTime }}
      onCancel={onCancel}
      onOk={() => {
        if (startTime && endTime) {
          onOk(`${startTime.format('HH:mm')}–${endTime.format('HH:mm')}`);
        }
      }}
    >
      <Space>
        <TimePicker
          value={startTime}
          onChange={setStartTime}
          placeholder="Начало"
          format="HH:mm"
          minuteStep={5}
          getPopupContainer={getPopupContainer}
          dropdownClassName="time-interval-dropdown"
        />
        —
        <TimePicker
          value={endTime}
          onChange={setEndTime}
          placeholder="Окончание"
          format="HH:mm"
          minuteStep={5}
          getPopupContainer={getPopupContainer}
          dropdownClassName="time-interval-dropdown"
        />
      </Space>
    </Modal>
  );
};

export default TimeIntervalModal;
