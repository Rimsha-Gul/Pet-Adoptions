import { useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();
  const { heading, paragraph } = location.state || {};
  return (
    <div className="mx-auto md:w-1/4 mt-8 space-y-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold text-gray-700">
        {heading || "Page Not Found"}
      </h1>
      <p className="text-md text-gray-600 mt-5">
        {paragraph || "The requested page could not be found."}
      </p>
    </div>
  );
};

export default NotFoundPage;
