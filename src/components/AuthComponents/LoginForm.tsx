import { FormEvent, useContext, useEffect, useState } from "react";
import { loginFields } from "../../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../../types/common";
import FormAction from "./FormAction";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { validateField } from "../../utils/formValidation";

const fields = loginFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const LoginForm = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<FieldsState>(fieldsState);
  const [errors, setErrors] = useState<FieldsState>({
    email: "Email is required",
    password: "Password is required",
  });
  const loginData = {
    email: loginState.email,
    password: loginState.password,
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, loginState);

    setLoginState((prevLoginState) => ({
      ...prevLoginState,
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
    authenticateUser();
  };

  //Handle Login API Integration
  const authenticateUser = async () => {
    console.log(loginData);
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", loginData);
      if (response.status === 200) {
        appContext.setLoggedIn?.(true);
        appContext.setUserEmail?.(loginData.email);
        localStorage.setItem("userEmail", loginData.email);
        const { tokens } = response.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        navigate("/homepage");
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "User not found.",
        }));
      } else if (error.response.status === 401) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid credentials.",
          password: "Invalid credentials.",
        }));
      } else if (error.response.status === 403) {
        // Handle user not verified error
        console.log(appContext.userEmail);
        navigate("/verifyemail");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mx-auto md:w-1/2 space-y-8mt-8 space-y-6">
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
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
        text="Login"
        isLoading={isLoading}
        disabled={!isFormValid}
      />
    </form>
  );
};

export default LoginForm;
