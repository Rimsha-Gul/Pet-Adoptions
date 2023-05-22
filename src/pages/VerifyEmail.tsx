import { useContext, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import ResendCode from "../components/ResendCode";

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const appContext = useContext(AppContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // VerifyEmail API integration
    const verificationData = {
      email: appContext.usermail,
      verificationCode: verificationCode,
    };
    try {
      const response = await api.post("/auth/verifyEmail", verificationData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl text-primary font-bold mb-4">
        Verify Your Email Account
      </h1>
      <p className="text-lg mb-8">
        Please enter the 6-digit code sent to your email.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          pattern="\d{6}"
          maxLength={6}
          required
          className="px-4 py-2 border border-primary focus:border-primary rounded mb-4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
        >
          Verify
        </button>
      </form>
      <ResendCode />
    </div>
  );
}

export default VerifyEmail;
