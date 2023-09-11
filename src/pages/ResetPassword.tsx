import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import loadingIcon from "../assets/loading.gif";
import NewPassword from "../components/SettingsComponents/NewPassword";
import { RequestType } from "../types/enums";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");
  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  // Extract the token from the location.pathname
  const resetToken = useParams().resetToken;
  console.log(resetToken);

  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const response = await api.get(`/auth/verifyResetToken`, {
          params: { resetToken },
        });

        const { email } = response.data;
        setEmail(email);
        setIsTokenVerified(true);
      } catch (error: any) {
        if (error.response.status === 404)
          setVerificationError(error.response.data.message);
        else if (error.response.status === 400)
          setVerificationError(
            "Your password reset token is invalid or has expired. Please request a new one."
          );
        else if (error.response.status === 500)
          setVerificationError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvitation();
  }, [resetToken]);

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
            <p data-cy="error-message">{verificationError}</p>
          </div>
        </div>
      )}
      {isTokenVerified && (
        <NewPassword
          requestType={RequestType.resetPassword}
          buttonText={RequestType.resetPassword}
          email={email}
        />
      )}
    </>
  );
};

export default ResetPassword;
