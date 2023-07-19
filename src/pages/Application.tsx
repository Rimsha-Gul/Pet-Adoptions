import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ApplicationDetailsUser from "../components/ApplicationComponents/ApplicationDetailsUser";
import ApplicationDetailsShelter from "../components/ApplicationComponents/ApplicationDetailsShelter";

const Application = () => {
  const appContext = useContext(AppContext);
  const userRole = appContext.userRole;
  console.log(userRole);

  return userRole === "USER" ? (
    <ApplicationDetailsUser />
  ) : (
    <ApplicationDetailsShelter />
  );
};

export default Application;
