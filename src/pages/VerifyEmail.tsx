import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import loadingIcon from "../assets/loading.gif";
import { errorMessages } from "../constants/errorMessages";

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
  const sendCodeData = {
    email: appContext.userEmail,
  };
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  useEffect(() => {
    const sendVerificationCode = async () => {
      if (appContext.userEmail) {
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
  }, [appContext.userEmail]);

  const handleClick = async (e: any) => {
    e.preventDefault();
    // VerifyEmail API integration
    const verificationData = {
      email: appContext.userEmail,
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
        appContext.setLoggedIn?.(true);
        console.log(tokens.accessToken);
        console.log("Isverified: ", isVerified);
        if (appContext.verificationOperation === "changeEmail") {
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
          // to do: show alert
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
      const response = await api.post(
        "/auth/sendVerificationCode",
        resendCodeData
      );
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

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
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
      </div>
    </div>
  );
};

export default VerifyEmail;
