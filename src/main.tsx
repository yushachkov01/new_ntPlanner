import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { store } from './app/store';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { RelayProvider } from './app/providers/RelayProvider';
import './assets/styles/global.css';
import {RealtimeProvider} from "@app/providers/RealtimeProvider.tsx";

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
