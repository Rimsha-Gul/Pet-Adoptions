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
    shelterID: (value) => {
      if (!value) {
        return "Shelter ID is required";
      }
      const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegExp.test(value)) {
        return "Shelter ID should be a valid MongoDB ObjectID";
      }
      return "";
    },
    category: (value) => {
      if (!value) {
        return "Category is required";
      }
      return "";
    },
    microchipID: (value) => {
      if (!value) {
        return "Microchip ID is required";
      }
      if (value.length !== 10) {
        return "Microchip ID should be 10 characters long";
      }
      return "";
    },
    petName: (value) => {
      if (!value) {
        return "Name is required";
      }
      if (value.length < 3) {
        return "Name should be at least 3 characters long";
      }
      return "";
    },
    gender: (value) => {
      if (!value) {
        return "Gender is required";
      }
      return "";
    },
    age: (value) => {
      if (!value) {
        return "Age is required";
      }

      // Check if the age format is valid (expecting "Xyr Xmo", "Xyr", or "Xmo")
      const ageRegex = /^((?<years>\d+)yr\s*)?((?<months>\d+)m)?$/;
      const matchResult = ageRegex.exec(value.trim());
      if (!matchResult) {
        return "Invalid age format. Please use 'Xyr Xm', 'Xyr', or 'Xm'. For example, '2yr 2m', '2yr', or '2m'.";
      }

      // Extract years and months from the match result
      const years =
        matchResult.groups && matchResult.groups.years
          ? parseInt(matchResult.groups.years)
          : 0;
      const months =
        matchResult.groups && matchResult.groups.months
          ? parseInt(matchResult.groups.months)
          : 0;

      // Check if years and months are within valid range
      if (years < 0 || years > 100) {
        return "Years should be between 0 and 100";
      }
      if (months < 0 || months > 12) {
        return "Months should be between 0 and 12";
      }

      // If both years and months are defined, make sure they are not both 0
      if (years === 0 && months === 0) {
        return "Age should be more than 0";
      }

      return "";
    },
    breed: (value) => {
      if (!value) {
        return "Breed is required";
      }
      return "";
    },
    color: (value) => {
      if (!value) {
        return "Color is required";
      }
      return "";
    },
    activityNeeds: (value) => {
      if (!value) {
        return "Activity needs is required";
      }
      return "";
    },
    levelOfGrooming: (value) => {
      if (!value) {
        return "Level of grooming is required";
      }
      return "";
    },
    isHouseTrained: (value) => {
      if (value === undefined || value === null) {
        return "House trained status is required";
      }
      return "";
    },
    healthCheck: (value) => {
      if (value === undefined || value === null) {
        return "Health check status is required";
      }
      return "";
    },
    allergiesTreated: (value) => {
      if (value === undefined || value === null) {
        return "Allergies treated status is required";
      }
      return "";
    },
    wormed: (value) => {
      if (value === undefined || value === null) {
        return "Wormed status is required";
      }
      return "";
    },
    heartwormTreated: (value) => {
      if (value === undefined || value === null) {
        return "Heartworm treated status is required";
      }
      return "";
    },
    vaccinated: (value) => {
      if (value === undefined || value === null) {
        return "Vaccination status is required";
      }
      return "";
    },
    deSexed: (value) => {
      if (value === undefined || value === null) {
        return "Desexed status is required";
      }
      return "";
    },
    bio: (value) => {
      if (!value) {
        return "Bio is required";
      }
      return "";
    },
    adoptionFee: (value) => {
      if (!value) {
        return "Adoption fee is required";
      }
      if (isNaN(Number(value))) {
        return "Adoption fee should be a valid number";
      }
      return "";
    },
    currency: (value) => {
      if (!value) {
        return "Currency is required";
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
