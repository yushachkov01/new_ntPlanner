import { MenuOutlined, LockOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import type { FC } from 'react';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: FC = () => (
  <AntHeader className="app-header">
    <MenuOutlined className="header-icon" />
    <div className="header-title">
      Сегодня работы №00/283002 / Проведение миграции на 45-KRGV-AR4
    </div>
    <LockOutlined className="header-icon" />
    <div className="header-time">13:25</div>
    <div className="header-user">Иванов И.И.</div>
  </AntHeader>
);

export default Header;
