import socket from "../../socket/socket";

const NotificationButton = () => {
  const createNotification = () => {
    console.log("create notification button clicked");
    const newNotification = {
      id: Date.now(),
      text: "This is a new notification!",
    };
    socket.emit("create_notification", newNotification);
  };

  return <button onClick={createNotification}>Create Notification</button>;
};

export default NotificationButton;
