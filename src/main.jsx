import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FavoritesProvider } from './context/FavoritesContext'
import { HistoryProvider } from './context/HistoryContext'
import './styles/variables.css'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
