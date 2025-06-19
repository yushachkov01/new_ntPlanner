import type { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavMenu.css';

interface NavMenuProps {
  onClose: () => void;
}

const NavMenu: FC<NavMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const items = ['ППР', 'Домашняя страница'];

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
