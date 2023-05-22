import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";

const ResendCode = () => {
  const appContext = useContext(AppContext);
  const [timer, setTimer] = useState(0);
  const userEmail = appContext.usermail;

  const handleResendClick = async () => {
    // Resend code api integration
    const resendCodeData = {
      email: appContext.usermail,
    };
    try {
      console.log(userEmail);
      const response = await api.post("/auth/resendCode", resendCodeData);
      if (response.status === 200) {
        setTimer(60); // After a successful response, you can start the timer for 60 seconds
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Implement the countdown timer logic using useEffect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [timer]);

  return (
    <div className="mt-4">
      {timer === 0 ? (
        <button className="text-primary" onClick={handleResendClick}>
          Resend Code
        </button>
      ) : (
        <div>Resend Code in {timer} seconds</div>
      )}
    </div>
  );
};

export default ResendCode;
