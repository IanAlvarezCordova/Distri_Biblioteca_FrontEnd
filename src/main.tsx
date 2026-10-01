//main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import './index.css';




Chart.register(ChartDataLabels);


ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
);