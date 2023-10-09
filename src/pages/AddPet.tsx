import { FormEvent, useContext, useEffect, useState } from "react";
import Input from "../components/AuthComponents/Input";
import { addPetFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import FormAction from "../components/AuthComponents/FormAction";
import { validateField } from "../utils/formValidation";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";
import { FileInput } from "../components/PetComponents/PetImageUpload";
import { AppContext } from "../context/AppContext";

interface Pet {
  microchipID: string;
  name: string;
  gender: string;
  birthDate: string;
  color: string;
  breed: string;
  category: string;
  activityNeeds: string;
  levelOfGrooming: string;
  isHouseTrained: boolean;
  healthInfo: {
    healthCheck: boolean;
    allergiesTreated: boolean;
    wormed: boolean;
    heartwormTreated: boolean;
    vaccinated: boolean;
    deSexed: boolean;
  };
  bio: string;
  traits: string[];
  adoptionFee: string;
  images: string[];
}

const groups = [
  {
    label: "Basic Information",
    fields: [
      "shelter",
      "category",
      "microchipID",
      "petName",
      "gender",
      "birthDate",
    ],
  },
  {
    label: "Physical Characteristics",
    fields: ["breed", "color", "activityNeeds", "levelOfGrooming"],
  },
  {
    label: "Health Details",
    fields: [
      "isHouseTrained",
      "healthCheck",
      "allergiesTreated",
      "wormed",
      "heartwormTreated",
      "vaccinated",
      "deSexed",
    ],
  },
  {
    label: "Additional Information",
    fields: ["traits", "adoptionFee", "currency", "bio", "images"],
  },
];

const fields = addPetFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const AddPet = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const userRole = appContext.userRole;
  const [addPetState, setAddPetState] = useState<FieldsState>(fieldsState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [serverErrorMessage, setServerError] = useState<string>("");
  const [shelters, setShelters] = useState([]);
  const [errors, setErrors] = useState<FieldsState>({
    ...(userRole === "ADMIN" && { shelter: "shelter is required" }),
    category: "category is required",
    microchipID: "microchipID is required",
    petName: "name is required",
    gender: "gender is required",
    birthDate: "date of birth is required",
    breed: "breed is required",
    color: "color is required",
    activityNeeds: "activityNeeds is required",
    levelOfGrooming: "levelOfGrooming is required",
    isHouseTrained: "",
    healthCheck: "",
    allergiesTreated: "",
    wormed: "",
    heartwormTreated: "",
    vaccinated: "",
    deSexed: "",
    traits: "traits is required",
    adoptionFee: "adoptionFee is required",
    currency: "currency is required",
    bio: "bio is required",
    images: "",
  });

  const addPetData = {
    ...(userRole === "ADMIN" && { shelterID: addPetState.shelter }),
    category: addPetState.category,
    microchipID: addPetState.microchipID,
    name: addPetState.petName,
    gender: addPetState.gender,
    birthDate: addPetState.birthDate,
    breed: addPetState.breed,
    color: addPetState.color,
    activityNeeds: addPetState.activityNeeds,
    levelOfGrooming: addPetState.levelOfGrooming,
    isHouseTrained: addPetState.isHouseTrained === "true",
    healthCheck: addPetState.healthCheck === "true",
    allergiesTreated: addPetState.allergiesTreated === "true",
    wormed: addPetState.wormed === "true",
    heartwormTreated: addPetState.heartwormTreated === "true",
    vaccinated: addPetState.vaccinated === "true",
    deSexed: addPetState.deSexed === "true",
    traits: addPetState.traits,
    adoptionFee: `${addPetState.adoptionFee} ${addPetState.currency}`,
    bio: addPetState.bio,
  };

  useEffect(() => {
    if (userRole === "ADMIN") {
      const fetchShelters = async () => {
        try {
          const response = await api.get("/shelter/all");
          if (response.status === 200) {
            console.log(response.data);
            setShelters(
              response.data.map((shelter: { id: string; name: string }) => ({
                label: shelter.name,
                value: shelter.id,
              }))
            );
          }
        } catch (error: any) {
          if (error.response.status === 500) {
            console.error("Server error:", error.response.data.message);
            setServerError(
              "An error occurred on the server. Please try again later."
            );
            showErrorAlert(
              "An error occurred on the server. Please try again later."
            );
          }
        }
      };

      fetchShelters();
    }
  }, [userRole]);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, addPetState);

    if (
      id === "isHouseTrained" ||
      id === "healthCheck" ||
      id === "allergiesTreated" ||
      id === "wormed" ||
      id === "heartwormTreated" ||
      id === "vaccinated" ||
      id === "deSexed"
    ) {
      setAddPetState((prevAddPetState) => ({
        ...prevAddPetState,
        [id]: value.toString(),
      }));
    } else {
      setAddPetState((prevAddPetState) => ({
        ...prevAddPetState,
        [id]: value,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: fieldError,
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
    e.preventDefault();
    addAPet();
  };

  const addAPet = async () => {
    console.log(addPetData);
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.entries(addPetData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });
      console.log(selectedFiles);
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }
      }
      console.log("formdata: ", formData);
      const response = await api.post("/pet", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type for FormData
        },
      });
      if (response.status === 200) {
        setServerError("");
        console.log("Response data: ", response.data);
        const pet: Pet = response.data;
        console.log("Pet: ", pet);
        showSuccessAlert(
          "The pet has been added successfully.",
          () =>
            navigate(`/pet/${addPetData.microchipID}`, {
              state: pet,
            }),
          () => {
            window.location.reload();
          },
          '<a href id="navigatePet">View the pet\'s profile page</a><style>#navigatePet:hover { text-decoration: underline; }</style>',
          "navigatePet"
        );
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log(error.response);
        showErrorAlert(error.response.data);

        if (error.response.data === "Invalid shelter ID.") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            shelter: error.response.data,
          }));
        } else if (error.response.data === "Pet already exists.") {
          console.log(error.response.data);
          setErrors((prevErrors) => ({
            ...prevErrors,
            microchipID: error.response.data,
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            images: error.response.data,
          }));
        }
      } else if (error.response.status === 500) {
        console.error("Server error:", error.response.data);
        setServerError(
          "An error occurred on the server. Please try again later."
        );
        showErrorAlert(
          "An error occurred on the server. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-12">
                  {addPetFields
                    .filter((field) => group.fields.includes(field.id))
                    .map((field) => {
                      if (field.id === "bio") {
                        return (
                          <div
                            key={field.id}
                            className="col-span-1 md:col-span-2"
                          >
                            <Input
                              key={field.id}
                              handleChange={handleChange}
                              value={addPetState[field.id]}
                              labelText={field.labelText}
                              labelFor={field.labelFor}
                              id={field.id}
                              name={field.name}
                              type={field.type}
                              isRequired={field.isRequired}
                              placeholder={field.placeholder}
                              rows={field.rows}
                              labelClassName="text-gray-700 font-medium text-lg"
                              customClass=""
                              options={
                                field.name === "shelter"
                                  ? shelters
                                  : field.options
                              }
                              validationError={errors[field.id]}
                              showShelterID={appContext.userRole === "ADMIN"}
                            />
                          </div>
                        );
                      }
                      if (field.id === "images") {
                        return (
                          <FileInput
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            previews={previews}
                            setPreviews={setPreviews}
                            errors={errors}
                            setErrors={setErrors}
                            addPetState={addPetState}
                            validateField={validateField}
                          />
                        );
                      }
                      return (
                        <Input
                          key={field.id}
                          handleChange={handleChange}
                          value={addPetState[field.id]}
                          labelText={field.labelText}
                          labelFor={field.labelFor}
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          isRequired={field.isRequired}
                          placeholder={field.placeholder}
                          rows={field.rows}
                          labelClassName="text-gray-700 font-medium text-lg"
                          customClass=""
                          options={
                            field.name === "shelter" ? shelters : field.options
                          }
                          validationError={errors[field.id]}
                          showShelterID={userRole === "ADMIN"}
                        />
                      );
                    })}
                </div>
              </div>
            ))}

            <FormAction
              handleSubmit={handleSubmit}
              text="Add Pet"
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

export default AddPet;
