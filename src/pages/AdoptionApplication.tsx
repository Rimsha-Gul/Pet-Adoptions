import { FormEvent, useEffect, useState } from "react";
import FormAction from "../components/AuthComponents/FormAction";
import Input from "../components/AuthComponents/Input";
import { adoptPetFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import { validateField } from "../utils/formValidation";
import { useLocation } from "react-router-dom";

const AdoptionApplication = () => {
  const location = useLocation();
  const { pet } = location.state;
  const groups = [
    {
      label: "Residence Information",
      fields: [
        "residenceType",
        "hasRentPetPermission",
        "isWillingHomeInspection",
        "hasChildren",
        "childrenAges",
        "hasOtherPets",
        "otherPetsInfo",
      ],
    },
    {
      label: "Pet Engagement Information",
      fields: ["petAloneTime", "hasPlayTimeParks", "petActivities"],
    },
    {
      label: "Pet Commitment Information",
      fields: [
        "handlePetIssues",
        "moveWithPet",
        "canAffordPetsNeeds",
        "canAffordPetsMediacal",
        "petTravelPlans",
        "petOutlivePlans",
      ],
    },
  ];

  const isDependentField = (fieldId: string) => {
    const field = adoptPetFields.find((field) => field.id === fieldId);
    return field && field.dependsOn !== undefined;
  };

  const fields = adoptPetFields;
  let fieldsState: FieldsState = {};
  fields.forEach((field) => (fieldsState[field.id] = ""));

  const [adoptPetState, setAdoptPetState] = useState<FieldsState>(fieldsState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [serverErrorMessage, setServerError] = useState<string>("");

  const [errors, setErrors] = useState<FieldsState>({
    residenceType: "residence type is required",
    hasRentPetPermission: "",
    hasChildren: "",
    childrenAges: "",
    hasOtherPets: "",
    otherPetsInfo: "",
    petAloneTime: "Pet alone time is required",
    petActivities: "Pet Activities is required",
    handlePetIssues: "Handle pet issues is required",
    moveWithPet: "Moving with pet is required",
    petTravelPlans: "Pet travel plans is required",
    petOutlivePlans: "Pet outlive plans is required",
  });

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, adoptPetState);

    if (
      id === "hasRentPetPermission" ||
      id === "isWillingHomeInspection" ||
      id === "hasChildren" ||
      id === "hasOtherPets" ||
      id === "hasPlayTimeParks" ||
      id === "canAffordPetsNeeds" ||
      id === "canAffordPetsMediacal"
    ) {
      setAdoptPetState((prevAdoptPetState) => ({
        ...prevAdoptPetState,
        [id]: value.toString(),
      }));
    } else {
      setAdoptPetState((prevAdoptPetState) => ({
        ...prevAdoptPetState,
        [id]: value,
      }));
    }
    let childrenAgesError = "";
    let otherPetsInfoError = "";
    if (id === "hasChildren") {
      childrenAgesError = validateField(
        "childrenAges",
        adoptPetState.childrenAges,
        adoptPetState,
        value
      );
    }
    if (id === "hasOtherPets") {
      otherPetsInfoError = validateField(
        "otherPetsInfo",
        adoptPetState.otherPetsInfo,
        adoptPetState,
        value
      );
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: fieldError,
      ["childrenAges"]: childrenAgesError,
      ["otherPetsInfo"]: otherPetsInfoError,
    }));
  };

  useEffect(() => {
    // Check if all fields are valid
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );

    // Update the form validity state
    setIsFormValid(isAllFieldsValid);
    console.log(errors);
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    console.log(errors);
    e.preventDefault();
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12">
        {serverErrorMessage && (
          <p className="text-red-500">{serverErrorMessage}</p>
        )}
        <div className="flex flex-col justify-center">
          <form className="flex flex-col mx-auto w-full space-y-8 mt-8 mb-8 g-12">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-2xl text-primary font-bold mb-4 ">
                  {group.label}
                </h2>
                <div className="border-b-2 border-gray-200 my-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-x-24 md:gap-y-12 items-center">
                  {group.fields.map((fieldId) => {
                    const field = adoptPetFields.find(
                      (field) => field.id === fieldId
                    );
                    if (!field) return null;
                    if (!field) return null;

                    if (isDependentField(field.id)) return null; // skip rendering if this is a dependent field

                    return (
                      <div className="flex flex-col" key={field.id}>
                        <Input
                          handleChange={handleChange}
                          value={adoptPetState[field.id]}
                          labelText={field.labelText}
                          labelFor={field.labelFor}
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          isRequired={field.isRequired}
                          placeholder={field.placeholder}
                          labelClassName="text-gray-700 font-medium text-lg"
                          customClass=""
                          options={field.options}
                          validationError={errors[field.id]}
                        />

                        {/* Render dependent field here */}
                        {adoptPetFields
                          .filter(
                            (dependentField) =>
                              dependentField.dependsOn === field.id
                          )
                          .map((dependentField) => {
                            if (
                              adoptPetState[
                                dependentField.dependsOn
                                  ? dependentField.dependsOn
                                  : ""
                              ] !== dependentField.dependsOnValue
                            ) {
                              return null;
                            }

                            return (
                              <div key={dependentField.id}>
                                <Input
                                  handleChange={handleChange}
                                  value={adoptPetState[dependentField.id]}
                                  labelText={dependentField.labelText}
                                  labelFor={dependentField.labelFor}
                                  id={dependentField.id}
                                  name={dependentField.name}
                                  type={dependentField.type}
                                  isRequired={dependentField.isRequired}
                                  placeholder={dependentField.placeholder}
                                  labelClassName="text-gray-700 font-medium text-lg"
                                  customClass=""
                                  options={dependentField.options}
                                  validationError={errors[dependentField.id]}
                                />
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <FormAction
              handleSubmit={handleSubmit}
              text="Apply for Adoption"
              isLoading={isLoading}
              disabled={!isFormValid}
              customClass="w-1/3 mx-auto"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionApplication;
