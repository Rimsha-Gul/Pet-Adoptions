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
      return "Approve Application";
    case Status.HomeRejected:
      return "Reject Applicant Home";
    case Status.Rejected:
      return "Reject Application";
    case Status.ReactivationRequested:
      return "Request Reactivation";
    case Status.ReactivationRequestApproved:
      return "Approve Request";
    case Status.ReactivationRequestDeclined:
      return "Decline Request";
    default:
      return null;
  }
};
