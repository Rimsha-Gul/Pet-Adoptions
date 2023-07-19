import { FiSearch } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { GoCalendar } from "react-icons/go";
import { MdHome } from "react-icons/md";
import { RiCheckLine, RiUserLine } from "react-icons/ri";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const statusIcons = [
  { name: "Under Review", icon: FiSearch, color: "grey" },
  {
    name: "Approved For Home Visit",
    icon: AiOutlineCheckCircle,
    color: "blue",
  },
  { name: "Home Visit Scheduled", icon: GoCalendar, color: "orange" },
  { name: "Home Approved", icon: MdHome, color: "green" },
  { name: "Home Rejected", icon: MdHome, color: "red" },
  { name: "User Visit Scheduled", icon: GoCalendar, color: "orange" },
  { name: "User Approved Shelter", icon: RiCheckLine, color: "green" },
  { name: "User Rejected Shelter", icon: RiUserLine, color: "red" },
  { name: "Approved", icon: FaCheckCircle, color: "green" },
  { name: "Rejected", icon: FaTimesCircle, color: "red" },
];

export const getStatusIcon = (status: string) => {
  const statusObj = statusIcons.find((item) => item.name === status);

  if (!statusObj) {
    return null;
  }

  const IconComponent = statusObj.icon;
  return <IconComponent color={statusObj.color} className="text-2xl mb-0.5" />;
};
