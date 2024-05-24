import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { GlobalModalListProvider } from './use-modal/global/GlobalModalListProvider.tsx';
import { GlobalModalList } from './use-modal/global/GlobalModalList.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalModalListProvider>
      <App />
      <GlobalModalList />
    </GlobalModalListProvider>
  </React.StrictMode>,
);
