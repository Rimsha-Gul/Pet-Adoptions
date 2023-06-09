import { useEffect, useState } from "react";
import PrimaryLogo from "../icons/PrimaryLogo";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  handleLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryHeader = ({ handleLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);
  }, []);

  const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleLogout(event);
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed top-0 w-full flex items-center justify-between p-4 shadow-md mb-12 z-10 bg-white">
      <PrimaryLogo />
      <div className="flex flex-row gap-8 items-center">
        <p className="text-xl">{localStorage.getItem("userName")}</p>
        {userRole === "ADMIN" ? (
          <button
            className="px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer"
            onClick={handleDashboardClick}
          >
            Dashboard
          </button>
        ) : (
          <></>
        )}
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
