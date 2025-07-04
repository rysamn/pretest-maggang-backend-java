  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import './index.css';
  import App from './App';
  import reportWebVitals from './reportWebVitals';

  import { BrowserRouter } from "react-router-dom";

  import "primereact/resources/themes/saga-blue/theme.css";
  import "primereact/resources/primereact.min.css";
  import "primeicons/primeicons.css";
  import "primeflex/primeflex.css";
  import { AuthProvider } from './auth/useAuth';
  import { CartProvider } from './contexts/CartContext';

  const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider> {/* ← Tambahkan ini */}
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
