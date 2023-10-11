import { useContext, useEffect, useState } from "react";
import api from "../api";
import { NotificationsContext } from "../context/NotificationsContext";
import loadingIcon from "../assets/loading.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import NotificationCard from "../components/NotificationsComponents/NotificationCard";

const Notifications = () => {
  const [areFetched, setAreFetched] = useState<boolean>(false);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setAreFetched(true);
        const response = await api.get("/notifications/", {
          params: {
            page: 1,
            limit: 8,
          },
        });
        const { notifications, totalPages } = response.data;
        notificationsContext.setNotifications?.(notifications);
        setCurrentPage(1);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setAreFetched(false);
      }
    };

    fetchNotifications();
  }, []);

  const loadMoreData = async () => {
    if (currentPage < totalPages) {
      try {
        setIsMoreLoading(true);
        const nextPage = currentPage + 1;

        // Fetch the next page of data
        const response = await api.get("/notifications/", {
          params: {
            page: nextPage,
            limit: 8,
          },
        });
        const { notifications: newApplicatiions, totalPages } = response.data;

        // Append the new notifications to the existing notifications
        notificationsContext.setNotifications?.((prevApps) => [
          ...prevApps,
          ...newApplicatiions,
        ]);
        setCurrentPage(nextPage);
        setTotalPages(totalPages);
      } catch (error: any) {
        console.error(error.response.status);
      } finally {
        setIsMoreLoading(false);
      }
    }
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      {areFetched && (
        <div className="flex items-center justify-center mt-8 mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {notifications && !areFetched && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <InfiniteScroll
            dataLength={notifications.length}
            next={loadMoreData}
            hasMore={currentPage < totalPages}
            loader={
              isMoreLoading && (
                <div className="flex items-center justify-center" key={0}>
                  <img
                    src={loadingIcon}
                    alt="Loading"
                    className="mt-2 h-10 w-10"
                  />
                </div>
              )
            }
            className="overflow-hidden p-2"
          >
            {notifications.map((notification) => (
              <>
                <NotificationCard
                  key={`${notification.applicationID}-${notification.status}`}
                  notification={notification}
                />
                <div className="border-b-2 border-gray-200"></div>
              </>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Notifications;
