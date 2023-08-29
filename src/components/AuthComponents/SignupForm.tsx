import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupFields } from "../../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../../types/common";
import FormAction from "./FormAction";
import api from "../../api";
import { AppContext } from "../../context/AppContext";
import { validateField } from "../../utils/formValidation";
import { SignupFormProps } from "../../types/interfaces";

const fields = signupFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const SignupForm = ({
  initialEmail = "",
  initialRole = "",
}: SignupFormProps) => {
  const appContext = useContext(AppContext);
  const [signupState, setSignupState] = useState<FieldsState>({
    ...fieldsState,
    email: initialEmail,
    role: initialRole,
  });
  const [errors, setErrors] = useState<FieldsState>({
    name: "Name is required",
    email: initialEmail !== "" ? "" : "Email is required",
    password: "Password is required",
    confirmPassword: "Confirm password is required",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const signupData = {
    name: signupState.name,
    email: signupState.email,
    password: signupState.password,
    role: initialRole !== "" ? "SHELTER" : "USER",
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, signupState);

    // Update the confirm password field if the password field changes
    if (id === "password") {
      const confirmPasswordError = validateField(
        "confirmPassword",
        signupState.confirmPassword,
        { ...signupState, password: value } // Pass the updated password value
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmPasswordError,
      }));
    }

    setSignupState((prevSignupState) => ({
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
    createAccount();
  };

  //Handle Signup API Integration
  const createAccount = async () => {
    try {
      sessionStorage.setItem("userEmail", signupData.email);
      appContext.setUserEmail?.(signupData.email);
      setIsLoading(true);
      const response = await api.post("/auth/signup", signupData);
      console.log(response.data);
      if (response.status === 200) {
        navigate("/verifyemail");
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "User already exists.",
        }));
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mx-auto md:w-full px-4 sm:px-8 lg:px-16 xl:px-4 xl:w-2/3 space-y-8 mt-8">
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
            customClass=""
            validationError={errors[field.id]}
            readOnly={initialEmail !== ""}
          />
        ))}
      </div>
      <FormAction
        handleSubmit={handleSubmit}
        text="Signup"
        isLoading={isLoading}
        disabled={!isFormValid}
        customClass="w-full"
      />
    </form>
  );
};

export default SignupForm;
