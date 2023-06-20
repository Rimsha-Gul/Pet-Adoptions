import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

interface HeaderProps {
  heading: string;
  paragraph: string;
  linkName: string;
  linkUrl: string;
}

const Header = ({ heading, paragraph, linkName, linkUrl }: HeaderProps) => {
  return (
    <div className="mb-10">
      <div className="mb-10 h-full flex flex-row items-center justify-center space-x-4">
        <div className="flex items-center">
          <img
            alt=""
            className="sm:h-14 sm:w-14 max-h-14 max-w-14 min-h-14 min-w-14 m-auto"
            src={logo}
          />
        </div>
        <h1 className="font-pacifico text-center text-6xl font-extrabold italic text-primary">
          Purrfect Adoptions
        </h1>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-primary hover:text-secondary"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
};

export default Header;
