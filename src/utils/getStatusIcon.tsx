import { FiSearch } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { GoCalendar } from "react-icons/go";
import { BiCalendarCheck } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const statusIcons = [
  { name: "Under Review", icon: FiSearch, color: "grey" },
  {
    name: "Approved For Home Visit",
    icon: AiOutlineCheckCircle,
    color: "blue",
  },
  { name: "Home Visit Scheduled", icon: GoCalendar, color: "orange" },
  { name: "Home Visit Completed", icon: BiCalendarCheck, color: "purple" },
  { name: "Approved", icon: FaCheckCircle, color: "green" },
  { name: "Denied", icon: FaTimesCircle, color: "red" },
];

export const getStatusIcon = (status: string) => {
  const statusObj = statusIcons.find((item) => item.name === status);

  if (!statusObj) {
    return null;
  }

  const IconComponent = statusObj.icon;
  return <IconComponent color={statusObj.color} className="text-2xl mb-0.5" />;
};
