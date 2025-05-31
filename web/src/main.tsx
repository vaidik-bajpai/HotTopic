import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from "./app/store.ts"

createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
)
