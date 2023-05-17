import { FormEvent, useState } from "react";
import { signupFields } from "../constants/formFields";
import Input from "./Input";
import { FieldsState } from "../types/common";
import FormAction from "./FormAction";
import api from "../api";

const fields = signupFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function SignupForm() {
  const [signupState, setSignupState] = useState(fieldsState);
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
    console.log("here");
    console.log(signupData);
    try {
      const response = await api.post("/auth/signup", signupData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="mx-auto md:w-2/3 mt-8 space-y-6">
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
      <FormAction handleSubmit={handleSubmit} text="Signup" />
    </form>
  );
}
