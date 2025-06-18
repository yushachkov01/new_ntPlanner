/**
 * TestPage — демонстрационный компонент CRUD для Work.
 * Показывает создание, редактирование и удаление через zustand-store,
 * а также иллюстрирует безопасную работу с Codegen-типами
 * и получение данных из WebSocket (через WorkProvider).
 */
import type { ChangeEvent, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

/**
 * Сгенерированные типы переменных для GraphQL–мутаций
 */
import type { InsertWorkMutationVariables } from '@entities/work/api/insertWork.generated';
import type { UpdateWorkMutationVariables } from '@entities/work/api/updateWork.generated';
import type { Work } from '@entities/work/model/work.types';
import { useWorkStore } from '@entities/work/store/useWorkStore';

export const TestPage: React.FC = () => {
  /**
   * Берём из стора:
   * - works: массив записей Work
   * - load: функция загрузки всех записей из сервера
   * - insert: функция добавления новой записи
   * - patch: функция частичного обновления записи
   * - remove: функция удаления записи
   */
  const { works, load, insert, patch, remove } = useWorkStore();

  // 1. NEW FORM — типизированная форма для InsertWork

  /**
   * newForm формирует payload для мутации InsertWork.
   * Тип InsertWorkMutationVariables['object'] генерируется Codegen-ом
   * на основании GraphQL-файла.
   */
  const [newForm, setNewForm] = useState<InsertWorkMutationVariables['object']>({
    date: new Date().toISOString().slice(0, 10),
    project: '',
    description: '',
    time_range: '',
    status: 'pending',
    ppr_hours: 0,
    work_hours: 0,
    overtime_hours: 0,
    site: 'Test Site',
  });

  // 2. EDIT FORM — типизированная форма для UpdateWork

  /**
   * editingId хранит id редактируемой записи.
   * editForm соответствует полю 'set' в UpdateWorkMutationVariables,
   * генерированному из updateWork.graphql.
   */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateWorkMutationVariables['set']>({});

  // 3. Начальная загрузка данных

  /**
   * При монтировании компонента вызываем load(), чтобы:
   * 1) отправить graphql-запрос FetchWorks
   * 2) сохранить результат в zustand-store.works
   * 3) WorkProvider подпишется на WS и будет поддерживать стор в актуальном состоянии
   */
  useEffect(() => {
    load();
  }, [load]);

  // 4. HANDLERS ДЛЯ НОВОЙ ФОРМЫ

  /**
   * onNewChange — универсальный обработчик изменения поля newForm.
   * Принимает ключ поля и возвращает функцию для события ChangeEvent.
   */
  const onNewChange =
    (field: keyof InsertWorkMutationVariables['object']) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v = e.target.value;
      setNewForm((prev) => ({
        ...prev,
        [field]:
          field === 'ppr_hours' || field === 'work_hours' || field === 'overtime_hours'
            ? Number(v)
            : v,
      }));
    };

  /**
   * submitNew — отправляет мутацию insert(newForm):
   * 1) insert вызывает api.insertWork → graphql-request → Hasura
   * 2) после удачного ответа стор добавляет запись в s.works через get().add
   * 3) WebSocket (WorkProvider) также получит событие work.patch
   * и сгенерирует второй апдейт стора, но клиент уже синхронизирован.
   */
  const submitNew = async (e: FormEvent) => {
    e.preventDefault();
    await insert(newForm);
    // сбросим поля формы
    setNewForm({
      date: new Date().toISOString().slice(0, 10),
      project: '',
      description: '',
      time_range: '',
      status: 'pending',
      ppr_hours: 0,
      work_hours: 0,
      overtime_hours: 0,
      site: 'Test Site',
    });
  };

  // 5. HANDLERS ДЛЯ EDIT FORM

  /**
   * startEdit — начинается inline-редактирование:
   * сохраняем id записи и заполняем editForm текущими значениями.
   */
  const startEdit = (w: Work) => {
    setEditingId(w.id);
    setEditForm({
      project: w.project,
      description: w.description,
      status: w.status,
      time_range: w.timeRange,
    });
  };

  /**
   * cancelEdit — отменяет редактирование:
   * сбрасываем editingId и очищаем форму.
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * onEditChange — универсальный обработчик для полей editForm.
   * Аналогичен onNewChange, но для UpdateWorkMutationVariables['set'].
   */
  const onEditChange =
    (field: keyof UpdateWorkMutationVariables['set']) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  /**
   * saveEdit — отправляет мутацию patch(id, editForm):
   * 1) api.updateWork → graphql-request → Hasura
   * 2) store.patch обновляет массив works
   * 3) WorkProvider по WS также может получить work.patch и синхронизировать
   */
  const saveEdit = async (id: string) => {
    await patch(Number(id), editForm);
    setEditingId(null);
  };

  // 6. HANDLER ДЛЯ УДАЛЕНИЯ

  /**
   * handleDelete — удаляет запись:
   * 1) api.deleteWork → Hasura
   * 2) store.remove фильтрует s.works по id
   * 3) WorkProvider на WS может получить work.delete и тоже вызвать remove()
   */
  const handleDelete = async (id: string) => {
    await remove(Number(id));
  };

  // 7. UI — рендер формы и списка записей

  return (
    <div style={{ padding: 20, background: '#f5f5f5' }}>
      {/* Форма создания новой записи */}
      <form
        onSubmit={submitNew}
        style={{
          marginBottom: 24,
          padding: 12,
          background: '#fff',
          borderRadius: 4,
        }}
      >
        <h2>Create New Work</h2>
        {/* Каждое поле привязано к newForm и onNewChange */}
        <label>
          Date: <input type="date" value={newForm.date} onChange={onNewChange('date')} />
        </label>{' '}
        <label>
          Project: <input value={newForm.project} onChange={onNewChange('project')} />
        </label>{' '}
        <label>
          Description: <input value={newForm.description} onChange={onNewChange('description')} />
        </label>{' '}
        <label>
          TimeRange:{' '}
          <input
            value={newForm.time_range}
            onChange={onNewChange('time_range')}
            placeholder="09:00–17:00"
          />
        </label>{' '}
        <label>
          Status:{' '}
          <select value={newForm.status} onChange={onNewChange('status')}>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
        </label>{' '}
        <label>
          PPR hours:{' '}
          <input type="number" value={newForm.ppr_hours} onChange={onNewChange('ppr_hours')} />
        </label>{' '}
        <label>
          Work hours:{' '}
          <input type="number" value={newForm.work_hours} onChange={onNewChange('work_hours')} />
        </label>{' '}
        <label>
          Overtime hours:{' '}
          <input
            type="number"
            value={newForm.overtime_hours}
            onChange={onNewChange('overtime_hours')}
          />
        </label>{' '}
        <button type="submit"> Create</button>
      </form>

      {/* Список всех записей */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {works.map((w) => (
          <li
            key={w.id}
            style={{
              marginBottom: 12,
              padding: 12,
              background: '#fff',
              borderRadius: 4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {editingId === w.id ? (
              <>
                {/* Inline-редактирование для выбранной записи */}
                <label>
                  Project:{' '}
                  <input value={editForm.project ?? ''} onChange={onEditChange('project')} />
                </label>{' '}
                <label>
                  Description:{' '}
                  <input
                    value={editForm.description ?? ''}
                    onChange={onEditChange('description')}
                  />
                </label>{' '}
                <label>
                  Status:{' '}
                  <select value={editForm.status ?? 'pending'} onChange={onEditChange('status')}>
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                  </select>
                </label>{' '}
                <label>
                  TimeRange:{' '}
                  <input value={editForm.time_range ?? ''} onChange={onEditChange('time_range')} />
                </label>{' '}
                <button onClick={() => saveEdit(w.id)}>Save</button>{' '}
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {/* Обычный вид записи */}
                <div>
                  <strong>#{w.id}</strong> [{w.date}] {w.project} — {w.status}
                </div>
                <div>{w.description}</div>
                <div> {w.timeRange}</div>
                <button onClick={() => startEdit(w)}>Edit</button>{' '}
                <button onClick={() => handleDelete(w.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
