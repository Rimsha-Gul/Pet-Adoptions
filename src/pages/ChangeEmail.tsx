import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NewEmailForm from "../components/SettingsComponents/NewEmail";
import VerifyCurrentEmail from "../components/SettingsComponents/VerifyCurrentEmail";

const ChangeEmail = () => {
  const appContext = useContext(AppContext);
  const emailVerified = appContext.isEmailVerified;

  return emailVerified ? <NewEmailForm /> : <VerifyCurrentEmail />;
};

export default ChangeEmail;
