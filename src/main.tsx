import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@app/App.tsx';
import { ThemeProvider } from '@app/providers/ThemeProvider.tsx';
import '@app/styles/global.css';
import { WorkProvider } from '@entities/work/ui/WorkProvider.tsx';

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
