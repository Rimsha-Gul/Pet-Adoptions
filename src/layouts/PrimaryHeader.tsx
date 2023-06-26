import { useContext, useState } from "react";
import PrimaryLogo from "../icons/PrimaryLogo";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { headerLinks } from "../constants/MenuOptions";

interface HeaderProps {
  handleLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryHeader = ({ handleLogout }: HeaderProps) => {
  //const role = localStorage.getItem("userRole") || "";
  //const userName = localStorage.getItem("userName") || "";
  const appContext = useContext(AppContext);
  const userName = appContext.displayName;

  const navigate = useNavigate();
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState(false);

  const handleUserOptionsClick = () => {
    setIsUserOptionsOpen(!isUserOptionsOpen);
  };

  const handleLinkClick = (path: string) => {
    setIsUserOptionsOpen(false);
    if (path === "/") {
      handleLogout({} as React.MouseEvent<HTMLButtonElement>);
    } else {
      navigate(path);
    }
  };
  return (
    <div className="fixed top-0 w-full flex items-center justify-between p-4 shadow-md mb-12 z-20 bg-white">
      <PrimaryLogo />
      <div className="flex items-center">
        <div className="relative">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200"
            onClick={handleUserOptionsClick}
          >
            <span className="text-gray-500 text-lg font-medium">
              {userName.charAt(0)}
            </span>
          </button>
          {isUserOptionsOpen && (
            <div className="absolute right-0 mt-6 w-48 bg-white border border-gray-300 rounded shadow">
              <div className="px-4 py-2 border-b border-gray-300">
                <p className="text-md font-medium">{userName}</p>
              </div>
              <div className="flex flex-col px-4 py-2">
                {headerLinks.map((link, index) => (
                  <button
                    key={index}
                    className="mb-2 text-md text-gray-600 hover:text-primary text-left"
                    onClick={() => handleLinkClick(link.to)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimaryHeader;
