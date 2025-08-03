import type { FC } from 'react';
import { useEffect } from 'react';

import { useLocationStore } from '@/entities/location/model/store/locationStore';
import './LocationOverview.css';

/**
 * Описание площадки + кликабельный адрес (Яндекс-Карты)
 */
const LocationOverview: FC = () => {
  /**
   * Достаём из стора все массивы и метод load
   */
  const { providers, branches, cities, nodes, loading, error, load } = useLocationStore();

  /**
   *Один раз при маунте запрашиваем локацию, если она ещё не загружена
   */
  useEffect(() => {
    if (!providers.length) {
      load();
    }
  }, [providers.length, load]);

  /**
   * Пока идёт загрузка или нет ни одной node — не рендерим
   */
  if (loading || error || !nodes.length) return null;

  const node = nodes[0];

  /**
   * Найдём город
   */
  const city = cities.find((c) => c.id === node.cityId);
  if (!city) return null;

  /**
   * Найдём ветку
   */
  const branch = branches.find((b) => b.id === city.branchId);
  if (!branch) return null;

  /**
   * Найдём провайдера
   */
  const provider = providers.find((p) => p.id === branch.providerId);
  if (!provider) return null;

  /**
   * У площадки используем либо адрес, либо имя
   */
  const street = node.address || node.name;

  /**
   * Формируем ссылку на Яндекс-Карты по городу и улице
   */
  const query = encodeURIComponent(`${city.name}, ${street}`);
  const yandexUrl = `https://yandex.ru/maps/?text=${query}`;

  return (
    <div className="location-overview">
      <span className="location-part">{provider.name}</span>
      <span className="sep">›</span>
      <span className="location-part">{branch.name}</span>
      <span className="sep">›</span>
      <span className="location-part">{city.name}</span>
      <span className="sep">›</span>
      <a href={yandexUrl} target="_blank" rel="noopener noreferrer" className="location-link">
        {street}
      </a>
    </div>
  );
};

export default LocationOverview;
