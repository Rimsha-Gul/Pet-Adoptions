import { useNavigate } from "react-router-dom";
import { Notification } from "../../types/interfaces";
import { formatNotificationTime } from "../../utils/formatNotificationTime";
import api from "../../api";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const navigate = useNavigate();

  const handdleNotificationClick = async () => {
    try {
      await MarkAsRead();
      navigate(`${notification.actionUrl}`);
    } catch (error) {
      console.error("Failed in handleNotificationClick:", error);
    }
  };

  const MarkAsRead = async () => {
    try {
      await api.put(`/notifications/${notification.id}/read`);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div
      className={`p-4 cursor-pointer text-gray-600 ${
        notification.isRead
          ? "bg-whiteCustom-10 hover:bg-gray-100"
          : "bg-secondary-10 hover:bg-secondary-50"
      }`}
      onClick={handdleNotificationClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-none">
          <img
            src={notification.petImage}
            alt="Pet Thumbnail"
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        <div className="flex-auto">
          <p className="text-lg font-semibold text-gray-600">
            Status for Application ID:{" "}
            <span className="font-bold">{notification.applicationID}</span>{" "}
            updated to <span className="font-bold">{notification.status}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatNotificationTime(notification.date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
