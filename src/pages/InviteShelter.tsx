import { useContext, useState } from "react";
import loadingIcon from "../assets/loading.gif";
import api from "../api";
import {
  showErrorAlert,
  showInfoAlert,
  showSuccessAlert,
} from "../utils/alert";
import { AppContext } from "../context/AppContext";

const InviteShelter = () => {
  const [shelterEmail, setShelterEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const appContext = useContext(AppContext);

  const handleShelterInvite = async (e: any) => {
    e.preventDefault();
    inviteShelter();
  };

  const inviteShelter = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/shelter/invite", {
        email: shelterEmail,
      });
      if (response.status === 200) {
        setShelterEmail("");
        showSuccessAlert(response.data.message, undefined);
      }
    } catch (error: any) {
      if (
        error.response.status === 409 &&
        error.response.data === "User already  exists, which is not a shelter"
      ) {
        showInfoAlert(
          `The email you entered is already associated with a 'User' account. To proceed with the 'Shelter' invitation, kindly notify the owner of this email to provide a different email address for their 'Shelter' registration. Would you like to notify them now?
`,
          "Yes",
          "No",
          () => changeUserRole()
        );
      } else {
        showErrorAlert(error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async () => {
    try {
      setIsLoading(true);

      console.log(appContext.userRole);
      const response = await api.post("/auth/getAlternateEmail", {
        email: shelterEmail,
      });
      if (response.status === 200) {
        setShelterEmail("");
        showSuccessAlert(response.data.message, undefined);
      }
    } catch (error: any) {
      showErrorAlert(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={handleShelterInvite}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <div className="w-full">
              <label>
                Shelter Email:
                <input
                  type="email"
                  value={shelterEmail}
                  onChange={(e) => setShelterEmail(e.target.value)}
                  required
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              </label>
            </div>
            <button
              className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ${
                isLoading ? "bg-primary text-white cursor-not-allowed" : ""
              } `}
              type="submit"
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Invite shelter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteShelter;
