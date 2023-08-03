import { FieldsState } from "../types/common";

export const validateField = (
  id: string,
  value: string,
  fieldsState: FieldsState,
  newValue?: string
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
    shelter: (value) => {
      if (!value) {
        return "Shelter is required";
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
    images: (value) => {
      console.log(value);

      if (!value || parseInt(value) === 0) {
        return "Choose at least one image";
      }
      if (parseInt(value) > 10) {
        return "You can add a maximum of 10 files";
      }
      return "";
    },
    residenceType: (value) => {
      if (!value) {
        return "Residence Type is required";
      }

      return "";
    },
    childrenAges: (value) => {
      console.log(fieldsState.hasChildren);
      console.log(newValue);
      const childrenValue = newValue;
      if (childrenValue === "true") {
        if (!value) {
          return "Children Ages are required";
        }
      }
      return "";
    },
    otherPetsInfo: (value) => {
      if (fieldsState.otherPets === "true") {
        if (!value) {
          return "Other pets info is required";
        }
      }
      return "";
    },
    petAloneTime: (value) => {
      if (!value) {
        return "Pet alone time is required";
      }
      if (isNaN(Number(value))) {
        return "Pet alone time should be a valid number";
      }
      return "";
    },
    petActivities: (value) => {
      if (!value) {
        return "Pet Activities is required";
      }
      return "";
    },
    handlePetIssues: (value) => {
      if (!value) {
        return "Handle pet issues is required";
      }
      return "";
    },
    moveWithPet: (value) => {
      if (!value) {
        return "Moving with pet is required";
      }
      return "";
    },
    petTravelPlans: (value) => {
      if (!value) {
        return "Pet travel plans is required";
      }
      return "";
    },
    petOutlivePlans: (value) => {
      if (!value) {
        return "Pet outlive plans is required";
      }
      return "";
    },
    rating: (value) => {
      if (!value) {
        return "Rating is required";
      }
      if (parseInt(value) < 1 || parseInt(value) > 5) {
        return "Rating should be between 1 and 5";
      }
      return "";
    },
    review: (value) => {
      if (!value) {
        return "Review is required";
      }
      if (value.length < 10) {
        return "Review should be at least 10 characters long";
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
