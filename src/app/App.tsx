import type { FC } from 'react';

import { useTheme } from './providers/ThemeProvider';
import AppRouter from './Router';
import Header from '../shared/ui/Header';

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
