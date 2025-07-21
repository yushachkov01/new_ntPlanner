import type { FC } from 'react';
import { useEffect } from 'react';

import { locationStore } from '@/entities/location/model/store/locationStore';
import './LocationOverview.css';

/**
 * Описание площадки + кликабельный адрес (Яндекс-Карты)
 */
const LocationOverview: FC = () => {
  /**
   /* Берём данные площадки и action для загрузки
   */

  const { location, load } = locationStore();
  /**
   *Один раз при маунте запрашиваем локацию, если она ещё не загружена
   */

  useEffect(() => {
    if (!location) {
      load();
    }
  }, [location, load]);
  /** Пока location отсутствует, не рендерим ничего */
  if (!location) return null;
  /**
   *  формируем url для Я.Карт
   */
  const { provider, branch, city, street } = location;
  /** Формируем строку для Яндекс Карт */
  const query = encodeURIComponent(`${city}, ${street}`);
  const yandexUrl = `https://yandex.ru/maps/?text=${query}`;

  return (
    <div className="location-overview">
      <span className="location-part">{provider}</span>
      <span className="sep">›</span>
      <span className="location-part">{branch}</span>
      <span className="sep">›</span>
      <span className="location-part">{city}</span>
      <span className="sep">›</span>
      <a href={yandexUrl} target="_blank" rel="noopener noreferrer" className="location-link">
        {street}
      </a>
    </div>
  );
};

export default LocationOverview;
