import '@ant-design/v5-patch-for-react-19';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@app/App.tsx';
import { ThemeProvider } from '@app/providers/ThemeProvider.tsx';
import '@app/styles/global.css';
import { UserProvider } from '@entities/user/ui/UserProvider.tsx';
import { WorkProvider } from '@entities/work/ui/WorkProvider.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <WorkProvider>
        {/* id текущего пользователя жёстко = 1, пока нет auth */}
        <UserProvider userId={1}>
          <App />
        </UserProvider>
      </WorkProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
