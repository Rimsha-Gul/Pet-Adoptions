import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import { sidebarLinks } from "../constants/MenuOptions";
import { SidebarContext } from "../context/SidebarContext";
import { AppContext } from "../context/AppContext";
import { useTransition, animated } from "@react-spring/web";

const Sidebar = ({ handleLogout }: { handleLogout: () => void }) => {
  const appContext = useContext(AppContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const userName = appContext.displayName;
  const userRole = appContext.userRole;
  const [userProfilePhoto, setUserProfilePhoto] = useState(
    appContext.profilePhoto
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>(
    location.pathname.substring(1)
  );

  // Filter out admin links if user is not an admin
  const filteredSidebarLinks = sidebarLinks.filter(
    (link) =>
      (!link.admin && !link.shelter) ||
      (link.admin && userRole === "ADMIN") ||
      (link.shelter && userRole === "SHELTER")
  );

  // Transition config for the settings dropdown
  const transitions = useTransition(isSettingsOpen, {
    from: { maxHeight: "0px" },
    enter: { maxHeight: "500px" },
    leave: { maxHeight: "0px" },
    config: {
      duration: 300,
    },
  });

  // update local state when context values are updated
  useEffect(() => {
    setUserProfilePhoto(appContext.profilePhoto);
  }, [appContext.profilePhoto]);

  const toggleSidebar = () => {
    setIsSidebarOpen?.(!isSidebarOpen);
  };

  const handleOptionClick = (label: string) => {
    setSelectedOption(label); // Set the selected option label
    if (label === "Logout") {
      handleLogout(); // Call handleLogout function for Logout option
    }
  };
  console.log(location.pathname.substring(1));
  return (
    <div
      className={`w-64 pt-4 bg-secondary-10 h-screen fixed top-0 left-0 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-2 items-center justify-center">
        <Link
          to="/homepage"
          className="absolute top-0 left-0 p-3 my-2 mx-3 text-gray-700 rounded-full hover:bg-secondary-100"
        >
          <FiArrowLeft className="text-lg" />
        </Link>
        {userProfilePhoto ? (
          <img
            src={userProfilePhoto}
            alt="Profile Photo"
            className="w-14 h-14 rounded-full cursor-pointer text-sm border-2 border-secondary shadow-md"
          />
        ) : (
          <button className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 border-secondary shadow-md">
            <span className="text-gray-500 text-lg font-medium">
              {userName.charAt(0)}
            </span>
          </button>
        )}
        <div className="px-4 py-2 border-b border-gray-300">
          <p className="text-md font-medium">{userName}</p>
        </div>
      </div>

      <div className="py-4">
        {filteredSidebarLinks.map((link, index) => (
          <>
            {link.divider && (
              <div className="my-2 border-t border-gray-300"></div>
            )}
            {link.heading && (
              <p className="px-6 py-2 text-gray-600 font-bold">
                {link.heading}
              </p>
            )}
            {link.options ? (
              <div>
                <div className="flex flex-row items-center">
                  <div
                    className={`flex items-center block px-6 py-3 text-md font-medium cursor-pointer w-full ${
                      selectedOption === link.to
                        ? "text-white bg-secondary"
                        : "text-gray-500 hover:bg-secondary-100 transition-colors"
                    } ${isSidebarOpen ? "" : ""}`}
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    {link.label}
                    <div className="flex items-center ml-2">
                      {isSettingsOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>
                {isSettingsOpen && (
                  <div>
                    {transitions(
                      (style, item) =>
                        item && (
                          <animated.div style={style}>
                            {link.options.map((option) => (
                              <Link
                                key={option.to}
                                to={option.to}
                                className={`block px-6 py-3 text-md font-medium ${
                                  selectedOption === option.to
                                    ? "text-white bg-secondary"
                                    : "text-gray-500 hover:bg-secondary-100 transition-colors"
                                } ${isSidebarOpen ? "" : ""}`}
                                onClick={() => handleOptionClick(option.label)}
                              >
                                {option.label}
                              </Link>
                            ))}
                          </animated.div>
                        )
                    )}
                  </div>
                )}
              </div>
            ) : (
              link.to && (
                <Link
                  key={index}
                  to={link.to}
                  className={`block px-6 py-3 text-md font-medium ${
                    link.to === location.pathname ||
                    link.to === location.pathname.substring(1) ||
                    selectedOption === link.to
                      ? "text-white bg-secondary"
                      : "text-gray-500 hover:bg-secondary-100 transition-colors"
                  } ${isSidebarOpen ? "" : ""}`}
                  onClick={() => handleOptionClick(link.label)}
                >
                  {link.label}
                </Link>
              )
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
