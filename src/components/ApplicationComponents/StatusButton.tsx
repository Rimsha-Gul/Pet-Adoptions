import { useNavigate } from "react-router-dom";
import { Status, VisitType } from "../../types/enums";
import { statusButtonText } from "../../utils/getStatusButtonText";
import {
  getNextShelterStatus,
  getNextUserStatus,
} from "../../utils/getNextStatus";
import loadingIcon from "../../assets/loading.gif";
import moment from "moment";

interface StatusButtonProps {
  status: Status;
  action: string;
  visitDate: string;
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  id: string;
  updateApplicationStatus: (action: string) => void;
  visitType: VisitType;
}

export const StatusButton = ({
  status,
  action,
  visitDate,
  isLoading,
  isApproving,
  isRejecting,
  id,
  updateApplicationStatus,
  visitType,
}: StatusButtonProps) => {
  const navigate = useNavigate();

  // Get the current date.
  const currentDate = moment().utc();
  console.log(currentDate);

  // Parse visitDate as a UTC time.
  const visitDateObj = moment.utc(visitDate);
  console.log(visitDateObj);

  // Check if the shelterVisitDate has been reached.
  const isVisitDateReached = currentDate.isSameOrAfter(visitDateObj);
  console.log(isVisitDateReached);

  const handleStatusUpdate = () => {
    if (visitType === VisitType.Home)
      if (status === Status.HomeVisitRequested) {
        navigate(`/${id}/scheduleHomeVisit`);
      } else {
        updateApplicationStatus(action);
      }
    else if (visitType === VisitType.Shelter) {
      if (status === Status.HomeApproved) {
        navigate(`/${id}/scheduleShelterVisit`);
      } else {
        updateApplicationStatus(action);
      }
    }
  };

  let buttonColor = "";
  let hoverColor = "";
  let ringColor = "";
  switch (action) {
    case "approve":
      buttonColor = "bg-lime-500";
      hoverColor = "hover:text-lime-500";
      ringColor = " hover:ring-lime-500";
      break;
    case "reject":
      buttonColor = "bg-red-600";
      hoverColor = "hover:text-red-600";
      ringColor = " hover:ring-red-600";
      break;
    default:
      buttonColor = "bg-primary";
      hoverColor = "hover:text-primary";
      ringColor = " hover:ring-primary";
  }

  // If the shelterVisitDate has not been reached, return null to prevent rendering the button.
  if (
    !isVisitDateReached &&
    (visitType === VisitType.Home
      ? status === Status.HomeVisitScheduled
      : status === Status.UserVisitScheduled)
  ) {
    return null;
  }
  console.log(status);
  console.log(getNextUserStatus(status, action));
  console.log(statusButtonText(getNextUserStatus(status, action)));

  return (
    <button
      className={`group relative w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white ${buttonColor} hover:bg-white hover:ring-2 ${ringColor} hover:ring-offset-2 ${hoverColor} ${
        isLoading ? `${buttonColor} text-white cursor-not-allowed` : ""
      }`}
      onClick={handleStatusUpdate}
    >
      {(action === "approve" && isApproving) ||
      (action === "reject" && isRejecting) ? (
        <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
      ) : null}
      {statusButtonText(
        visitType === VisitType.Home
          ? getNextShelterStatus(status, action)
          : getNextUserStatus(status, action)
      )}
    </button>
  );
};

export default StatusButton;
