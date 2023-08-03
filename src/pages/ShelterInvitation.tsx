import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import loadingIcon from "../assets/loading.gif";

const ShelterInvitation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");

  // Extract the token from the location.pathname
  const invitationToken = useParams().invitationToken;
  console.log(invitationToken);

  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const response = await api.get(`/shelter/verifyInvitationToken`, {
          params: { invitationToken },
        });

        if (response.status === 200) {
          // On successful verification, navigate to the signup page with email and role
          console.log(response.data);
          navigate("/signup", {
            state: { email: response.data.email, role: "SHELTER" },
          });
        } else {
          // Handle failure (e.g., show an error message)
        }
      } catch (error: any) {
        setVerificationError(error.response.data);
        // Handle error (e.g., show an error message)
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
