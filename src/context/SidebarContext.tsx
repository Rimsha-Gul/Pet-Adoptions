import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  ReactNode,
} from "react";

interface SidebarContextProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>> | null;
}

export const SidebarContext = createContext<SidebarContextProps>({
  isSidebarOpen: true,
  setIsSidebarOpen: null,
});

const SidebarProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
