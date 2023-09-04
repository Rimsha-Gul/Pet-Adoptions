import { useEffect } from "react";
import NotificationList from "../components/NotificationsComponents/NotificationsList";
import socket from "../socket/socket";

const Notifications = () => {
  useEffect(() => {
    console.log("notifications useeffect called");

    // Fetch existing notifications from the server
    const userEmail = sessionStorage.getItem("userEmail");
    socket.emit("get_notifications", userEmail);
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
