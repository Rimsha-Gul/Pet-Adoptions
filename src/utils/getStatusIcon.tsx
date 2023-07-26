import { FiSearch } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import { MdHome } from "react-icons/md";
import { FaCheckCircle, FaLock, FaTimesCircle } from "react-icons/fa";
import { Status } from "../types/enums";

export const statusIcons = [
  { name: Status.UnderReview, icon: FiSearch, color: "grey" },
  {
    name: Status.HomeVisitRequested,
    icon: MdHome,
    color: "purple",
  },
  { name: Status.HomeVisitScheduled, icon: GoCalendar, color: "orange" },
  { name: Status.HomeApproved, icon: MdHome, color: "green" },
  { name: Status.HomeRejected, icon: MdHome, color: "red" },
  { name: Status.UserVisitScheduled, icon: GoCalendar, color: "orange" },
  { name: Status.Approved, icon: FaCheckCircle, color: "green" },
  { name: Status.Rejected, icon: FaTimesCircle, color: "red" },
  { name: Status.Closed, icon: FaLock, color: "slategray" },
];

export const getStatusIcon = (status: string) => {
  const statusObj = statusIcons.find((item) => item.name === status);

  if (!statusObj) {
    return null;
  }

  const IconComponent = statusObj.icon;
  return <IconComponent color={statusObj.color} className="text-2xl mb-0.5" />;
};
