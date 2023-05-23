import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupFields } from "../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../types/common";
import FormAction from "./FormAction";
import api from "../api";
import { AppContext } from "../context/AppContext";

const fields = signupFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const SignupForm = () => {
  const appContext = useContext(AppContext);
  const [signupState, setSignupState] = useState(fieldsState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signupData = {
    name: signupState.name,
    email: signupState.email,
    address: signupState.address,
    password: signupState.password,
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    createAccount();
  };

  //Handle Signup API Integration
  const createAccount = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/signup", signupData);
      console.log(response.data);
      if (response.status === 200) {
        appContext.setUsermail?.(signupData.email);
        navigate("/verifyemail");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mx-auto md:w-1/4 mt-8 space-y-6">
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
          />
        ))}
      </div>
      <FormAction
        handleSubmit={handleSubmit}
        text="Signup"
        isLoading={isLoading}
      />
    </form>
  );
};

export default SignupForm;
