import { Status } from "../types/enums";

export const getNextShelterStatus = (currentStatus: Status, action: string) => {
  switch (currentStatus) {
    case Status.UnderReview:
      return action === "approve" ? Status.HomeVisitRequested : Status.Rejected;
    case Status.HomeVisitScheduled:
      return action === "approve" ? Status.HomeApproved : Status.HomeRejected;
    case Status.HomeApproved:
      return Status.UserVisitScheduled;
    case Status.UserVisitScheduled:
      return action === "approve" ? Status.Approved : Status.Rejected;
    default:
      return null;
  }
};

export const getNextUserStatus = (currentStatus: Status) => {
  switch (currentStatus) {
    case Status.HomeVisitRequested:
      return Status.HomeVisitScheduled;
    case Status.Expired:
      return Status.ReactivationRequested;
    default:
      return null;
  }
};
