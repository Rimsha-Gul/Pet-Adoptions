import { useContext, useEffect } from "react";
import api from "../api";
import PrimaryLogo from "../icons/PrimaryLogo";
import { useNavigate, Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const HomePage = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  if (!appContext.usermail) {
    console.log(appContext.usermail);
    return <Navigate to={"/"} />;
  }

  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get("/session");

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
  }, []);

  if (!appContext.loggedIn) {
    // Redirect to a login page
    return <Navigate to={"/"} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 shadow-md mb-12">
        <PrimaryLogo />
        <div className="flex flex-row gap-8 items-center">
          <p className="text-xl">{appContext.displayName}</p>
          <button
            className="px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mt-12 text-4xl text-primary font-bold">
          Pets Available for Adoption
        </div>
        {/* <div className="bg-white rounded-lg shadow-md p-4">
          <img alt="Card Image" className="w-full" />
          <div className="text-center mt-2">
            <h3 className="text-lg font-bold"></h3>
          </div>
        </div> */}
      </div>
    </>
  );
};
export default HomePage;
