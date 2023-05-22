import { FormEvent, useState } from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../types/common";
import FormAction from "./FormAction";
import api from "../api";
import { useNavigate } from "react-router-dom";

const fields = loginFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const LoginForm = () => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(fieldsState);
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
      const response = await api.post("/auth/login", loginData);
      console.log(response.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        if (error.response.data === "User not verified") {
          // Handle user not verified error
          navigate("/verifyemail");
        }
      }
    }
  };

  return (
    <form className="mx-auto md:w-2/3 space-y-8mt-8 space-y-6">
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
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
};

export default LoginForm;
