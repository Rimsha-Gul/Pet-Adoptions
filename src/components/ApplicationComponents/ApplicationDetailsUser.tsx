import { Link, useNavigate, useParams } from "react-router-dom";
import { getStatusIcon } from "../../utils/getStatusIcon";
import api from "../../api";
import { useEffect, useMemo, useState } from "react";
import loadingIcon from "../../assets/loading.gif";
import { Status, VisitType } from "../../types/enums";
import { statusButtonText } from "../../utils/getStatusButtonText";
import { getNextUserStatus } from "../../utils/getNextStatus";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";
import StatusButton from "./StatusButton";
import { Application } from "../../types/interfaces";
import ApplicationGroupedFields from "./ApplicationDetails";
import { applicationGroups } from "../../constants/groups";
import { BiLinkExternal } from "react-icons/bi";
import { isVisitDateReached } from "../../utils/isVisitDateReached";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ApplicationDetailsUser = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(application);

  const { id } = useParams();

  const groupedFields = useMemo(() => {
    return applicationGroups.map((group) => {
      return {
        ...group,
        fields: group.fields.filter((field) => {
          if (
            (field === "hasRentPetPermission" &&
              application?.residenceType !== "rentHouse") ||
            (field === "childrenAges" && !application?.hasChildren) ||
            (field === "otherPetsInfo" && !application?.hasOtherPets)
          ) {
            return false;
          }
          return true;
        }),
      };
    });
  }, [application]);

  const updateApplicationStatus = async () => {
    const nextStatus = getNextUserStatus(
      application?.status || Status.UnderReview
    );

    if (nextStatus) {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
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
        setApplication(response.data.application);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log(id);
    console.log(application);
    if (id && !application) {
      fetchApplication();
    }
  }, [id, application]);
  console.log(application);

  const handleReview = () => {
    navigate(`/shelterProfile/${application?.shelterID}`);
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {application && id && (
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
              <div className="flex flex-row items-end gap-2">
                {application.petName}
                <BiLinkExternal className="pb-0.5" />
              </div>
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center mt-10 gap-8">
            <div className="flex flex-row gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Application ID:
              </label>
              <div className="flex flex-row items-center gap-2">
                <p className="text-xl text-gray-600 whitespace-pre-line">
                  {application.id}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Application Status:
              </label>
              <div className="flex flex-row items-center gap-2">
                {getStatusIcon(application.status)}
                <p className="text-xl text-gray-600 whitespace-pre-line">
                  {application.status}
                </p>
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
          <div className="flex flex-col mx-auto w-full space-y-8 mt-8 mb-8 g-12">
            <ApplicationGroupedFields
              groupedFields={groupedFields}
              application={application}
            />
          </div>

          <div className="flex flex-row items-center justify-center gap-4 pt-16">
            {statusButtonText(getNextUserStatus(application.status)) && (
              <>
                <StatusButton
                  status={application.status}
                  action=""
                  isLoading={isLoading}
                  id={id}
                  updateApplicationStatus={updateApplicationStatus}
                  visitType={VisitType.Shelter}
                />
              </>
            )}
            {application.status === Status.UserVisitScheduled &&
              isVisitDateReached(application.shelterVisitDate) && (
                <button
                  className={`group relative w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white bg-primary hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:ring-offset-2" ${
                    isLoading
                      ? `bg-primary text-white cursor-not-allowed items-center`
                      : ""
                  }`}
                  onClick={handleReview}
                >
                  Review Shelter
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsUser;
