import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import HomePage from "./pages/HomePage";
import PetProfile from "./pages/PetProfile";
import NotFoundPage from "./pages/PageNotFound";
import Dashboard from "./pages/Dashboard";
import AddPet from "./pages/AddPet";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { Navigate } from "react-router-dom";
import api from "./api";
import { errorMessages } from "./constants/errorMessages";
import PrimaryHeader from "./layouts/PrimaryHeader";

function App() {
  const appContext = useContext(AppContext);
  const isAuthenticated = localStorage.getItem("userEmail");

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
  const renderProtectedRoute = (Component: any) => {
    if (isAuthenticated) {
      return (
        <>
          <PrimaryHeader handleLogout={handleLogout} />
          <Component />
        </>
      );
    }
    return <Navigate to="/" />;
  };
  return (
    <BrowserRouter>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pagenotfound" element={<NotFoundPage />} />
          <Route path="/verifyemail" element={<VerifyEmail />} />
          <Route path="/homepage" element={renderProtectedRoute(HomePage)} />
          <Route path="/pet/:name" element={renderProtectedRoute(PetProfile)} />
          <Route path="/dashboard" element={renderProtectedRoute(Dashboard)} />
          <Route path="/addpet" element={renderProtectedRoute(AddPet)} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
