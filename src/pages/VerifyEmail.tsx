import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { errorMessages } from "../constants/errorMessages";
import { showSuccessAlert } from "../utils/alert";
import Loading from "./Loading";
import LogoSection from "../components/AuthComponents/LogoSection";
import EmailVerificationForm from "../components/AuthComponents/VerifyEmail";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const appContext = useContext(AppContext);
  const [timer, setTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [verificationCodeError, setVerificationCodeError] =
    useState<string>("");
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const [emailForVerification] = useState<string>(appContext.userEmail);

  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  const sendCodeData = {
    email: emailForVerification,
  };

  useEffect(() => {
    const sendVerificationCode = async () => {
      if (emailForVerification) {
        // Check if usermail is not null
        try {
          if (appContext.verificationOperation === "changedEmail") {
            await api.post("/auth/sendVerificationCode", {
              email: appContext.newEmail,
              emailChangeRequest: true,
            });
          } else {
            await api.post("/auth/sendVerificationCode", sendCodeData);
          }
        } catch (error: any) {
          console.error(error);
          if (error.response.status === 404) {
            navigate("/pagenotfound", {
              state: errorMessages.pageNotFound,
            });
          } else if (error.response.status === 500) {
            navigate("/pagenotfound", {
              state: errorMessages.emailSendingError,
            });
          }
        }
      } else {
        navigate("/pagenotfound");
      }
    };

    sendVerificationCode();
  }, [emailForVerification]);

  const handleClick = async () => {
    // VerifyEmail API integration
    const verificationData = {
      email: emailForVerification,
      verificationCode: verificationCode,
    };
    try {
      setIsLoading(true);
      const response = await api.post("/auth/verifyEmail", verificationData);
      console.log(appContext.verificationOperation);

      console.log(response);
      if (response.status === 200) {
        appContext.setLoggedIn?.(true);
        const { isVerified, tokens } = response.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        console.log(tokens.accessToken);
        console.log("Isverified: ", isVerified);

        if (appContext.verificationOperation === "changeEmail") {
          appContext.setIsEmailVerified?.(true);
          console.log("isnt it true");
          navigate("/changeEmail");
        } else if (appContext.verificationOperation === "changedEmail") {
          const accessToken = localStorage.getItem("accessToken");
          console.log(accessToken);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          const response = await api.put("/auth/changeEmail", {
            email: appContext.newEmail,
          });
          const { tokens } = response.data;
          appContext.setUserEmail?.(appContext.newEmail);
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          setShowBlankScreen(true);
          // show success alert
          showSuccessAlert(response.data.message, undefined, () =>
            navigate("/userProfile")
          );
        } else {
          navigate("/homepage");
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 404) {
        navigate("/pagenotfound", {
          state: errorMessages.pageNotFound,
        });
      } else if (error.response.status === 401) {
        setVerificationCodeError(
          "Verification code expired. Please request a new code."
        );
      } else if (error.response.status === 400) {
        setVerificationCodeError("Incorrect verification code");
      } else if (error.response.status === 409) {
        setVerificationCodeError(error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendClick = async () => {
    // Resend code api integration
    const resendCodeData = {
      email: appContext.userEmail,
    };
    setVerificationCodeError("");
    try {
      setIsResending(true);
      let response;
      if (appContext.verificationOperation === "changedEmail") {
        response = await api.post("/auth/sendVerificationCode", {
          email: appContext.newEmail,
          emailChangeRequest: true,
        });
      } else {
        response = await api.post("/auth/sendVerificationCode", resendCodeData);
      }

      if (response.status === 200) {
        setTimer(60); // After a successful response, start the timer for 60 seconds
        setResendDisabled(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  // Implement the countdown timer logic using useEffect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      setResendDisabled(false); // Enable the resend button when timer reaches zero
    }
  }, [timer]);

  const isCodeValid = verificationCode.length === 6;

  return showBlankScreen ? (
    <Loading />
  ) : appContext.verificationOperation !== "changeEmail" &&
    appContext.verificationOperation !== "changedEmail" ? (
    <div className="bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection />
        <EmailVerificationForm
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isLoading={isLoading}
          handleClick={handleClick}
          timer={timer}
          isResending={isResending}
          handleResendClick={handleResendClick}
          resendDisabled={resendDisabled}
          verificationCodeError={verificationCodeError}
          isCodeValid={isCodeValid}
          customClassName="bg-white px-12 pb-12 md:py-12 md:px-4 "
        />
        {/* <div className="bg-white rounded-lg shadow-md px-12 pb-12 md:py-12 md:px-4 md:rounded-l-none">
          <h1 className="text-3xl text-primary font-bold mb-4">
            Verify Your Email Account
          </h1>
          <p className="text-lg mb-8">
            Please enter the 6-digit code sent to your email.
          </p>
          <div className="flex flex-row mt-2 items-center justify-center">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              pattern="\d{6}"
              maxLength={6}
              required
              className="w-1/2 px-4 py-2 border border-primary focus:border-primary rounded mb-4"
            />
          </div>
          <div className="flex flex-row gap-4 mt-2 items-center justify-center">
            <button
              className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ${
                !isCodeValid ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isLoading
                  ? "bg-primary text-white opacity-50 cursor-not-allowed"
                  : ""
              } `}
              onClick={handleClick}
              disabled={!isCodeValid}
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Verify
            </button>
            <div>
              {timer === 0 ? (
                <button
                  className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer 
              ${
                isResending
                  ? "bg-primary text-white opacity-50 cursor-not-allowed"
                  : ""
              } `}
                  onClick={handleResendClick}
                  disabled={resendDisabled}
                >
                  {isResending && (
                    <img
                      src={loadingIcon}
                      alt="Loading"
                      className="mr-2 h-4 w-4"
                    />
                  )}
                  Resend Code
                </button>
              ) : (
                <div>Code will expire in {timer} seconds</div>
              )}
            </div>
          </div>
          {verificationCodeError && (
            <p className="flex items-center justify-center mt-4 text-sm text-red-500">
              {verificationCodeError}
            </p>
          )}
        </div> */}
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center">
      <EmailVerificationForm
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        handleClick={handleClick}
        timer={timer}
        isResending={isResending}
        handleResendClick={handleResendClick}
        resendDisabled={resendDisabled}
        verificationCodeError={verificationCodeError}
        isCodeValid={isCodeValid}
        customClassName="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 p-12"
      />
    </div>
  );
};

export default VerifyEmail;
