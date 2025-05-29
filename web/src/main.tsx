import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { Provider } from 'react-redux'
import { store } from "./app/store.ts"

createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </UserProvider>
)
