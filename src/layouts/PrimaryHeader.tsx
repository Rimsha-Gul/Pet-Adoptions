import PrimaryLogo from "../icons/PrimaryLogo";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

interface HeaderProps {
  handleLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryHeader = ({ handleLogout }: HeaderProps) => {
  const appContext = useContext(AppContext);
  const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleLogout(event); // Call the callback function from the prop
  };
  return (
    <div className="fixed top-0 w-full flex items-center justify-between p-4 shadow-md mb-12 z-10 bg-white">
      <PrimaryLogo />
      <div className="flex flex-row gap-8 items-center">
        <p className="text-xl">{appContext.displayName}</p>
        <button
          className="px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer"
          onClick={handleLogoutClick}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PrimaryHeader;
