import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface AppContextProps {
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>> | null;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>> | null;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>> | null;
}

export const AppContext = createContext<AppContextProps>({
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
  const [displayName, setDisplayName] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   api
  //     .get("/session")
  //     .then((res) => res.data)
  //     .then((data: any) => {
  //       setUsermail(data.email);
  //       setDisplayName(data.name);
  //       setLoggedIn(true);
  //     })
  //     .catch(() => {
  //       setLoggedIn(false);
  //     });
  // });

  return (
    <AppContext.Provider
      value={{
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
