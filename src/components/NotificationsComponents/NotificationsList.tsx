import { useContext } from "react";
import { NotificationsContext } from "../../context/NotificationsContext";
import NotificationCard from "./NotificationCard";

const NotificationList = () => {
  const { notifications } = useContext(NotificationsContext);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <ul>
        {notifications.map((notification) => (
          <NotificationCard
            key={`${notification.applicationID}-${notification.status}`}
            notification={notification}
          />
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
