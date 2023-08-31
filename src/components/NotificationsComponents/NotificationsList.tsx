import { useContext } from "react";
import { NotificationsContext } from "../../context/NotificationsContext";

const NotificationList = () => {
  const { notifications } = useContext(NotificationsContext);
  console.log("notifications", notifications);
  return (
    <ul>
      {notifications.map((notification) => (
        <li key={`${notification.applicationID}-${notification.message}`}>
          {notification.message}
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
