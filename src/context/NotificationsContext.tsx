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
    console.log("notifications useeffect called");

    // Socket connection established
    socket.on("connect", () => {
      const userEmail = sessionStorage.getItem("userEmail");
      if (userEmail) {
        socket.emit("join_room", userEmail);
      }
    });

    // Fetch existing notifications from the server
    socket.emit("get_notifications", userEmail);

    // Listen for new notifications
    socket.on("new_notification", (data: any) => {
      const notification = data._doc; // assuming _doc contains the data structure you want
      setNotifications((prevState) => [{ ...notification }, ...prevState]);
    });

    // Populate notifications
    socket.on("notifications", (existingNotifications: Notification[]) => {
      console.log("populating notifications");
      setNotifications(existingNotifications);
    });

    // Cleanup
    return () => {
      socket.off("connect");
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
