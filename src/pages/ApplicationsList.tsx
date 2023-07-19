import { useContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { getStatusIcon } from "../utils/getStatusIcon";
import loadingIcon from "../assets/loading.gif";
import { AppContext } from "../context/AppContext";

interface Application {
  id: string;
  status: string;
  submissionDate: Date;
  microchipID: string;
  petImage: string;
  petName: string;
  shelterName: string;
  applicantName: string;
}

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ViewApplications = () => {
  const appContext = useContext(AppContext);
  const userRole = appContext.userRole;
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noApplications, setNoApplications] = useState<boolean>(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/application/applications");
        if (response.data.length === 0) setNoApplications(true);
        console.log(response.data);
        setApplications(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      <h2 className="mt-12 text-center text-4xl font-extrabold text-primary mb-12">
        Your Applications
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {noApplications ? (
        <p className="text-gray-700 text-xl font-medium text-center">
          No adoption applications received at this moment
        </p>
      ) : (
        !isLoading &&
        applications && (
          <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
            <div className="flex flex-col justify-center gap-4">
              <div className="flex flex-row justify-between px-4">
                <div className="w-full grid grid-cols-3 items-center justify-evenly gap-4">
                  <h2 className="text-2xl text-gray-700 font-bold">
                    Application for
                  </h2>
                  <h2 className="text-2xl text-gray-700 font-bold">Status</h2>
                  {userRole === "SHELTER" ? (
                    <h2 className="text-2xl text-gray-700 font-bold">
                      Applicant
                    </h2>
                  ) : (
                    <h2 className="text-2xl text-gray-700 font-bold">
                      Submitted on
                    </h2>
                  )}
                </div>
              </div>
              <div className="border-b-2 border-gray-200"></div>
              {applications.map((application, index) => (
                <div
                  key={index}
                  className="flex flex-row hover:bg-gray-100 shadow-md p-4 flex flex-col justify-center items-center hover:cursor-pointer hover:shadow-primary transform transition-all duration-300 hover:scale-[1.01]"
                  onClick={() =>
                    navigate(`/view/application/${application.id}`, {
                      state: { application },
                    })
                  }
                >
                  <div className="w-full grid grid-cols-3 items-end justify-evenly gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-start gap-4">
                      <img
                        src={application.petImage}
                        alt="Pet Image"
                        className="h-20 w-20 object-cover rounded-t-lg"
                      />
                      <p className="text-xl text-gray-600 whitespace-pre-line">
                        {application.petName}
                      </p>
                    </div>
                    <div className="flex flex-row items-end gap-1">
                      {getStatusIcon(application.status)}
                      <p className="text-xl text-gray-600 whitespace-pre-line">
                        {application.status}
                      </p>
                    </div>
                    {userRole === "SHELTER" ? (
                      <p className="text-xl text-gray-600 whitespace-pre-line">
                        {application.applicantName}
                      </p>
                    ) : (
                      <p className="text-xl text-gray-600 whitespace-pre-line">
                        {new Date(
                          application.submissionDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="border-b-2 border-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ViewApplications;
