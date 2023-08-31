import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AppContextProvider from "./context/AppContext.tsx";
import SidebarProvider from "./context/SidebarContext.tsx";
import NotificationsProvider from "./context/NotificationsContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <SidebarProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </SidebarProvider>
    </AppContextProvider>
  </React.StrictMode>
);
