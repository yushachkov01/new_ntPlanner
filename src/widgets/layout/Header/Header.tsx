import { MenuOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Switch } from 'antd';
import React, { useState, useEffect } from 'react';

import { useTheme } from '@app/providers/ThemeProvider.tsx';
import { userStore } from '@entities/user/model/store/UserStore.ts';
import NavMenu from '@widgets/layout/NavMenu';
import './Header.css';

const { Header: AntHeader } = Layout;

/**
 * Компонент Header — шапка приложения
 * - Отображает кнопку меню, название проекта и иконки
 * - Позволяет переключать тему и показывать время/пользователя
 */
const Header: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = userStore((s) => s.user);

  /**
   * Эффект: при клике за пределами меню закрыть его
   */
  useEffect(() => {
    const close = () => menuOpen && setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  /**
   * Обработчик клика по иконке "бургер" — переключает NavMenu
   */
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
      <div className="header-user">
        <div className="header-user__role">{user?.role ?? '—'}</div>
        <div className="header-user__author">{user?.author ?? ''}</div>
      </div>
      {menuOpen && <NavMenu onClose={() => setMenuOpen(false)} />}
    </AntHeader>
  );
};

export default Header;
