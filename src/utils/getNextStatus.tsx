import { Status } from "../types/enums";

export const getNextStatus = (currentStatus: Status, action: string) => {
  switch (currentStatus) {
    case Status.UnderReview:
      return action === "approve"
        ? Status.ApprovedForHomeVisit
        : Status.Rejected;
    case Status.ApprovedForHomeVisit:
      return Status.HomeVisitScheduled;
    case Status.HomeVisitScheduled:
      return action === "approve" ? Status.HomeApproved : Status.HomeRejected;
    case Status.HomeApproved:
      return Status.UserVisitScheduled;
    case Status.HomeRejected:
      return null;
    case Status.UserVisitScheduled:
      return action === "approve"
        ? Status.UserApprovedShelter
        : Status.UserRejectedShelter;
    case Status.UserApprovedShelter:
      return action === "approve" ? Status.Approved : Status.Rejected;
    case Status.UserRejectedShelter:
    case Status.Approved:
    case Status.Rejected:
    default:
      return null;
  }
};
