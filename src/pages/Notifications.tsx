import { useContext, useEffect } from "react";
import NotificationList from "../components/NotificationsComponents/NotificationsList";
import api from "../api";
import { NotificationsContext } from "../context/NotificationsContext";

const Notifications = () => {
  const notificationsContext = useContext(NotificationsContext);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notification/");
        notificationsContext.setNotifications?.(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      <div>
        <NotificationList />
      </div>
    </div>
  );
};

export default Notifications;
