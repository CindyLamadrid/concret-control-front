import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/themes.scss';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Aplicar tema guardado antes de renderizar (evita flash)
const savedTheme = localStorage.getItem('app-theme') || 'concreto';
document.documentElement.setAttribute('data-theme', savedTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
