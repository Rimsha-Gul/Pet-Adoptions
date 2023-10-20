import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AppContextProvider from './context/AppContext'
import SidebarProvider from './context/SidebarContext'
import NotificationsProvider from './context/NotificationsContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <SidebarProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </SidebarProvider>
    </AppContextProvider>
  </React.StrictMode>
)
