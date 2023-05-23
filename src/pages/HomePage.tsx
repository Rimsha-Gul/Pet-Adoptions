import { useContext, useEffect, useState } from "react";
import api from "../api";
import PrimaryLogo from "../icons/PrimaryLogo";
import { useNavigate, Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const HomePage = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  if (!appContext.usermail) {
    return <Navigate to={"/"} />;
  }

  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get("/session");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
  }, []);

  if (!user) {
    // Redirect to a login page
    return <Navigate to={"/"} />;
  }

  const { name, email, address } = user;
  console.log(email, address);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 shadow-md">
        <PrimaryLogo />
        <div className="flex flex-row gap-8 items-center">
          <p className="text-xl">{name}</p>
          <button
            className="px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
export default HomePage;
