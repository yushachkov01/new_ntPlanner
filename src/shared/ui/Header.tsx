import { MenuOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Switch } from 'antd';
import React from 'react';

import { useTheme } from '../../app/providers/ThemeProvider';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <AntHeader className="app-header">
      <MenuOutlined className="header-icon" />

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
    </AntHeader>
  );
};

export default Header;
