import { useState } from "react";
import api from "../api";
import NewPassword from "../components/SettingsComponents/NewPassword";
import VerifyCurrentPassword from "../components/SettingsComponents/VerifyCurrentPassword";

const ChangePassword = () => {
  const [userCurrentPassword, setUserCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const [verificationCodeError, setVerificationCodeError] =
    useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordVerification = async (e: any) => {
    setVerificationCodeError("");
    e.preventDefault();
    checkPassword();
  };

  const checkPassword = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await api.post("/auth/checkPassword", {
        password: userCurrentPassword,
      });
      console.log(response.data);
      if (response.status === 200) {
        setIsPasswordVerified(true);
      }
    } catch (error: any) {
      setVerificationCodeError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return isPasswordVerified ? (
    <NewPassword verificationCodeError={verificationCodeError} />
  ) : (
    <VerifyCurrentPassword
      onSubmit={handlePasswordVerification}
      isLoading={isLoading}
      showPassword={showPassword}
      togglePasswordVisibility={togglePasswordVisibility}
      userCurrentPassword={userCurrentPassword}
      setUserCurrentPassword={setUserCurrentPassword}
      verificationCodeError={verificationCodeError}
    />
  );
};

export default ChangePassword;
