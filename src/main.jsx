import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <App />
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    bodyClassName="toastBody"
    />
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
