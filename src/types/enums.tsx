export enum UserRole {
  User = "USER",
  Shelter = "SHELTER",
}

export enum Status {
  UnderReview = "Under Review",
  HomeVisitRequested = "Home Visit Requested",
  HomeVisitScheduled = "Home Visit Scheduled",
  HomeApproved = "Home Approved",
  HomeRejected = "Home Rejected",
  UserVisitScheduled = "User Visit Scheduled",
  Approved = "Approved",
  Rejected = "Rejected",
  Closed = "Closed",
  Expired = "Expired",
  ReactivationRequested = "Reactivation Requested",
}

export enum VisitType {
  Home = "Home",
  Shelter = "Shelter",
}

export enum RequestType {
  changePassword = "Change PAssword",
  resetPassword = "Reset Password",
}
