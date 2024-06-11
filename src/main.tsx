import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalModalList, GlobalModalListProvider } from '../';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalModalListProvider>
      <App />
      <GlobalModalList />
    </GlobalModalListProvider>
  </React.StrictMode>,
);
