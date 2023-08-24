import { Status } from "../types/enums";

export const statusButtonText = (status: Status | null) => {
  switch (status) {
    case Status.HomeVisitRequested:
      return "Request for Home Visit";
    case Status.HomeVisitScheduled:
      return "Schedule Shelter's Visit to Your Home";
    case Status.HomeApproved:
      return "Approve Applicant Home";
    case Status.UserVisitScheduled:
      return "Schedule Applicant's Visit to Shelter";
    case Status.Approved:
      return "Approve Aplication";
    case Status.HomeRejected:
      return "Reject Applicant Home";
    case Status.Rejected:
      return "Reject Application";
    case Status.ReactivationRequested:
      return "Request for Reactivation";
    default:
      return null;
  }
};
