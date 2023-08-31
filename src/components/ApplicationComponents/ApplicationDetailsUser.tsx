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
import { Application, ReactivationRequest } from "../../types/interfaces";
import ApplicationGroupedFields from "./ApplicationDetails";
import { applicationGroups } from "../../constants/groups";
import { BiLinkExternal } from "react-icons/bi";
import ReactivationRequestDetails from "./ReactivationRequestDetails";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const ApplicationDetailsUser = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [canUserReview, setCanUserReview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showReactivationModal, setShowReactivationModal] =
    useState<boolean>(false);
  const [reasonNotScheduled, setReasonNotScheduled] = useState<string>("");
  const [reasonToReactivate, setReasonToReactivate] = useState<string>("");
  const [reactivationRequest, setReactivationRequest] =
    useState<ReactivationRequest | null>(null);

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
    if (application) {
      const nextStatus = getNextUserStatus(application?.status);

      if (nextStatus === Status.ReactivationRequested) {
        setShowReactivationModal(true); // Show the modal when the next status is ReactivationRequested
        return;
      }

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
        const { application, canReview } = response.data;
        setCanUserReview(canReview);
        setApplication(application);
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

  useEffect(() => {
    const fetchReactivationRequest = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/reactivationRequest/", {
          params: {
            id: id,
          },
        });
        console.log(response.data);
        setReactivationRequest(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (application && application.status === Status.ReactivationRequested) {
      fetchReactivationRequest();
    }
  }, [application]);

  const handleReview = () => {
    navigate(`/shelterProfile/${application?.shelterID}`);
  };

  const handleReactivationRequest = async () => {
    console.log(reasonNotScheduled);
    console.log(reasonToReactivate);

    try {
      setIsLoading(true);
      // Adjust this API call according to your backend's needs
      const response = await api.post("/reactivationRequest", {
        applicationID: id,
        reasonNotScheduled: reasonNotScheduled,
        reasonToReactivate: reasonToReactivate,
      });
      if (response.status === 200) {
        showSuccessAlert(response.data.message, undefined, () =>
          setApplication(null)
        );
      }
    } catch (error: any) {
      showErrorAlert(error.response);
      console.error;
    } finally {
      setIsLoading(false);
      setShowReactivationModal(false); // Hide the modal
    }
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
              className="h-60 w-60 sm:h-80 sm:w-80 object-cover rounded-lg"
            />
            <Link
              to={`/pet/${application.microchipID}`}
              className="text-2xl sm:text-3xl text-primary font-bold whitespace-pre-line hover:underline"
            >
              <div className="flex flex-row items-end gap-2">
                {application.petName}
                <BiLinkExternal className="pb-0.5" />
              </div>
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center mt-10 gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Application ID:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                  {application.id}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Application Status:
              </label>
              <div className="flex flex-row items-center gap-2">
                {getStatusIcon(application.status)}
                <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                  {application.status}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Shelter Name:
              </label>
              <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                {application.shelterName}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Submission Date:
              </label>
              <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                {new Date(application.submissionDate).toLocaleDateString()}
              </p>
            </div>
            {application.homeVisitDate && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-gray-700 text-md sm:text-xl font-medium">
                  Home Visit Date:
                </label>
                <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                  {new Date(application.homeVisitDate).toLocaleString()}
                </p>
              </div>
            )}
            {application.shelterVisitDate && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-gray-700 text-md sm:text-xl font-medium">
                  Shelter Visit Date:
                </label>
                <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
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
          {reactivationRequest && (
            <ReactivationRequestDetails
              reactivationRequest={reactivationRequest}
            />
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 sm:pt-16">
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
            {canUserReview && (
              <button
                className={`group relative w-1/2 sm:w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-sm sm:text-md uppercase font-medium rounded-md text-white bg-primary hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:ring-offset-2" ${
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
          {showReactivationModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-title"
                        >
                          Reactivation Request
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Please provide your reasons for the reactivation
                            request.
                          </p>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Reason for not scheduling before:
                          </label>
                          <textarea
                            className="p-2 border resize rounded-md w-full"
                            placeholder="Your reason..."
                            value={reasonNotScheduled}
                            onChange={(e) =>
                              setReasonNotScheduled(e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Reason to reactivate now:
                          </label>
                          <textarea
                            className="p-2 border resize rounded-md w-full"
                            placeholder="Your reason..."
                            value={reasonToReactivate}
                            onChange={(e) =>
                              setReasonToReactivate(e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary-10 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-primary text-base font-medium text-white hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        isLoading
                          ? `bg-primary opacity-70 text-white items-center`
                          : ""
                      }`}
                      onClick={handleReactivationRequest}
                    >
                      {isLoading && (
                        <img
                          src={loadingIcon}
                          alt="Loading"
                          className="mr-2 h-4 w-4"
                        />
                      )}
                      Submit
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-md px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowReactivationModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsUser;
