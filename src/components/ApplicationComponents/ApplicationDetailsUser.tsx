import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getStatusIcon } from "../../utils/getStatusIcon";
import api from "../../api";
import { useEffect, useState } from "react";
import loadingIcon from "../../assets/loading.gif";
import moment from "moment";
import { Status } from "../../types/enums";
import { statusButtonText } from "../../utils/getStatusButtonText";
import { getNextUserStatus } from "../../utils/getNextStatus";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ApplicationDetailsUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(location.state?.application);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  console.log(application);

  const { id } = useParams();

  const StatusButton = ({ status, action, shelterVisitDate }: any) => {
    // Get the current date.
    const currentDate = moment().utc();
    console.log(currentDate);

    // Parse shelterVisitDate as a UTC time.
    const shelterVisitDateObj = moment.utc(shelterVisitDate);
    console.log(shelterVisitDateObj);

    // Check if the shelterVisitDate has been reached.
    const isshelterVisitDateReached =
      currentDate.isSameOrAfter(shelterVisitDateObj);
    console.log(isshelterVisitDateReached);

    const handleStatusUpdate = () => {
      if (status === Status.HomeVisitRequested) {
        navigate(`/${id}/scheduleHomeVisit`);
      } else {
        updateApplicationStatus(action);
      }
    };

    let buttonColor = "";
    let hoverColor = "";
    switch (action) {
      case "approve":
        buttonColor = "lime-500";
        hoverColor = "text-lime-500";
        break;
      case "reject":
        buttonColor = "red-600";
        hoverColor = "text-red-600";
        break;
      default:
        buttonColor = "primary";
        hoverColor = "text-primary";
    }

    // If the shelterVisitDate has not been reached, return null to prevent rendering the button.
    if (!isshelterVisitDateReached && status === Status.UserVisitScheduled) {
      return null;
    }
    console.log(status);
    console.log(getNextUserStatus(status, action));
    console.log(statusButtonText(getNextUserStatus(status, action)));

    return (
      <button
        className={`group relative w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white bg-${buttonColor} hover:bg-white hover:ring-2 hover:ring-${buttonColor} hover:ring-offset-2 hover:${hoverColor} ${
          isLoading ? `${buttonColor} text-white cursor-not-allowed` : ""
        }`}
        onClick={handleStatusUpdate}
      >
        {(action === "approve" && isApproving) ||
        (action === "reject" && isRejecting) ? (
          <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
        ) : null}
        {statusButtonText(getNextUserStatus(status, action))}
      </button>
    );
  };

  const updateApplicationStatus = async (action: string) => {
    const nextStatus = getNextUserStatus(
      application?.status || Status.UnderReview,
      action
    );

    if (nextStatus) {
      try {
        action === "approve" ? setIsApproving(true) : setIsRejecting(true);
        const response = await api.put("/application/updateStatus", {
          id: id,
          status: nextStatus,
        });
        if (response.status === 200) {
          showSuccessAlert(response.data.message, undefined, () =>
            setApplication(null)
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          showErrorAlert(error.response);
        }
        console.error;
      } finally {
        action === "approve" ? setIsApproving(false) : setIsRejecting(false);
        console.log(application);
      }
    }
  };

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
  console.log(application);

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
          <div className="flex flex-row items-center justify-center gap-4 pt-16">
            {application.status === Status.UserVisitScheduled ? (
              <>
                <StatusButton
                  status={application.status}
                  action="approve"
                  shelterVisitDate={application.shelterVisitDate}
                />
                <StatusButton
                  status={application.status}
                  action="reject"
                  shelterVisitDate={application.shelterVisitDate}
                />
              </>
            ) : (
              statusButtonText(
                getNextUserStatus(application.status, "approve")
              ) && (
                <>
                  <StatusButton
                    status={application.status}
                    action=""
                    shelterVisitDate={application.shelterVisitDate}
                  />
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsUser;
