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
      const userEmail = sessionStorage.getItem("userEmail");
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
  }, []); // Empty dependency array, this effect runs only once

  // Second useEffect for data-related tasks
  // useEffect(() => {
  //   console.log("notifications useeffect called");

  //   // Fetch existing notifications from the server
  //   if (notifications.length === 0) {
  //     const userEmail = sessionStorage.getItem("userEmail");
  //     socket.emit("get_notifications", userEmail);
  //   }
  // }, [notifications]); // Runs when notifications changes

  // Third useEffect for setting up socket listeners related to notifications
  useEffect(() => {
    // Listen for new notifications
    socket.on("new_notification", (data: any) => {
      const notification = data._doc;
      setNotifications((prevState) => [{ ...notification }, ...prevState]);

      if (!data.isSeen) {
        setUnseenCount((prevCount) => prevCount + 1);
      }
    });

    // Populate notifications
    socket.on("notifications", (existingNotifications: Notification[]) => {
      setNotifications(existingNotifications);
    });

    // Handle notification marked as read
    socket.on("notification_marked_as_read", (notificationID: string) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationID ? { ...notif, isRead: true } : notif
        )
      );
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
