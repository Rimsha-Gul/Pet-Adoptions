import { FieldsState } from "../types/common";

export const validateField = (
  id: string,
  value: string,
  fieldsState: FieldsState
): string => {
  const validationRules: Record<string, (value: string) => string> = {
    name: (value) => {
      if (!value) {
        return "Name is required";
      }
      if (value.length < 3) {
        return "Name should be at least 3 characters long";
      }
      return "";
    },
    password: (value) => {
      if (!value) {
        return "Password is required";
      }
      if (value.length < 6) {
        return "Password should be at least 6 characters long";
      }
      // if (value != fieldsState.confirmPassword) {
      //   return "Passwords do not match";
      // }
      return "";
    },
    confirmPassword: (value) => {
      if (!value) {
        return "Confirm password is required";
      }
      if (value != fieldsState.password) {
        return "Passwords do not match";
      }
      return "";
    },
    email: (value) => {
      if (!value) {
        return "Email is required";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email format";
      }
      return "";
    },
  };

  const validationRule = validationRules[id];

  if (validationRule) {
    return validationRule(value);
  }

  return "";
};
