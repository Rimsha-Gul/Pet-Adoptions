import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import socket from "../socket/socket";
import { Notification } from "../types/interfaces";

interface NotificationsContextProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>> | null;
  unseenCount: number;
  setUnseenCount: Dispatch<SetStateAction<number>> | null;
}

export const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  setNotifications: null,
  unseenCount: 0,
  setUnseenCount: null,
});

const NotificationsProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState<number>(0);

  // First useEffect for socket initialization and cleanup
  useEffect(() => {
    console.log("Socket initialization");

    // Socket connection established
    socket.on("connect", () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        socket.emit("join_room", userEmail);
      }
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("get_notifications");
      socket.off("new_notification");
      socket.off("notifications");
      socket.off("notification_marked_as_read");
      socket.off("notifications_marked_as_seen");
    };
  }, []);

  // Second useEffect for setting up socket listeners related to notifications
  useEffect(() => {
    // Listen for new notifications
    socket.on("new_notification", (data: any) => {
      console.log("new notification: ", data);
      const notification = data;
      setNotifications((prevState) => [{ ...notification }, ...prevState]);

      if (!data.isSeen) {
        setUnseenCount((prevCount) => prevCount + 1);
      }
    });

    // Handle notification marked as read
    socket.on("notification_marked_as_read", (notificationID: string) => {
      console.log("notification is read");
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationID
            ? { ...notif, isRead: true, isSeen: true }
            : notif
        )
      );
      setUnseenCount((prevCount) => prevCount - 1);
    });

    socket.on("notifications_marked_as_seen", () => {
      setUnseenCount(0);
    });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        unseenCount,
        setUnseenCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
