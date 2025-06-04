import type { FC } from 'react';
import { useState } from 'react';
import './TaskDetail.css';

export interface SubStep {
  id: number;
  label: string;
}

interface TaskDetailProps {
  label: string;
  startTime: string;
  endTime: string;
  subSteps?: SubStep[];
  onClose: () => void;
}

const TaskDetail: FC<TaskDetailProps> = ({ label, startTime, endTime, subSteps, onClose }) => {
  const safeSubSteps: SubStep[] = subSteps ?? [];

  const [showFullInfo, setShowFullInfo] = useState(true);
  const [showSubSteps, setShowSubSteps] = useState(false);

  const toggleFullInfo = () => setShowFullInfo((prev) => !prev);
  const toggleSubSteps = () => setShowSubSteps((prev) => !prev);

  // Вычисляем продолжительность в минутах
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  const durationMin = eH * 60 + eM - (sH * 60 + sM);

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <div className="task-detail__title">{label}</div>
        <div className="task-detail__controls">
          <div className="task-detail__time-text">
            ⏱ {startTime} – {endTime} | {durationMin} мин
          </div>

          <button
            className="task-detail__toggle-full"
            onClick={toggleFullInfo}
            aria-label={showFullInfo ? 'Свернуть подробности' : 'Показать подробности'}
          >
            <span className={`toggle-arrow ${showFullInfo ? 'down' : 'up'}`} />
          </button>

          <button className="task-detail__close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
      </div>

      {/* ========== Полная информация ========== */}
      {showFullInfo && (
        <div className="task-detail__body--fullinfo">
          <div className="task-detail__info-row">
            <strong>Описание:</strong>
            <div className="task-detail__description-block">
              Оценка состояния затронутых в работах маршрутизаторов:
              <br />
              1. 45-KRGV-AR1 (182.167.10.2) – Модель Cisco 7606 (IOS 12.2.1)
              <br />
              2. 45-KRGV-AR4 (182.167.10.3) – Модель Juniper MX480 (Junos 21.3R1)
              <br />
              <a
                href="#"
                className="task-detail__commands-link"
                onClick={(e) => e.preventDefault()}
              >
                Перейти к командам
              </a>
            </div>
          </div>

          <div className="task-detail__info-row">
            <strong>Тип работы:</strong> БПДС
          </div>

          <div className="task-detail__info-row">
            <strong>Исполнитель:</strong> РТК-С, Иванов И.И. (Автомат)
          </div>

          <div className="task-detail__info-row">
            <strong>Продолжительность:</strong> {startTime} – {endTime} | {durationMin} мин
          </div>

          <div className="task-detail__info-row task-detail__button-row">
            <button className="task-detail__done-btn">Готово</button>
          </div>
        </div>
      )}

      <div className="task-detail__substeps-toggle">
        <button className="show-substeps-btn" onClick={toggleSubSteps}>
          {showSubSteps ? 'Скрыть подэтапы' : 'Показать подэтапы'}
        </button>
      </div>

      {showSubSteps && safeSubSteps.length > 0 && (
        <div className="task-detail__substeps">
          {safeSubSteps.map((ss, index) => {
            const indentRem = index * 1.5;
            return (
              <div
                key={ss.id}
                className={`subtask-item level-${index + 1}`}
                style={{
                  marginLeft: `${indentRem}rem`,
                  width: `calc(100% - ${indentRem}rem)`,
                }}
              >
                <div className="subtask-item__left">
                  <span className="subtask-item__icon">○</span>
                  <span className="subtask-item__label">“{ss.label}”</span>
                </div>
                <div className="subtask-item__right">
                  <button className="subtask-item__comments">Комментарии…</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
