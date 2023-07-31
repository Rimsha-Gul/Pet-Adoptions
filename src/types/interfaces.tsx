import { Status } from "./enums";

export interface User {
  profilePhoto: string | File;
  name: string;
  email: string;
  address: string;
  bio: string;
  canReview?: boolean;
}

export interface Application {
  id: string;
  status: Status;
  submissionDate: string;
  shelterID: string;
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
