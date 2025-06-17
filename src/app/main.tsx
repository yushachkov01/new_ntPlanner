import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';

import '../assets/styles/global.css';
import { WorkProvider } from '@app/providers/WorkProvider.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <WorkProvider>
        <App />
      </WorkProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
