import { useEffect, useState } from 'react';

/**
 * Хук синхронизирует набор открытых панелей Collapse (`openKeys`) с внешним
 * значением «выбранная стадия» ( клик на таймлайне), и следит,
 * чтобы в `openKeys` не попадали несуществующие ключи (после смены шаблона).
 *
 * @param allKeys Все допустимые ключи панелей (в порядке отображения).
 * @param preferredKey Внешне выбранный ключ (например, `stageKeys[0]`).
 * @returns Кортеж: [openKeys, setOpenKeys] — как у обычного useState<string[]>
 */
export function useSyncedOpenKeys(
  allKeys: string[],
  preferredKey?: string,
): [string[], (next: string[]) => void] {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /** Внешний выбор добавляем в текущий набор */
  useEffect(() => {
    if (preferredKey && allKeys.includes(preferredKey) && !openKeys.includes(preferredKey)) {
      setOpenKeys((prev) => [...prev, preferredKey]);
    }
  }, [preferredKey, allKeys.join('|')]);

  /** Чистим ключи, которых больше нет */
  useEffect(() => {
    setOpenKeys((prev) => prev.filter((k) => allKeys.includes(k)));
  }, [allKeys]);

  return [openKeys, setOpenKeys];
}
