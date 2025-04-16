import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </StrictMode>
)
