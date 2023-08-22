import { FormEvent, useEffect, useState } from "react";
import FormAction from "../components/AuthComponents/FormAction";
import Input from "../components/AuthComponents/Input";
import { adoptPetFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import { validateField } from "../utils/formValidation";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";
import { Pet } from "./HomePage";
import loadingIcon from "../assets/loading.gif";

const groups = [
  {
    label: "Residence Information",
    fields: [
      "residenceType",
      "hasRentPetPermission",
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

const fields = adoptPetFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const AdoptionApplication = () => {
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);

  const isDependentField = (fieldId: string) => {
    const field = adoptPetFields.find((field) => field.id === fieldId);
    return field && field.dependsOn !== undefined;
  };

  const [adoptPetState, setAdoptPetState] = useState<FieldsState>(fieldsState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

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

  const { petID } = useParams();
  console.log(petID);
  useEffect(() => {
    const fetchPet = async () => {
      console.log("fetch pet");
      try {
        setIsLoading(true);
        const response = await api.get("/pet", {
          params: {
            id: petID,
          },
        });
        setPet(response.data.pet);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (petID && !pet) {
      console.log("should fetch");
      fetchPet();
    }
  }, [petID, pet]);
  console.log(pet);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, adoptPetState);

    if (
      id === "hasRentPetPermission" ||
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
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    console.log(errors);
    e.preventDefault();
    applyForPet();
  };
  console.log(pet);

  const adoptPetData = {
    shelterID: pet?.shelterID,
    microchipID: pet?.microchipID,
    residenceType: adoptPetState.residenceType,
    ...(adoptPetState.residenceType === "rentHouse" && {
      hasRentPetPermission: adoptPetState.hasRentPetPermission === "true",
    }),
    hasChildren: adoptPetState.hasChildren === "true",
    ...(adoptPetState.hasChildren === "true" && {
      childrenAges: adoptPetState.childrenAges,
    }),
    hasOtherPets: adoptPetState.hasOtherPets === "true",
    ...(adoptPetState.hasOtherPets === "true" && {
      otherPetsInfo: adoptPetState.otherPetsInfo,
    }),
    petAloneTime: adoptPetState.petAloneTime,
    hasPlayTimeParks: adoptPetState.hasPlayTimeParks === "true",
    petActivities: adoptPetState.petActivities,
    handlePetIssues: adoptPetState.handlePetIssues,
    moveWithPet: adoptPetState.moveWithPet,
    canAffordPetsNeeds: adoptPetState.canAffordPetsNeeds === "true",
    canAffordPetsMediacal: adoptPetState.canAffordPetsMediacal === "true",
    petTravelPlans: adoptPetState.petTravelPlans,
    petOutlivePlans: adoptPetState.petOutlivePlans,
  };

  const applyForPet = async () => {
    console.log(adoptPetData);
    try {
      setIsLoading(true);
      const response = await api.post("/application/", adoptPetData);
      console.log(response);
      const id = response.data.application.id;
      console.log(id);
      showSuccessAlert(
        "Application submitted successfully.",
        () => navigate(`/view/application/${id}`),
        () => {
          // Get the current URL path
          const path = window.location.pathname;

          // Check whether the current page is the application page
          if (!path.includes(`/view/application/${id}`)) {
            // If it's not, navigate to the pet page
            navigate(`/pet/${encodeURIComponent(id)}`);
          }
        },
        '<a href id="navigateApplication">View your application and its status</a><style>#navigateApplication:hover { text-decoration: underline; }</style>',
        "navigateApplication"
      );
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log(error.response);
        showErrorAlert(error.response.data);
      } else if (error.response.status === 500) {
        showErrorAlert(
          "An error occurred on the server. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {pet && (
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12">
          <div className="flex flex-col justify-center">
            <form className="flex flex-col mx-auto w-full space-y-8 mt-8 mb-8 g-12">
              {groups.map((group) => (
                <div key={group.label}>
                  <h2 className="text-xl sm:text-2xl text-primary font-bold mb-4 ">
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
                            labelClassName="text-gray-700 font-medium text-md sm:text-lg"
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
                                    labelClassName="text-gray-700 font-medium text-md sm:text-lg"
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
                customClass="w-2/3 sm:w-1/3 mx-auto"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionApplication;
