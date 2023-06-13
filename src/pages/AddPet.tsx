import { FormEvent, useEffect, useState } from "react";
import Input from "../components/AuthComponents/Input";
import { addPetFields } from "../constants/formFields";
import { FieldsState } from "../types/common";
import FormAction from "../components/AuthComponents/FormAction";
import { validateField } from "../utils/formValidation";
import api from "../api";
import { useNavigate } from "react-router-dom";

const groups = [
  {
    label: "Basic Information",
    fields: ["shelter", "category", "microchipID", "petName", "gender", "age"],
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
  const [addPetState, setAddPetState] = useState<FieldsState>(fieldsState);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [serverErrorMessage, setServerError] = useState<string>("");
  const [shelters, setShelters] = useState([]);
  const [errors, setErrors] = useState<FieldsState>({
    shelter: "shelter is required",
    category: "category is required",
    microchipID: "microchipID is required",
    petName: "name is required",
    gender: "gender is required",
    age: "age is required",
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
    images: "choose at least one image",
  });

  const addPetData = {
    shelterID: addPetState.shelter,
    category: addPetState.category,
    microchipID: addPetState.microchipID,
    name: addPetState.petName,
    gender: addPetState.gender,
    age: addPetState.age,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await api.get("/auth/shelters");
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
        if (error.response.status === 401) {
          console.error(error.response.status);
          navigate("/");
        }
        if (error.response.status === 500) {
          console.error("Server error:", error.response.data.message);
          setServerError(
            "An error occurred on the server. Please try again later."
          );
        }
      }
    };

    fetchShelters();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);

    // Convert the files to a string representation
    const filesString = files
      ? Array.from(files)
          .map((file) => file.name)
          .join(", ")
      : "";

    // Validate the files string
    const fieldError = validateField("images", filesString, addPetState);

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      images: fieldError,
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
        console.log(error.response);
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
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white mx-24 my-40 md:mx-24 md:my-32 2xl:mx-64">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-12">
        {serverErrorMessage && (
          <p className="text-red-500">{serverErrorMessage}</p>
        )}
        <div className="flex flex-col sm:p-8 justify-center">
          <form className="flex flex-col mx-auto w-full space-y-8 mt-8 mb-8 g-12">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-2xl text-primary font-bold mb-4">
                  {group.label}
                </h2>
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
                              customClass=""
                              options={
                                field.name === "shelter"
                                  ? shelters
                                  : field.options
                              }
                              validationError={errors[field.id]}
                              showShelterID={
                                localStorage.getItem("userRole") === "ADMIN"
                              }
                            />
                          </div>
                        );
                      }
                      if (field.id === "images") {
                        return (
                          <div key={field.id} className="col-span-1 my-5">
                            <label htmlFor={field.id}>{field.labelText}</label>
                            <input
                              type={field.type}
                              id={field.id}
                              name={field.name}
                              onChange={handleFileChange}
                              multiple={field.multiple}
                              className="mt-2 block w-full shadow-sm sm:text-sm rounded-sm"
                            />
                          </div>
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
                          customClass=""
                          options={
                            field.name === "shelter" ? shelters : field.options
                          }
                          validationError={errors[field.id]}
                          showShelterID={
                            localStorage.getItem("userRole") === "ADMIN"
                          }
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
