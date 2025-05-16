import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { store } from './app/store';
import './assets/styles/global.css';
import {GraphQLProvider} from "@app/providers/GraphQLProvider.tsx";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <GraphQLProvider>
          <App />
        </GraphQLProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);
