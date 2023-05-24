import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import loadingIcon from "../assets/loading.gif";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const appContext = useContext(AppContext);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const sendCodeData = {
    email: appContext.usermail,
  };

  useEffect(() => {
    const sendVerificationCode = async () => {
      try {
        const response = await api.post(
          "/auth/sendVerificationCode",
          sendCodeData
        );
        if (response.status === 200) {
          console.log("Email sent");
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendVerificationCode();
  }, []);

  const handleClick = async (e: any) => {
    e.preventDefault();
    // VerifyEmail API integration
    const verificationData = {
      email: appContext.usermail,
      verificationCode: verificationCode,
    };
    try {
      setIsLoading(true);
      const response = await api.post("/auth/verifyEmail", verificationData);
      if (response.status === 200) {
        const { isVerified, tokens } = response.data;
        console.log(tokens.accessToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        console.log("Isverified: ", isVerified);
        appContext.setLoggedIn?.(true);
        navigate("/homepage");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendClick = async () => {
    // Resend code api integration
    const resendCodeData = {
      email: appContext.usermail,
    };
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
    <div className="flex flex-col items-center justify-center min-h-screen">
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
      <div className="flex flex-row gap-4 mt-2 items-center">
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
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Resend Code
            </button>
          ) : (
            <div>Code will expire in {timer} seconds</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
