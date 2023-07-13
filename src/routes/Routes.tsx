import { RouteObject } from "react-router";
import { Navigate } from "react-router-dom";
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
import Settings from "../pages/Settings";
import ChangeEmail from "../pages/ChangeEmail";
import Loading from "../pages/Loading";
import ChangePassword from "../pages/ChangePassword";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import UserProfile from "../pages/UserProfile";
import AdoptionApplication from "../pages/AdoptionApplication";

export const getRoutes = (
  isAuthenticated: boolean,
  handleLogout: () => void,
  isSidebarOpen: boolean
): RouteObject[] => {
  console.log("authenticated: ", isAuthenticated);
  const appContext = useContext(AppContext);
  const userRole = appContext.userRole;
  const existingUser = appContext.loggedIn;
  const AdminAndShelterRoutes = [AddPet];
  const sidebarRoutes = [
    Dashboard,
    AddPet,
    Settings,
    ChangeEmail,
    ChangePassword,
    UserProfile,
  ];

  const renderProtectedRoute = (Component: any) => {
    if (isAuthenticated) {
      if (sidebarRoutes.includes(Component)) {
        if (AdminAndShelterRoutes.includes(Component) && userRole === "USER") {
          return <NotFoundPage />;
        }
        return (
          <div className="flex">
            <Sidebar handleLogout={handleLogout} />
            <div
              className={`flex-grow items-center ${
                isSidebarOpen ? "ml-64" : ""
              }`}
            >
              <Component />
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col">
            <PrimaryHeader handleLogout={handleLogout} />
            <div className="">
              <Component />
            </div>
          </div>
        );
      }
    }
    return <Navigate to="/" />;
  };

  const renderVerifyEmail = () => {
    if (existingUser) {
      return (
        <div className="flex">
          <Sidebar handleLogout={handleLogout} />
          <div className={`flex-grow ${isSidebarOpen ? "ml-64" : ""}`}>
            <VerifyEmail />
          </div>
        </div>
      );
    } else {
      return <VerifyEmail />;
    }
  };

  return [
    { path: "/", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/loading", element: <Loading /> },
    { path: "/pagenotfound", element: <NotFoundPage /> },
    { path: "/verifyemail", element: renderVerifyEmail() },
    { path: "/homepage", element: renderProtectedRoute(HomePage) },
    { path: "/pet/:name", element: renderProtectedRoute(PetProfile) },
    { path: "/dashboard", element: renderProtectedRoute(Dashboard) },
    { path: "/addpet", element: renderProtectedRoute(AddPet) },
    { path: "/settings", element: renderProtectedRoute(Settings) },
    { path: "/changeEmail", element: renderProtectedRoute(ChangeEmail) },
    { path: "/changePassword", element: renderProtectedRoute(ChangePassword) },
    { path: "/userProfile", element: renderProtectedRoute(UserProfile) },
    {
      path: "/adoptionApplication/:petName",
      element: renderProtectedRoute(AdoptionApplication),
    },
  ];
};
