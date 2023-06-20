import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import api from "../api";

interface AppContextProps {
  userRole: string;
  setUserRole: Dispatch<SetStateAction<string>> | null;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>> | null;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>> | null;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>> | null;
}

export const AppContext = createContext<AppContextProps>({
  userRole: "",
  setUserRole: null,
  userEmail: "",
  setUserEmail: null,
  displayName: "",
  setDisplayName: null,
  loggedIn: false,
  setLoggedIn: null,
});

const AppContextProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    console.log("this one called");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setLoggedIn(true);

      axios.interceptors.request.use(
        function (config) {
          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );

      axios.interceptors.response.use(
        function (response) {
          return response;
        },
        async function (error) {
          const originalRequest = error.config;
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            try {
              const res = await api.post("/refresh", { refreshToken });
              localStorage.setItem("accessToken", res.data.accessToken);
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${res.data.accessToken}`;
              return axios(originalRequest);
            } catch (err) {
              setLoggedIn(false);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }
          }
          return Promise.reject(error);
        }
      );
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && !userEmail) {
      console.log("Session called");
      api
        .get("/session")
        .then((res) => res.data)
        .then((data: any) => {
          setUserEmail(data.email);
          setDisplayName(data.name);
          setUserRole(data.role);
        })
        .catch((error) => {
          setLoggedIn(false);
          console.error(error.response?.data?.message || error.response?.data);
        });
    }
  }, [loggedIn]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        userEmail,
        setUserEmail,
        displayName,
        setDisplayName,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
