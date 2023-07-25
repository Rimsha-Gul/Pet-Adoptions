import { Status } from "./enums";

export interface Application {
  id: string;
  status: Status;
  submissionDate: string;
  shelterName: string;
  microchipID: string;
  petImage: string;
  petName: string;
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
  applicantEmail: string;
  applicantName: string;
  homeVisitDate?: string;
  shelterVisitDate?: string;
  homeVisitEmailSentDate?: string;
  shelterVisitEmailSentDate?: string;
}
