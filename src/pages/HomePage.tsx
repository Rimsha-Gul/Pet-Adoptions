import { useContext, useEffect, useState } from "react";
import api from "../api";
import PrimaryLogo from "../icons/PrimaryLogo";
import { useNavigate, Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { errorMessages } from "../constants/errorMessages";
import loadingIcon from "../assets/loading.gif";

interface Pet {
  shelterId: number;
  name: string;
  age: number;
  color: string;
  bio: string;
  image: string;
}

const HomePage = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoadingError, setPetsLoadingError] = useState("");

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
        appContext.setDisplayName?.(response.data.name);
        console.log(response.data);
        console.log(appContext.loggedIn);
        console.log(appContext.usermail);
        console.log(appContext.displayName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/pet");
        const petsData: Pet[] = response.data;
        setPets(petsData);
      } catch (error: any) {
        console.error(error);
        if (error.response.status === 500) {
          setPetsLoadingError("Failed to fetch pets");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (!appContext.loggedIn) {
    // Redirect to a login page
    return <Navigate to={"/"} />;
  }

  const handleLogout = async () => {
    try {
      const response = await api.delete("/logout");
      localStorage.removeItem("accessToken");
      appContext.setUsermail?.("");
      appContext.setLoggedIn?.(false);
      appContext.setDisplayName?.("");
      navigate("/");
      console.log(response.status);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 404) {
        navigate("/pagenotfound", {
          state: errorMessages.pageNotFound,
        });
      }
    }
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
        {isLoading && (
          <img src={loadingIcon} alt="Loading" className="h-10 w-10 mt-8" />
        )}
        {!petsLoadingError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-12 m-12">
            {pets.map((pet) => (
              <div
                key={pet.name}
                className="bg-gray-100 rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center"
              >
                <img
                  src={pet.image}
                  alt="Pet Image"
                  className="w-full h-80 object-cover"
                />
                <div className="mt-2 flex flex-col gap-4 p-4">
                  <h3 className="text-2xl text-primary font-bold text-center">
                    {pet.name}
                  </h3>
                  <p className="text-md text-gray-500 line-clamp-2">
                    {pet.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {petsLoadingError && <p>{petsLoadingError}</p>}
      </div>
    </>
  );
};
export default HomePage;
