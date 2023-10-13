import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import loadingIcon from "../../assets/loading.gif";
import { Status, VisitType } from "../../types/enums";
import { getNextShelterStatus } from "../../utils/getNextStatus";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";
import { statusButtonText } from "../../utils/getStatusButtonText";
import StatusButton from "./StatusButton";
import { getStatusIcon } from "../../utils/getStatusIcon";
import { applicationGroups } from "../../constants/groups";
import { Application, ReactivationRequest } from "../../types/interfaces";
import ApplicationGroupedFields from "./ApplicationDetails";
import { BiLinkExternal } from "react-icons/bi";
import ReactivationRequestDetails from "./ReactivationRequestDetails";

const ApplicationDetailsShelter = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visitDate, setVisitDate] = useState<string>("");
  const [reactivationRequest, setReactivationRequest] =
    useState<ReactivationRequest | null>(null);
  const { applicationID } = useParams();

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

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/shelters/applications/${applicationID}`
        );
        console.log(response.data);
        setApplication(response.data.application);
        if (response.data.application.status === Status.HomeVisitScheduled)
          setVisitDate(response.data.application.homeVisitDate);
        else if (response.data.application.status === Status.UserVisitScheduled)
          setVisitDate(response.data.application.shelterVisitDate);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationID && !application) {
      fetchApplication();
    }
  }, [applicationID, application]);

  useEffect(() => {
    const fetchReactivationRequest = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/reactivationRequest/${applicationID}`);
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

  const updateApplicationStatus = async (action: string) => {
    const nextStatus = getNextShelterStatus(
      application?.status || Status.UnderReview,
      action
    );

    if (nextStatus) {
      try {
        action === "approve" ? setIsApproving(true) : setIsRejecting(true);
        const response = await api.put(
          `/applications/${applicationID}/status`,
          {
            status: nextStatus,
          }
        );
        if (response.status === 200) {
          showSuccessAlert(response.data.message, undefined, () =>
            setApplication(null)
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          showErrorAlert(error.response);
        }
      } finally {
        action === "approve" ? setIsApproving(false) : setIsRejecting(false);
        console.log(application);
      }
    }
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {application && applicationID && (
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
          <div className="flex flex-col items-center gap-6">
            <img
              src={application.petImage}
              alt="Pet Image"
              className="h-60 w-60 sm:h-80 sm:w-80 object-cover rounded-lg"
            />
            <a
              data-cy="shelter-link"
              className="text-2xl sm:text-3xl text-primary font-bold whitespace-pre-line hover:underline"
              href={`/pet/${application.microchipID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row items-end gap-2">
                {application.petName}
                <BiLinkExternal className="pb-0.5" />
              </div>
            </a>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center mt-10 gap-6 sm:gap-8">
            <div className="flex flex flex-col sm:flex-row gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Application ID:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                  {application.id}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Applicant Name:
              </label>
              <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                {application.applicantName}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Applicant Email:
              </label>
              <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
                {application.applicantEmail}
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
            <div className="flex flex-col sm:flex-row gap-2 pt-8">
              <label className="text-gray-700 text-md sm:text-xl font-medium">
                Application Status:
              </label>
              <div className="flex flex-row items-center gap-2">
                {getStatusIcon(application.status)}
                <p
                  data-cy="application-status"
                  className="text-md sm:text-xl text-gray-600 whitespace-pre-line"
                >
                  {application.status}
                </p>
              </div>
            </div>
            {reactivationRequest && (
              <ReactivationRequestDetails
                reactivationRequest={reactivationRequest}
              />
            )}

            <div className="flex flex-row items-center justify-center gap-4">
              {application.status === Status.UnderReview ||
              application.status === Status.HomeVisitScheduled ||
              application.status === Status.UserVisitScheduled ||
              application.status === Status.ReactivationRequested ? (
                <>
                  <StatusButton
                    status={application.status}
                    action="approve"
                    visitDate={visitDate}
                    isLoading={isLoading}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    id={applicationID}
                    updateApplicationStatus={updateApplicationStatus}
                    visitType={VisitType.Home}
                  />
                  <StatusButton
                    status={application.status}
                    action="reject"
                    visitDate={visitDate}
                    isLoading={isLoading}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    id={applicationID}
                    updateApplicationStatus={updateApplicationStatus}
                    visitType={VisitType.Home}
                  />
                </>
              ) : (
                statusButtonText(
                  getNextShelterStatus(application.status, "approve")
                ) && (
                  <>
                    <StatusButton
                      status={application.status}
                      action=""
                      visitDate={application.homeVisitDate || ""}
                      isLoading={isLoading}
                      isApproving={isApproving}
                      isRejecting={isRejecting}
                      id={applicationID}
                      updateApplicationStatus={updateApplicationStatus}
                      visitType={VisitType.Home}
                    />
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsShelter;
