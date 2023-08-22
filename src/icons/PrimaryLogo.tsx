import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const PrimaryLogo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/homepage");
  };

  return (
    <div
      className="flex items-center space-x-2 sm:space-x-4 cursor-pointer"
      onClick={handleLogoClick}
    >
      <div className="flex items-center">
        <img alt="" className="h-8 w-8 sm:h-12 sm:w-12" src={logo} />
      </div>
      <h1 className="font-pacifico text-2xl sm:text-5xl font-extrabold italic text-primary">
        Purrfect Adoptions
      </h1>
    </div>
  );
};

export default PrimaryLogo;
