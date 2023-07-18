import { Application } from "../components/ApplicationComponents/ApplicationDetailsShelter";

export const formatFieldValue = (field: keyof Application, value: any) => {
  if (field === "petAloneTime") {
    return value > 1 ? `${value} hrs` : `${value} hr`;
  }
  if (field === "residenceType") {
    return value === "ownHouse" ? "Owns house" : "Rents house";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
};
