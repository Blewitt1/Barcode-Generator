import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {registerLicense} from '@syncfusion/ej2-base';
const apiKey = import.meta.env.VITE_API_KEY;
registerLicense(apiKey);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
