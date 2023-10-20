import { Status } from "./enums";

export interface SignupFormProps {
  initialEmail?: string;
  initialRole?: string;
}

export interface User {
  profilePhoto: string | File;
  name: string;
  email: string;
  address: string;
  bio: string;
}

export interface Shelter extends User {
  canReview: boolean;
  rating: number;
  numberOfReviews: number;
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
  canAffordPetsMedical: boolean;
  petTravelPlans: string;
  petOutlivePlans: string;
  applicantEmail: string;
  applicantName: string;
  homeVisitDate?: string;
  shelterVisitDate?: string;
  homeVisitEmailSentDate?: string;
  shelterVisitEmailSentDate?: string;
  homeVisitScheduleExpiryDate?: string;
  shelterVisitScheduleExpiryDate: string;
}

export interface Review {
  applicantName: string;
  applicantEmail: string;
  rating: number;
  reviewText: string;
}

export interface ReactivationRequest {
  reasonNotScheduled: string;
  reasonToReactivate: string;
}

export interface Notification {
  id: string;
  applicationID: string;
  status: Status;
  petImage: string;
  isRead: boolean;
  actionUrl: string;
  date: string;
}
