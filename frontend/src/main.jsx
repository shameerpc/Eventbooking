import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // or './App.css' if that’s where you added the directives
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
