import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { FormationsContextProvider } from './context/FormationsContext'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <FormationsContextProvider>
        <App />
      </FormationsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);