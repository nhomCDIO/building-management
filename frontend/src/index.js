import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <--- THÊM DÒNG NÀY ĐỂ KÍCH HOẠT CSS
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);