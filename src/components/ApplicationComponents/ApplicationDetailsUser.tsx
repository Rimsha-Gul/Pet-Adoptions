import { Link, useLocation, useParams } from "react-router-dom";
import { getStatusIcon } from "../../utils/getStatusIcon";
import api from "../../api";
import { useEffect, useState } from "react";
import loadingIcon from "../../assets/loading.gif";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ApplicationDetailsUser = () => {
  const location = useLocation();
  const [application, setApplication] = useState(location.state?.application);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/application/", {
          params: {
            id: id,
          },
        });
        setApplication(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && !application) {
      fetchApplication();
    }
  }, [id, application]);

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {application && (
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
          <div className="flex flex-col items-center gap-6">
            <img
              src={application.petImage}
              alt="Pet Image"
              className="h-80 w-80 object-cover rounded-lg"
            />
            <Link
              to={`/pet/${application.microchipID}`}
              className="text-3xl text-primary font-bold whitespace-pre-line hover:underline"
            >
              {application.petName}
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center mt-10 gap-8">
            <div className="flex flex-row gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Application Status:
              </label>
              <div className="flex flex-row items-center gap-2">
                <p className="text-xl text-gray-600 whitespace-pre-line">
                  {application.status}
                </p>
                {getStatusIcon(application.status)}
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Shelter Name:
              </label>
              <p className="text-xl text-gray-600 whitespace-pre-line">
                {application.shelterName}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Submission Date:
              </label>
              <p className="text-xl text-gray-600 whitespace-pre-line">
                {new Date(application.submissionDate).toLocaleDateString()}
              </p>
            </div>
            {application.homeVisitDate && (
              <div className="flex flex-row items-center gap-2">
                <label className="text-gray-700 text-xl font-medium">
                  Home Visit Date:
                </label>
                <p className="text-xl text-gray-600 whitespace-pre-line">
                  {new Date(application.homeVisitDate).toLocaleString()}
                </p>
              </div>
            )}
            {application.shelterVisitDate && (
              <div className="flex flex-row items-center gap-2">
                <label className="text-gray-700 text-xl font-medium">
                  Shelter Visit Date:
                </label>
                <p className="text-xl text-gray-600 whitespace-pre-line">
                  {new Date(application.shelterVisitDate).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsUser;
