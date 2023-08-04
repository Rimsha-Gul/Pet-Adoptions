import { FormEvent, useEffect, useState } from "react";
import LogoSection from "../components/AuthComponents/LogoSection";
import Input from "../components/AuthComponents/Input";
import { FieldsState } from "../types/common";
import FormAction from "../components/AuthComponents/FormAction";
import { validateField } from "../utils/formValidation";
import api from "../api";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Here you'd make an API request to your backend with the email
    // After receiving a successful response from your backend, you can display a message to the user
    // setMessage(
    //   `A password reset link has been sent to ${email}. Please check your email.`
    // );
    // setEmail("");
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

      console.log(response.data);
    } catch (error: any) {
      if (error.response.status === 404) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "User not found.",
        }));
      } else console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection
          paragraph="Don't have an account yet?"
          linkName="Signup"
          linkUrl="/signup"
        />
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
              />
            </div>
            <FormAction
              handleSubmit={handleSubmit}
              text="Request"
              isLoading={isLoading}
              disabled={!isFormValid}
              customClass="w-full"
            />
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
