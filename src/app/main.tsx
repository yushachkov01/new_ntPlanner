import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { RelayProvider } from './providers/RelayProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { store } from './store.tsx';

import '../assets/styles/global.css';
import { RealtimeProvider } from '@app/providers/RealtimeProvider.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <RelayProvider>
          <RealtimeProvider>
            <App />
          </RealtimeProvider>
        </RelayProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);
