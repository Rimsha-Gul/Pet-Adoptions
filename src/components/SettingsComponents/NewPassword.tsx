import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/AuthComponents/Input";
import { validateField } from "../../utils/formValidation";
import FormAction from "../../components/AuthComponents/FormAction";
import { showSuccessAlert } from "../../utils/alert";
import Loading from "../../pages/Loading";
import { changePasswordFields } from "../../constants/formFields";
import { FieldsState } from "../../types/common";
import api from "../../api";

const fields = changePasswordFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

interface PasswordComponentProps {
  verificationCodeError: string;
}

// component for entering a new password and confirm new password
const NewPassword = ({ verificationCodeError }: PasswordComponentProps) => {
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
        navigate("/userProfile")
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
        <form>
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
              text="Change Password"
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

export default NewPassword;
