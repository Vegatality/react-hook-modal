import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalModalList, GlobalModalListProvider } from '@/lib';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalModalListProvider>
      <GlobalModalList />
      <App />
    </GlobalModalListProvider>
  </React.StrictMode>,
);
