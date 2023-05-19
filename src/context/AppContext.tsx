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
}

export const AppContext = createContext<AppContextProps>({
  usermail: "",
  setUsermail: null,
});

const AppContextProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [usermail, setUsermail] = useState<string>("");

  return (
    <AppContext.Provider value={{ usermail, setUsermail }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
