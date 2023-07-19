import { useEffect, useState } from "react";
import api from "../../api";
import { Link, useParams } from "react-router-dom";
import loadingIcon from "../../assets/loading.gif";
import { Status } from "../../types/enums";
import { getNextStatus } from "../../utils/getNextStatus";
import { formatFieldValue } from "../../utils/formatFieldValue";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";

export interface Application {
  petImage: string;
  petName: string;
  status: Status;
  applicantEmail: string;
  applicantName: string;
  shelterName: string;
  submissionDate: string;
  microchipID: string;
  residenceType: string;
  hasRentPetPermission: boolean;
  hasChildren: boolean;
  childrenAges: string;
  hasOtherPets: boolean;
  otherPetsInfo: string;
  petAloneTime: number;
  hasPlayTimeParks: boolean;
  petActivities: string;
  handlePetIssues: string;
  moveWithPet: string;
  canAffordPetsNeeds: boolean;
  canAffordPetsMediacal: boolean;
  petTravelPlans: string;
  petOutlivePlans: string;
}

const groups = [
  {
    label: "Residence Information",
    fields: [
      "residenceType",
      "hasRentPetPermission",
      "hasChildren",
      "childrenAges",
      "hasOtherPets",
      "otherPetsInfo",
    ],
  },
  {
    label: "Pet Engagement Information",
    fields: ["petAloneTime", "hasPlayTimeParks", "petActivities"],
  },
  {
    label: "Pet Commitment Information",
    fields: [
      "handlePetIssues",
      "moveWithPet",
      "canAffordPetsNeeds",
      "canAffordPetsMediacal",
      "petTravelPlans",
      "petOutlivePlans",
    ],
  },
];

const ApplicationDetailsShelter = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

  const applicationFieldLabels: Record<keyof Application, string> = {
    petImage: "Pet Image",
    petName: "Pet Name",
    status: "Application Status",
    applicantEmail: "Applicant Email",
    applicantName: "Applicant Name",
    shelterName: "Shelter Name",
    submissionDate: "Submission Date",
    microchipID: "Microchip ID",
    residenceType: "Residence Type",
    hasRentPetPermission: "Has Permission to Rent Pet",
    hasChildren: "Has Children",
    childrenAges: "Children Ages",
    hasOtherPets: "Has Other Pets",
    otherPetsInfo: "Other Pets Info",
    petAloneTime: "Pet Daily Alone Time",
    hasPlayTimeParks: "Has Play Time Parks",
    petActivities: "Activities the appllicant will like to do with the pet",
    handlePetIssues: "How Applicant Will Handle Pet Issues",
    moveWithPet: "Plans for Pet if Applicant has to Move",
    canAffordPetsNeeds: "Can Afford Pet Needs",
    canAffordPetsMediacal: "Can Afford Pet Medical Costs",
    petTravelPlans: "Travel Plans With Pet",
    petOutlivePlans: "Plans incase Pet Outlives Applicant",
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/shelter/application/", {
          params: {
            id: id,
          },
        });
        console.log(response.data);
        setApplication(response.data.application);
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

  const updateApplicationStatus = async (action: string) => {
    const nextStatus = getNextStatus(
      application?.status || Status.UnderReview,
      action
    );
    if (nextStatus) {
      try {
        setIsLoading(true);
        const response = await api.put("/shelter/updateApplicationStatus", {
          id: id,
          status: nextStatus,
        });
        if (response.status === 200) {
          showSuccessAlert(response.data.message, undefined, () =>
            setApplication(null)
          );
        }
      } catch (error: any) {
        showErrorAlert(error.response.data);
      } finally {
        setIsLoading(false);
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
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Applicant Name:
              </label>
              <p className="text-xl text-gray-600 whitespace-pre-line">
                {application.applicantName}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 text-xl font-medium">
                Applicant Email:
              </label>
              <p className="text-xl text-gray-600 whitespace-pre-line">
                {application.applicantEmail}
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
          </div>
          <div className="flex flex-col mx-auto w-full space-y-8 mt-8 mb-8 g-12">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-2xl text-primary font-bold mb-4 mt-2">
                  {group.label}
                </h2>
                <div className="border-b-2 border-gray-200 my-2"></div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-10">
                  {group.fields.map((field) => {
                    if (
                      (field === "hasRentPetPermission" &&
                        application.residenceType !== "rentHouse") ||
                      (field === "childrenAges" && !application.hasChildren) ||
                      (field === "otherPetsInfo" && !application.hasOtherPets)
                    ) {
                      return null; // Don't render the field if the condition is not met
                    }
                    if (
                      field === "petActivities" ||
                      field === "handlePetIssues" ||
                      field === "moveWithPet" ||
                      field === "petTravelPlans" ||
                      field === "petOutlivePlans"
                    )
                      return (
                        <div
                          key={field}
                          className="flex flex-col items-start gap-2"
                        >
                          <label className="text-gray-700 text-xl font-medium">
                            {applicationFieldLabels[field as keyof Application]}
                            :
                          </label>

                          <p className="text-xl text-gray-600 whitespace-pre-line">
                            {formatFieldValue(
                              field as keyof Application,
                              application[field as keyof Application]
                            )}
                          </p>
                        </div>
                      );
                    return (
                      <div
                        key={field}
                        className="flex flex-row items-center gap-2"
                      >
                        <label className="text-gray-700 text-xl font-medium">
                          {applicationFieldLabels[field as keyof Application]}:
                        </label>

                        <p className="text-xl text-gray-600 whitespace-pre-line">
                          {formatFieldValue(
                            field as keyof Application,
                            application[field as keyof Application]
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-row gap-2 pt-8">
              <label className="text-gray-700 text-xl font-medium">
                Application Status:
              </label>
              <p className="text-xl text-gray-600 whitespace-pre-line">
                {application.status}
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
              {application.status === Status.UnderReview ||
              application.status === Status.HomeVisitScheduled ||
              application.status === Status.UserApprovedShelter ? (
                <>
                  <label className="text-gray-700 text-xl font-medium">
                    Update Status to:
                  </label>
                  <button
                    className="group relative w-1/5 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-lime-500 bg-lime-500 hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-lime-500"
                    onClick={() => updateApplicationStatus("approve")}
                  >
                    {getNextStatus(application.status, "approve")}
                  </button>
                  <button
                    className="group relative w-1/5 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-red-600 bg-red-600 hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-red-600"
                    onClick={() => updateApplicationStatus("reject")}
                  >
                    {getNextStatus(application.status, "reject")}
                  </button>
                </>
              ) : (
                getNextStatus(application.status, "approve") && (
                  <>
                    <label className="text-gray-700 text-xl font-medium">
                      Update Status to:
                    </label>

                    <button
                      className="group relative w-1/5 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary"
                      onClick={() => updateApplicationStatus("approve")}
                    >
                      {getNextStatus(application.status, "approve")}
                    </button>
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
