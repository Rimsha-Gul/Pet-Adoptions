import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import api from "../api";

interface AppContextProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>> | null;
  userRole: string;
  setUserRole: Dispatch<SetStateAction<string>> | null;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>> | null;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>> | null;
  profilePhoto: string;
  setProfilePhoto: Dispatch<SetStateAction<string>> | null;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>> | null;
  verificationOperation: string;
  setVerificationOperation: Dispatch<SetStateAction<string>> | null;
  isEmailVerified: boolean;
  setIsEmailVerified: Dispatch<SetStateAction<boolean>> | null;
  newEmail: string;
  setNewEmail: Dispatch<SetStateAction<string>> | null;
}

export const AppContext = createContext<AppContextProps>({
  isLoading: false,
  setIsLoading: null,
  userRole: "",
  setUserRole: null,
  userEmail: "",
  setUserEmail: null,
  displayName: "",
  setDisplayName: null,
  profilePhoto: "",
  setProfilePhoto: null,
  loggedIn: false,
  setLoggedIn: null,
  verificationOperation: "",
  setVerificationOperation: null,
  isEmailVerified: false,
  setIsEmailVerified: null,
  newEmail: "",
  setNewEmail: null,
});

const AppContextProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [verificationOperation, setVerificationOperation] =
    useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");

  useEffect(() => {
    console.log("this one called");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setLoggedIn(true);
      console.log(loggedIn);

      api.interceptors.request.use(
        function (config) {
          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );

      api.interceptors.response.use(
        function (response) {
          return response;
        },
        async function (error) {
          const originalConfig = error.config;
          console.log("Try to refresh");
          if (error.response?.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${refreshToken}`;
            try {
              console.log("Refresh the tokens");
              console.log(refreshToken);
              console.log(api);
              const res = await api.post("/auth/refresh");
              console.log("Refresh response: ", res);
              setLoggedIn(true);
              localStorage.setItem("accessToken", res.data.tokens.accessToken);
              localStorage.setItem(
                "refreshToken",
                res.data.tokens.refreshToken
              );
              originalConfig.headers.Authorization =
                "Bearer " + res.data.tokens.accessToken;

              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${res.data.tokens.accessToken}`;
              return api.request({
                ...originalConfig,
                ...{
                  headers: originalConfig.headers.toJSON(),
                },
              });
            } catch (err) {
              setLoggedIn(false);
            }
          }
          return Promise.reject(error);
        }
      );
    } else {
      console.log(accessToken);
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setIsLoading(true);
      console.log("Session called");
      api
        .get("/session")
        .then((res) => res.data)
        .then((data: any) => {
          setUserEmail(data.email);
          setDisplayName(data.name);
          setUserRole(data.role);
          setProfilePhoto(data.profilePhoto);
          setIsLoading(false);
        })
        .catch((error) => {
          setLoggedIn(false);
          console.error(error.response?.data?.message || error.response?.data);
          setIsLoading(false);
        });
    }
  }, [loggedIn]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userRole,
        setUserRole,
        userEmail,
        setUserEmail,
        displayName,
        setDisplayName,
        profilePhoto,
        setProfilePhoto,
        loggedIn,
        setLoggedIn,
        verificationOperation,
        setVerificationOperation,
        isEmailVerified,
        setIsEmailVerified,
        newEmail,
        setNewEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
