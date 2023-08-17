import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import loadingIcon from "../assets/loading.gif";
import { AppContext } from "../context/AppContext";
import { showInfoAlert } from "../utils/alert";

const ShelterInvitation = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");

  // Extract the token from the location.pathname
  const invitationToken = useParams().invitationToken;
  console.log(invitationToken);

  useEffect(() => {
    console.log(appContext.loggedIn);
    if (appContext.loggedIn === true) {
      showInfoAlert(
        "You are currently logged in from another account. Please log out and click the invitation link again to proceed further"
      );
      setIsLoading(false);
      return;
    }
    const verifyInvitation = async () => {
      try {
        const response = await api.get(`/shelter/verifyInvitationToken`, {
          params: { invitationToken },
        });

        // On successful verification, navigate to the signup page with email and role
        console.log(response.data);
        navigate("/signup", {
          state: { email: response.data.email, role: "SHELTER" },
        });
      } catch (error: any) {
        setVerificationError(error.response.data);
        if (error.response.status === 409 && error.response.data.email) {
          appContext.setUserEmail?.(error.response.data.email);
          navigate("/verifyemail");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvitation();
  }, [invitationToken, navigate]);

  return (
    <>
      {isLoading && (
        <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-28 pb-8">
          <div className="flex items-center justify-center mb-8">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        </div>
      )}
      {verificationError && (
        <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
          <div className="flex items-center justify-center h-full">
            <p>{verificationError}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ShelterInvitation;
