import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || ''
axios.defaults.baseURL = apiUrl.startsWith('http') ? apiUrl.replace(/\/api$/, '') : ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
