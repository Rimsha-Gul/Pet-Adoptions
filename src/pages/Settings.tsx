import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Settings = () => {
  const appContext = useContext(AppContext);
  appContext.setVerificationOperation?.("changeEmail");
  const navigate = useNavigate();
  const handleEmailChange = () => {
    console.log(appContext.verificationOperation);
    navigate("/verifyEmail");
  };
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <div className="flex flex-col gap-4 mt-2 items-center justify-center">
          <button
            className="flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer "
            onClick={handleEmailChange}
          >
            Change Email
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
