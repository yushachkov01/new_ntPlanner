import type { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavMenu.css';

interface NavMenuProps {
  /** Функция закрытия меню */
  onClose: () => void;
}

/**
 * Компонент NavMenu — выпадающее навигационное меню
 * - Отображает список пунктов
 * - Обрабатывает клики и навигацию
 */
const NavMenu: FC<NavMenuProps> = ({ onClose }) => {
  /** Хук для программной навигации по маршрутам */
  const navigate = useNavigate();
  /** Массив пунктов меню */
  const items = ['ППР', 'Домашняя страница'];

  /**
   * Обработчик клика по пункту меню
   * @param e - событие клика мыши
   * @param idx - индекс пункта в массиве items
   */
  const handleItemClick = (e: MouseEvent, idx: number) => {
    e.stopPropagation();
    onClose();
    if (idx === 0) {
      navigate('/ppr');
    } else if (idx === 1) {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="nav-menu" onClick={(e) => e.stopPropagation()}>
      <ul className="nav-menu__list">
        {items.map((label, idx) => (
          <li key={idx} className="nav-menu__item" onClick={(e) => handleItemClick(e, idx)}>
            <span className="nav-menu__label">{label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
