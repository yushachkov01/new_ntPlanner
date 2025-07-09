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
    if (!location) load();
  }, [location, load]);
  if (!location) return null;
  /**
   *  формируем url для Я.Карт
   */
  const { provider, branch, city, street } = location;
  const query = encodeURIComponent(`${city}, ${street}`);
  const yandexUrl = `https://yandex.ru/maps/?text=${query}`;

  return (
    <div className="location-overview">
      {provider} <span className="sep">›</span>
      {branch} <span className="sep">›</span>
      {city} <span className="sep">›</span>
      <a href={yandexUrl} target="_blank" rel="noopener noreferrer" className="location-link">
        {street}
      </a>
    </div>
  );
};

export default LocationOverview;
