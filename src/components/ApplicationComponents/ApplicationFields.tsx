import { formatFieldValue } from "../../utils/formatFieldValue";
import { Application } from "../../types/interfaces";

const applicationFieldLabels: Record<
  keyof Omit<Application, "shelterID">,
  string
> = {
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
  canAffordPetsMedical: "Can Afford Pet Medical Costs",
  petTravelPlans: "Travel Plans With Pet",
  petOutlivePlans: "Plans incase Pet Outlives Applicant",
  homeVisitDate: "Home Visit Date",
  shelterVisitDate: "Shelter Visit Date",
  homeVisitEmailSentDate: "",
  shelterVisitEmailSentDate: "",
  homeVisitScheduleExpiryDate: "",
  shelterVisitScheduleExpiryDate: "",
};

interface FieldProps {
  field: keyof Omit<Application, "shelterID">;
  application: Application;
  className?: string;
}

const fieldLabels: typeof applicationFieldLabels = applicationFieldLabels;

export const TextualField = ({ field, application, className }: FieldProps) => {
  return (
    <div key={field} className={`flex items-start gap-2 ${className}`}>
      <label className="text-gray-700 text-md sm:text-xl font-medium">
        {fieldLabels[field]}:
      </label>
      <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
        {formatFieldValue(field, application[field])}
      </p>
    </div>
  );
};

export const BooleanField = ({ field, application, className }: FieldProps) => {
  return (
    <div
      key={field}
      className={`flex flex-row items-center gap-2 ${className}`}
    >
      <label className="text-gray-700 text-md sm:text-xl font-medium">
        {fieldLabels[field]}:
      </label>
      <p className="text-md sm:text-xl text-gray-700 whitespace-pre-line">
        {formatFieldValue(field, application[field])}
      </p>
    </div>
  );
};
