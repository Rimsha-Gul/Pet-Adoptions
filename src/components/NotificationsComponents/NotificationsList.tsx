import { useContext } from "react";
import { NotificationsContext } from "../../context/NotificationsContext";
import NotificationCard from "./NotificationCard";

const NotificationList = () => {
  const { notifications } = useContext(NotificationsContext);
  console.log("notifications", notifications);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <ul>
        {notifications.map((notification) => (
          <NotificationCard
            key={`${notification.applicationID}-${notification.status}`}
            notification={notification}
          />
          // <li
          //   key={`${notification.applicationID}-${notification.message}`}
          //   className={`p-4  cursor-pointer text-gray-600 ${
          //     notification.isRead
          //       ? "bg-slate-50 hover:bg-gray-50"
          //       : "bg-secondary-10 hover:bg-secondary-50"
          //   }`}
          // >
          //   <div className="flex items-center">
          //     <div>
          //       <div className="text-lg font-semibold text-gray-600">
          //         {notification.message}
          //       </div>
          //       <div className="text-sm text-gray-600">
          //         {moment(notification.date).local().format("MMM D [at] h:mma")}
          //       </div>
          //     </div>
          //   </div>
          // </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
