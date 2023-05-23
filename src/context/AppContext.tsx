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
  usermail: string;
  setUsermail: Dispatch<SetStateAction<string>> | null;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>> | null;
}

export const AppContext = createContext<AppContextProps>({
  usermail: "",
  setUsermail: null,
  loggedIn: false,
  setLoggedIn: null,
});

const AppContextProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [usermail, setUsermail] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get("/session")
      .then((res) => res.data)
      .then((data: any) => {
        setUsermail(data.email);

        setLoggedIn(true);
      })
      .catch(() => {
        setLoggedIn(false);
      });
  });

  return (
    <AppContext.Provider
      value={{ usermail, setUsermail, loggedIn, setLoggedIn }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
