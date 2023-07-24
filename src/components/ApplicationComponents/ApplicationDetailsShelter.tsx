import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { Link, useParams } from "react-router-dom";
import loadingIcon from "../../assets/loading.gif";
import { Status, VisitType } from "../../types/enums";
import { getNextShelterStatus } from "../../utils/getNextStatus";
import { formatFieldValue } from "../../utils/formatFieldValue";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";
import { statusButtonText } from "../../utils/getStatusButtonText";
import StatusButton from "./StatusButton";

export interface Application {
  id: string;
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
  homeVisitDate: string;
  shelterVisitDate: string;
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
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

  const applicationFieldLabels: Record<keyof Application, string> = {
    id: "Application ID",
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
    homeVisitDate: "Home Visit Date",
    shelterVisitDate: "Shelter Visit Date",
  };

  const groupedFields = useMemo(() => {
    return groups.map((group) => {
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
    const nextStatus = getNextShelterStatus(
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
      } finally {
        action === "approve" ? setIsApproving(false) : setIsRejecting(false);
        console.log(application);
      }
    }
  };

  interface FieldProps {
    field: keyof Application;
    application: Application;
    fieldLabels: typeof applicationFieldLabels;
    className?: string;
  }

  function TextualField({
    field,
    application,
    fieldLabels,
    className,
  }: FieldProps) {
    return (
      <div key={field} className={`flex items-start gap-2 ${className}`}>
        <label className="text-gray-700 text-xl font-medium">
          {fieldLabels[field]}:
        </label>
        <p className="text-xl text-gray-600 whitespace-pre-line">
          {formatFieldValue(field, application[field])}
        </p>
      </div>
    );
  }

  function BooleanField({
    field,
    application,
    fieldLabels,
    className,
  }: FieldProps) {
    return (
      <div
        key={field}
        className={`flex flex-row items-center gap-2 ${className}`}
      >
        <label className="text-gray-700 text-xl font-medium">
          {fieldLabels[field]}:
        </label>
        <p className="text-xl text-gray-700 whitespace-pre-line">
          {formatFieldValue(field, application[field])}
        </p>
      </div>
    );
  }

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
              {application.petName}
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
            {groupedFields.map((group) => (
              <div key={group.label}>
                <h2 className="text-2xl text-primary font-bold mb-4 mt-2">
                  {group.label}
                </h2>
                <div className="border-b-2 border-gray-200 my-2"></div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-10">
                  {group.fields.map((field) => {
                    const applicationField = field as keyof Application;
                    if (
                      field === "petActivities" ||
                      field === "handlePetIssues" ||
                      field === "moveWithPet" ||
                      field === "petTravelPlans" ||
                      field === "petOutlivePlans"
                    )
                      return (
                        <TextualField
                          field={applicationField}
                          application={application}
                          fieldLabels={applicationFieldLabels}
                          className="flex-col"
                        />
                      );
                    if (
                      typeof application[field as keyof Application] ===
                      "boolean"
                    )
                      return (
                        <BooleanField
                          field={applicationField}
                          application={application}
                          fieldLabels={applicationFieldLabels}
                          className="flex-row"
                        />
                      );
                    return (
                      <TextualField
                        field={applicationField}
                        application={application}
                        fieldLabels={applicationFieldLabels}
                        className="flex-row"
                      />
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
                  <StatusButton
                    status={application.status}
                    action="approve"
                    visitDate={application.homeVisitDate || ""}
                    isLoading={isLoading}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    id={id}
                    updateApplicationStatus={updateApplicationStatus}
                    visitType={VisitType.Shelter}
                  />
                  <StatusButton
                    status={application.status}
                    action="reject"
                    visitDate={application.homeVisitDate || ""}
                    isLoading={isLoading}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    id={id}
                    updateApplicationStatus={updateApplicationStatus}
                    visitType={VisitType.Shelter}
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
                      id={id}
                      updateApplicationStatus={updateApplicationStatus}
                      visitType={VisitType.Shelter}
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
