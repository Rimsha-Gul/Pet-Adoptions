import { FormEvent, useEffect, useState } from "react";
import Input from "../components/AuthComponents/Input";
import { addPetFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import FormAction from "../components/AuthComponents/FormAction";
import { validateField } from "../utils/formValidation";
import api from "../api";

const fields = addPetFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const AddPet = () => {
  const [addPetState, setAddPetState] = useState<FieldsState>(fieldsState);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [serverErrorMessage, setServerError] = useState("");
  const [errors, setErrors] = useState<FieldsState>({
    shelterID: "shelterID is required",
    category: "category is required",
    microchipID: "microchipID is required",
    petName: "name is required",
    gender: "gender is required",
    age: "age is required",
    breed: "breed is required",
    color: "color is required",
    activityNeeds: "activityNeeds is required",
    levelOfGrooming: "levelOfGrooming is required",
    isHouseTrained: "isHouseTrained is required",
    healthCheck: "healthCheck is required",
    allergiesTreated: "allergiesTreated is required",
    wormed: "wormed is required",
    heartwormTreated: "heartwormTreated is required",
    vaccinated: "vaccinated is required",
    deSexed: "deSexed is required",
    bio: "bio is required",
    traits: "traits is required",
    adoptionFee: "adoptionFee is required",
    currency: "currency is required",
  });

  const addPetData = {
    shelterID: addPetState.shelterID,
    category: addPetState.category,
    microchipID: addPetState.microchipID,
    name: addPetState.petName,
    gender: addPetState.gender,
    age: addPetState.age,
    breed: addPetState.breed,
    color: addPetState.color,
    activityNeeds: addPetState.activityNeeds,
    levelOfGrooming: addPetState.levelOfGrooming,
    isHouseTrained: addPetState.isHouseTrained === "Yes",
    healthCheck: addPetState.healthCheck === "Yes",
    allergiesTreated: addPetState.allergiesTreated === "Yes",
    wormed: addPetState.wormed === "Yes",
    heartwormTreated: addPetState.heartwormTreated === "Yes",
    vaccinated: addPetState.vaccinated === "Yes",
    deSexed: addPetState.deSexed === "Yes",
    bio: addPetState.bio,
    traits: addPetState.traits,
    adoptionFee: `${addPetState.adoptionFee} ${addPetState.currency}`,
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;

    // Perform validation for the specific field being changed
    const fieldError = validateField(id, value, addPetState);

    setAddPetState((prevAddPetState) => ({
      ...prevAddPetState,
      [id]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: fieldError,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
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

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }
      }

      const response = await api.post("/pet", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to set the correct content type for FormData
        },
      });
      if (response.status === 200) {
        setServerError("");
        console.log(response.data);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        if (error.response.data.message === "Invalid shelter ID.") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            shelterID: "Invalid shelter ID.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            images: "No image file provided.",
          }));
        }
      } else if (error.response.status === 500) {
        // log the specific error message for debugging purposes
        console.error("Server error:", error.response.data.message);
        // display a generic error message to the user
        setServerError(
          "An error occurred on the server. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white p-12 m-40">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md ">
        {serverErrorMessage && (
          <p className="text-red-500">{serverErrorMessage}</p>
        )}

        <div className="flex flex-col justify-start p-8 g-40">
          <form className="mx-auto md:w-1/2 space-y-8 mt-8 g-12">
            <div className="-space-y-px">
              {fields.map((field) => (
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
                  customClass=""
                  options={field.options}
                  validationError={errors[field.id]}
                  showShelterID={localStorage.getItem("userRole") === "ADMIN"}
                />
              ))}
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            <FormAction
              handleSubmit={handleSubmit}
              text="Add Pet"
              isLoading={isLoading}
              disabled={!isFormValid}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;
