import { Status } from "../types/enums";

export const getNextShelterStatus = (currentStatus: Status, action: string) => {
  switch (currentStatus) {
    case Status.UnderReview:
      return action === "approve" ? Status.HomeVisitRequested : Status.Rejected;

    case Status.HomeVisitScheduled:
      return action === "approve" ? Status.HomeApproved : Status.HomeRejected;
    case Status.HomeApproved:
      return Status.UserVisitScheduled;
    case Status.HomeRejected:
      return null;

    case Status.Approved:
    case Status.Rejected:
    default:
      return null;
  }
};

export const getNextUserStatus = (currentStatus: Status, action: string) => {
  switch (currentStatus) {
    case Status.HomeVisitRequested:
      return Status.HomeVisitScheduled;
    case Status.UserVisitScheduled:
      return action === "approve"
        ? Status.UserApprovedShelter
        : Status.UserRejectedShelter;
    default:
      return null;
  }
};
