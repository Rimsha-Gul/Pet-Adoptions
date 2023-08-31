import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import socket from "../socket/socket";

interface Notification {
  applicationID: string;
  message: string;
  read: boolean;
  actionUrl: string;
  date: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>> | null;
}

export const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  setNotifications: null,
});

const NotificationsProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userEmail = sessionStorage.getItem("userEmail");

  useEffect(() => {
    // Fetch existing notifications from the server
    socket.emit("get_notifications", userEmail);

    // Listen for new notifications
    socket.on("new_notification", (notification: Notification) => {
      setNotifications((prevState) => [...prevState, notification]);
    });

    // Populate notifications
    socket.on("notifications", (existingNotifications: Notification[]) => {
      setNotifications(existingNotifications);
    });

    // Cleanup
    return () => {
      socket.off("get_notifications");
      socket.off("new_notification");
      socket.off("notifications");
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
