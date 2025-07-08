import type { FC } from 'react';
import { useEffect } from 'react';

import { locationStore } from '@entities/location/model/store/locationStore';
import './LocationOverview.css';

/**
 * LocationOverview — краткий вывод данных локации в одну строку с ссылкой на Яндекс-Карты
 */
const LocationOverview: FC = () => {
  const { location, load } = locationStore();

  useEffect(() => {
    if (!location) load();
  }, [location, load]);

  if (!location) return null;

  const { provider, branch, city, street } = location;
  // формируем URL для Яндекс-Карт
  const query = encodeURIComponent(`${branch} ${city} ${street}`);
  const yandexUrl = `https://yandex.ru/maps/?text=${query}`;

  return (
    <div className="location-overview">
      {provider} › {branch} › {city} ›{' '}
      <a href={yandexUrl} target="_blank" rel="noopener noreferrer" className="street">
        {street}
      </a>
    </div>
  );
};

export default LocationOverview;
