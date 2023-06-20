import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { sidebarLinks } from "../constants/MenuOptions";
import { SidebarContext } from "../context/SidebarContext";

const Sidebar = ({ handleLogout }: { handleLogout: () => void }) => {
  const userName = localStorage.getItem("userName") || "";
  const [selectedOption, setSelectedOption] = useState("");

  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

  const toggleSidebar = () => {
    setIsSidebarOpen?.(!isSidebarOpen);
  };

  const handleOptionClick = (label: string) => {
    setSelectedOption(label); // Set the selected option label
    if (label === "Logout") {
      handleLogout(); // Call handleLogout function for Logout option
    }
  };

  return (
    <div
      className={`w-64 pt-4 bg-secondary-10 h-screen fixed top-0 left-0 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-2 items-center justify-center">
        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
          <span className="text-gray-500 text-lg font-medium">
            {userName.charAt(0)}
          </span>
        </button>
        <div className="px-4 py-2 border-b border-gray-300">
          <p className="text-md font-medium">{userName}</p>
        </div>
      </div>

      <div className="py-4">
        {sidebarLinks.map((link, index) => (
          <>
            {link.divider && (
              <div className="my-2 border-t border-gray-300"></div>
            )}
            {link.heading && (
              <p className="px-6 py-2 text-gray-600 font-bold">
                {link.heading}
              </p>
            )}
            {link.to && (
              <Link
                key={index}
                to={link.to}
                className={`block px-6 py-3 text-md font-medium ${
                  selectedOption === link.label
                    ? "text-white bg-secondary"
                    : "text-gray-500 hover:bg-secondary-100 transition-colors"
                } ${isSidebarOpen ? "" : ""}`}
                onClick={() => handleOptionClick(link.label)}
              >
                {link.label}
              </Link>
            )}
          </>
        ))}
      </div>
      <button
        className={`absolute top-1/2 transform -translate-y-1/2 text-white bg-secondary pl-2 py-4 rounded-full ${
          isSidebarOpen ? "-right-4 pr-2" : "-right-6 pr-1"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;
