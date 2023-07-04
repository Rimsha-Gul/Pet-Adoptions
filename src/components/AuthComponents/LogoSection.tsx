import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

interface HeaderProps {
  paragraph?: string;
  linkName?: string;
  linkUrl?: string;
}

const LogoSection = ({ paragraph, linkName, linkUrl }: HeaderProps) => {
  return (
    <div className="bg-secondary-100 rounded-lg shadow-none p-12 flex flex-col items-center justify-center md:rounded-r-none md:shadow-md">
      <div className="mb-4">
        <img
          alt=""
          className="sm:h-24 sm:w-24 max-h-24 max-w-24 min-h-24 min-w-24 m-auto"
          src={logo}
        />
      </div>
      <h1 className="font-pacifico text-center text-6xl font-extrabold italic text-primary">
        Purrfect Adoptions
      </h1>
      {paragraph && linkName && linkUrl && (
        <div className=" flex flex-row items-center justify-center space-x-4">
          <p className="text-center text-sm text-gray-600 mt-5">
            {paragraph}
            <span className="mr-1"></span>
            <Link
              to={linkUrl}
              className="font-medium text-primary hover:text-secondary"
            >
              {linkName}
            </Link>
          </p>
        </div>
      )}
      {/* <div className="flex items-center">
          <img
            alt=""
            className="sm:h-14 sm:w-14 max-h-14 max-w-14 min-h-14 min-w-14 m-auto"
            src={logo}
          />
        </div>
        <h1 className="font-pacifico text-center text-6xl font-extrabold italic text-primary">
          Purrfect Adoptions
        </h1> */}

      {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
        {heading}
      </h2> */}
    </div>
  );
};

export default LogoSection;
