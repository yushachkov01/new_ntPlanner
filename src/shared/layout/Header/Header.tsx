import { MenuOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Switch } from 'antd';
import React, { useState, useEffect } from 'react';

import NavMenu from '@/shared/layout/NavMenu';
import { useTheme } from '@app/providers/ThemeProvider.tsx';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  /** Если пользователь кликнул за пределами меню, закрываем его */
  useEffect(() => {
    const handleOutsideClick = () => {
      if (menuOpen) setMenuOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [menuOpen]);

  /** При клике на бургер показываем/скрываем меню */
  const handleBurgerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <AntHeader className="app-header">
      <MenuOutlined className="header-icon header-icon--burger" onClick={handleBurgerClick} />

      <div className="header-title">
        Сегодня работы №00/283002 / Проведение миграции на 45-KRGV-AR4
      </div>

      <LockOutlined className="header-icon header-lock" />

      <div className="theme-switch">
        <span style={{ marginRight: 8 }}>{theme === 'light' ? '☀️' : '🌙'}</span>
        <Switch
          className="theme-switch-switch"
          checked={theme === 'dark'}
          onChange={toggle}
          size="small"
        />
      </div>

      <div className="header-time">13:25</div>
      <div className="header-user">Иванов И.И.</div>

      {menuOpen && <NavMenu onClose={() => setMenuOpen(false)} />}
    </AntHeader>
  );
};

export default Header;
