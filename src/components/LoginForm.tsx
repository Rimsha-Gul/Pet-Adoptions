import { FormEvent, useContext, useState } from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../types/common";
import FormAction from "./FormAction";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const fields = loginFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const LoginForm = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [loginState, setLoginState] = useState(fieldsState);
  const [isLoading, setIsLoading] = useState(false);
  const loginData = {
    email: loginState.email,
    password: loginState.password,
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

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
        const { isVerified, tokens } = response.data;
        console.log(tokens.accessToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        console.log("Isverified: ", isVerified);
        navigate("/homepage");
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        // Handle user not verified error
        appContext.setUsermail?.(loginData.email);
        console.log(appContext.usermail);
        navigate("/verifyemail");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mx-auto md:w-1/4 space-y-8mt-8 space-y-6">
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
          />
        ))}
      </div>
      <FormAction
        handleSubmit={handleSubmit}
        text="Login"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
