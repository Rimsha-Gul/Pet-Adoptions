import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

interface Application {
  status: string;
  submissionDate: Date;
  petName: string;
  shelterName: string;
}

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ViewApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/application/applications");
        setApplications(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      <h2 className="mt-6 text-center text-4xl font-extrabold text-primary mb-12">
        Your Applications
      </h2>
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row justify-between px-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-evenly">
              <h2 className="text-2xl text-gray-700 font-bold">
                Application for
              </h2>
              <h2 className="text-2xl text-gray-700 font-bold">Status</h2>
              <h2 className="text-2xl text-gray-700 font-bold">Submitted on</h2>
            </div>
          </div>
          <div className="border-b-2 border-gray-200 my-2"></div>
          {applications.map((app, index) => (
            <Link
              to={`/view/application/${app.petName}`}
              className="cursor-pointer"
            >
              <div
                key={index}
                className="flex flex-row justify-between px-4 pt-4 cursor-pointer hover:text-2xl hover:bg-gray-100 hover:border-b border-primary transition-all duration-200"
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-evenly">
                  <p className="text-lg text-gray-600 text-justify whitespace-pre-line">
                    {app.petName}
                  </p>
                  <p className="text-lg text-gray-600 text-justify whitespace-pre-line">
                    {app.status}
                  </p>
                  <p className="text-lg text-gray-600 text-justify whitespace-pre-line">
                    {new Date(app.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewApplications;
