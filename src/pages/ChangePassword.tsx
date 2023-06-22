import { FormEvent, useEffect, useState } from "react";
import loadingIcon from "../assets/loading.gif";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { changePasswordFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import Input from "../components/AuthComponents/Input";
import { validateField } from "../utils/formValidation";
import FormAction from "../components/AuthComponents/FormAction";
import { showSuccessAlert } from "../utils/alert";
import Loading from "./Loading";

const fields = changePasswordFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

interface PasswordComponentProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  userCurrentPassword: string;
  setUserCurrentPassword: (value: string) => void;
  verificationCodeError: string;
}

// compoennt to validate user's identity by requiring him to enter his current password
const CurrentPasswordComponent = ({
  onSubmit,
  isLoading,
  showPassword,
  togglePasswordVisibility,
  userCurrentPassword,
  setUserCurrentPassword,
  verificationCodeError,
}: PasswordComponentProps) => {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <div className="w-full mb-2">
              <p className="flex items-center justify-center mb-8 text-center text-lg font-bold text-gray-700">
                To continue, first verify it's you
              </p>
              <label>
                Current Password:
                <input
                  type={showPassword ? "text" : "password"}
                  value={userCurrentPassword}
                  onChange={(e) => setUserCurrentPassword(e.target.value)}
                  required
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              </label>
              <label className="flex items-center mt-2 ml-2">
                <input
                  type="checkbox"
                  className="mr-2 w-3 h-3"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <span className="text-xs text-gray-600">Show password</span>
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
              Verify Current Password
            </button>
          </div>
          {verificationCodeError && (
            <p className="flex items-center justify-center mt-4 text-sm text-red-500">
              {verificationCodeError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// component for entering a new password and confirm new password
const NewPasswordComponent = ({
  onSubmit,
  verificationCodeError,
}: PasswordComponentProps) => {
  const navigate = useNavigate();
  const [changePasswordState, setChangePasswordState] =
    useState<FieldsState>(fieldsState);
  const [errors, setErrors] = useState<FieldsState>({
    password: "Password is required",
    confirmPassword: "Confirm password is required",
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, changePasswordState);

    // Update the confirm password field if the password field changes
    if (id === "password") {
      const confirmPasswordError = validateField(
        "confirmPassword",
        changePasswordState.confirmPassword,
        { ...changePasswordState, password: value } // Pass the updated password value
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmPasswordError,
      }));
    }

    setChangePasswordState((prevSignupState) => ({
      ...prevSignupState,
      [id]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: fieldError,
    }));
  };

  useEffect(() => {
    // Check if all fields are valid
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );

    // Update the form validity state
    setIsFormValid(isAllFieldsValid);
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(changePasswordState);
    changePassword();
  };

  const changePassword = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await api.put("/auth/changePassword", {
        password: changePasswordState.password,
      });

      setShowBlankScreen(true);
      // show success alert
      showSuccessAlert(response.data.message, undefined, () =>
        navigate("/settings")
      );
    } catch (error: any) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: error.response.data,
      }));
    } finally {
      setIsLoading(false);
    }
  };
  return showBlankScreen ? (
    <Loading />
  ) : (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <div className="w-full mb-2">
              <p className="flex items-center justify-center mb-8 text-center text-lg font-bold text-gray-700">
                Choose a strong password and don't reuse it for other accounts.
              </p>
              {fields.map((field) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={changePasswordState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                  customClass=""
                  validationError={errors[field.id]}
                />
              ))}
            </div>
            <FormAction
              handleSubmit={handleSubmit}
              text="Verify New Password"
              isLoading={isLoading}
              disabled={!isFormValid}
              customClass="w-full mt-0"
            />
          </div>
          {verificationCodeError && (
            <p className="flex items-center justify-center mt-4 text-sm text-red-500">
              {verificationCodeError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

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
    <NewPasswordComponent
      onSubmit={handlePasswordVerification}
      showPassword={showPassword}
      togglePasswordVisibility={togglePasswordVisibility}
      userCurrentPassword={userCurrentPassword}
      setUserCurrentPassword={setUserCurrentPassword}
      verificationCodeError={verificationCodeError}
    />
  ) : (
    <CurrentPasswordComponent
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
