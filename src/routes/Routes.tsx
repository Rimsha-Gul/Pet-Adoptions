import { Route, Navigate } from "react-router-dom";
import SignupPage from "../pages/Signup";
import LoginPage from "../pages/Login";
import VerifyEmail from "../pages/VerifyEmail";
import HomePage from "../pages/HomePage";
import PetProfile from "../pages/PetProfile";
import NotFoundPage from "../pages/PageNotFound";
import Dashboard from "../pages/Dashboard";
import AddPet from "../pages/AddPet";
import PrimaryHeader from "../layouts/PrimaryHeader";
import Sidebar from "../layouts/Sidebar";

export const getRoutes = (
  isAuthenticated: boolean,
  handleLogout: () => void,
  isSidebarOpen: boolean
) => {
  console.log("authenticated: ", isAuthenticated);
  const renderProtectedRoute = (Component: any) => {
    const AdminRoutes = [Dashboard, AddPet];
    if (isAuthenticated) {
      if (AdminRoutes.includes(Component)) {
        return (
          <div className="flex">
            <Sidebar handleLogout={handleLogout} />
            <div className={`flex-grow ${isSidebarOpen ? "ml-64" : ""}`}>
              <Component />
            </div>
          </div>
        );
      } else {
        return (
          <>
            <PrimaryHeader handleLogout={handleLogout} />
            <div className="mt-20">
              <Component />
            </div>
          </>
        );
      }
    }
    return <Navigate to="/" />;
  };

  return (
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/pagenotfound" element={<NotFoundPage />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      <Route path="/homepage" element={renderProtectedRoute(HomePage)} />
      <Route path="/pet/:name" element={renderProtectedRoute(PetProfile)} />
      <Route path="/dashboard" element={renderProtectedRoute(Dashboard)} />
      <Route path="/addpet" element={renderProtectedRoute(AddPet)} />
    </>
  );
};
