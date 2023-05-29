import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface AppContextProps {
  usermail: string;
  setUsermail: Dispatch<SetStateAction<string>> | null;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>> | null;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>> | null;
}

export const AppContext = createContext<AppContextProps>({
  usermail: "",
  setUsermail: null,
  displayName: "",
  setDisplayName: null,
  loggedIn: false,
  setLoggedIn: null,
});

const AppContextProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [usermail, setUsermail] = useState<string>("");
  const [displayName, setDisplayName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

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
        usermail,
        setUsermail,
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
