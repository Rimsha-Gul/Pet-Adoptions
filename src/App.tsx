import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { Navigate } from "react-router-dom";
import api from "./api";
import { errorMessages } from "./constants/errorMessages";
import { SidebarContext } from "./context/SidebarContext";
import { getRoutes } from "./routes/Routes";

function App() {
  const appContext = useContext(AppContext);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const { isSidebarOpen } = useContext(SidebarContext);
  useEffect(() => {
    setAuthStatusChecked(true);
  }, [appContext.loggedIn]);

  const isAuthenticated = appContext.loggedIn;
  console.log(isAuthenticated);

  const handleLogout = async () => {
    try {
      const response = await api.delete("/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      appContext.setUserEmail?.("");
      appContext.setLoggedIn?.(false);
      appContext.setDisplayName?.("");
      <Navigate to="/" />;
      console.log(response.status);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 404) {
        return (
          <Navigate to="/pagenotfound" state={errorMessages.pageNotFound} />
        );
      }
      if (error.response.status === 401) {
        return <Navigate to="/" />;
      }
    }
  };

  const routes = useRoutes(
    getRoutes(isAuthenticated, handleLogout, isSidebarOpen)
  );

  return authStatusChecked ? routes : null;
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
