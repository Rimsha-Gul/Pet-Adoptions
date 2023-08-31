import { FormEvent, useEffect, useState } from "react";
import LogoSection from "../components/AuthComponents/LogoSection";
import Input from "../components/AuthComponents/Input";
import { FieldsState } from "../types/common";
import FormAction from "../components/AuthComponents/FormAction";
import { validateField } from "../utils/formValidation";
import api from "../api";
import { showSuccessAlert } from "../utils/alert";
import { formatTime } from "../utils/formatTime";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(300);
  const [errors, setErrors] = useState<FieldsState>({
    email: "Email is required",
  });

  useEffect(() => {
    // Check if all fields are valid
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );

    // Update the form validity state
    setIsFormValid(isAllFieldsValid);
  }, [errors]);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: fieldError,
    }));
    setEmail(e.target.value);
  };

  // Implement the countdown timer logic using useEffect
  useEffect(() => {
    if (isRequestSent && timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      setIsRequestSent(false); // Enable the request button when timer reaches zero
    }
  }, [timer, isRequestSent]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    requestForPasswordReset();
  };

  //Handle Login API Integration
  const requestForPasswordReset = async () => {
    console.log(email);
    try {
      setIsLoading(true);
      const response = await api.post(
        "/auth/requestPasswordReset",
        {
          email: email,
        },
        { headers: { Authorization: "" } }
      );
      setTimer(300);
      console.log(response.data);
      showSuccessAlert(
        "Please check your email inbox for a link to complete the reset.",
        undefined,
        () => {
          setIsRequestSent(true);
        }
      );
    } catch (error: any) {
      if (error.response.status === 404) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "User not found.",
        }));
      } else if (error.response.status === 400) {
        setMessage(
          "Your password reset token is invalid or has expired. Please request a new one."
        );
      } else console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection />
        <div className="bg-white rounded-lg shadow-md px-12 pb-12 md:py-12 md:px-4 md:rounded-l-none">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
            Reset Password
          </h2>
          <p className="text-gray-600 pt-8 px-6">
            Enter your email associated with your Purrfect Adoptions account.
            After verification, a password reset link will be sent to the
            provided email.
          </p>
          <form className="mx-auto md:w-full px-8 lg:px-16 xl:px-4 xl:w-2/3 mt-8">
            <div className="space-y-6">
              <Input
                key={"email"}
                handleChange={handleChange}
                value={email}
                labelText={"Email"}
                labelFor={"email"}
                id={"email"}
                name={"email"}
                type={"email"}
                isRequired={true}
                placeholder={"Email"}
                customClass=""
                validationError={errors["email"]}
                readOnly={isLoading || isRequestSent}
              />
            </div>
            <FormAction
              handleSubmit={handleSubmit}
              text="Request"
              isLoading={isLoading}
              disabled={!isFormValid || isRequestSent}
              customClass="w-full"
            />
          </form>
          {message && <p>{message}</p>}
          {isRequestSent && (
            <div className="flex mt-8 items-center justify-center">
              A password reset request has been sent. You can resend the request
              in {formatTime(timer)}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
