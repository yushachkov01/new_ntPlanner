import type { FC } from 'react';

import Header from '@/shared/layout/Header/Header.tsx';

import { useTheme } from './providers/ThemeProvider';
import AppRouter from './routes/Router.tsx';

import './App.css';

const App: FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`app app--${theme}`}>
      <Header />
      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
};

export default App;
