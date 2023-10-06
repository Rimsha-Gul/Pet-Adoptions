export const signupFields = [
  {
    labelText: "Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Name",
  },
  {
    labelText: "Email",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "new-password",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "ConfirmPassword",
    labelFor: "confirmPassword",
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    isRequired: true,
    placeholder: "Confirm Password",
  },
];

export const loginFields = [
  {
    labelText: "Email ",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
];

export const changePasswordFields = [
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "new-password",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "ConfirmPassword",
    labelFor: "confirmPassword",
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    isRequired: true,
    placeholder: "Confirm Password",
  },
];

export const addPetFields = [
  {
    labelText: "Shelter",
    labelFor: "shelter",
    id: "shelter",
    name: "shelter",
    type: "select",
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText: "Category",
    labelFor: "category",
    id: "category",
    name: "category",
    type: "select",
    autoComplete: "off",
    isRequired: true,
    options: [
      { value: "Cat", label: "Cat" },
      { value: "Dog", label: "Dog" },
      { value: "Horse", label: "Horse" },
      { value: "Rabbit", label: "Rabbit" },
      { value: "Bird", label: "Bird" },
      { value: "Small and Furry", label: "Small & Furry" },
      { value: "Scales, Fins and Others", label: "Scales, fins & others" },
      { value: "Barnyard", label: "Barnyard" },
    ],
  },
  {
    labelText: "Microchip ID",
    labelFor: "microchipID",
    id: "microchipID",
    name: "microchipID",
    type: "text",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Microchip ID",
  },
  {
    labelText: "Name",
    labelFor: "petName",
    id: "petName",
    name: "petName",
    type: "text",
    autoComplete: "petName",
    isRequired: true,
    placeholder: "Name",
  },
  {
    labelText: "Gender",
    labelFor: "gender",
    id: "gender",
    name: "gender",
    type: "select",
    autoComplete: "gender",
    isRequired: true,
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    labelText: "Birth Date",
    labelFor: "birthDate",
    id: "birthDate",
    name: "birthDate",
    type: "date",
    autoComplete: "bday",
    isRequired: true,
    placeholder: "YYYY/MM/DD",
  },
  {
    labelText: "Breed",
    labelFor: "breed",
    id: "breed",
    name: "breed",
    type: "text",
    autoComplete: "breed",
    isRequired: true,
    placeholder: "Breed",
  },
  {
    labelText: "Color",
    labelFor: "color",
    id: "color",
    name: "color",
    type: "text",
    autoComplete: "color",
    isRequired: true,
    placeholder: "Color",
  },
  {
    labelText: "Activity Needs",
    labelFor: "activityNeeds",
    id: "activityNeeds",
    name: "activityNeeds",
    type: "select",
    autoComplete: "activityNeeds",
    isRequired: true,
    options: [
      { value: "Very Low", label: "Very Low" },
      { value: "Low", label: "Low" },
      { value: "Midrange", label: "Midrange" },
      { value: "High", label: "High" },
      { value: "Very High", label: "Very High" },
    ],
  },
  {
    labelText: "Level Of Grooming",
    labelFor: "levelOfGrooming",
    id: "levelOfGrooming",
    name: "levelOfGrooming",
    type: "select",
    autoComplete: "levelOfGrooming",
    isRequired: true,
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
  },
  {
    labelText: "House Trained",
    labelFor: "isHouseTrained",
    id: "isHouseTrained",
    name: "isHouseTrained",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Health Check",
    labelFor: "healthCheck",
    id: "healthCheck",
    name: "healthCheck",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Allergies Treated",
    labelFor: "allergiesTreated",
    id: "allergiesTreated",
    name: "allergiesTreated",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Wormed",
    labelFor: "wormed",
    id: "wormed",
    name: "wormed",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Heartworm Treated",
    labelFor: "heartwormTreated",
    id: "heartwormTreated",
    name: "heartwormTreated",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Vaccinated",
    labelFor: "vaccinated",
    id: "vaccinated",
    name: "vaccinated",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "deSexed",
    labelFor: "deSexed",
    id: "deSexed",
    name: "deSexed",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "Traits",
    labelFor: "traits",
    id: "traits",
    name: "traits",
    type: "text",
    autoComplete: "off",
    isRequired: false,
    placeholder: "Comma separated traits",
  },
  {
    labelText: "Adoption Fee",
    labelFor: "adoptionFee",
    id: "adoptionFee",
    name: "adoptionFee",
    type: "number",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Adoption fee",
  },
  {
    labelText: "Currency",
    labelFor: "currency",
    id: "currency",
    name: "currency",
    type: "select",
    options: [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
      { value: "GBP", label: "GBP" },
      { value: "JPY", label: "JPY" },
      { value: "AUD", label: "AUD" },
    ],
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText: "Bio",
    labelFor: "bio",
    id: "bio",
    name: "bio",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Pet's bio",
    rows: 10,
  },
  {
    labelText: "Images",
    labelFor: "images",
    id: "images",
    name: "images",
    type: "file",
    autoComplete: "off",
    isRequired: true,
    multiple: true,
  },
];

export const adoptPetFields = [
  {
    labelText: "Residence Type",
    labelFor: "residenceType",
    id: "residenceType",
    name: "residenceType",
    type: "select",
    options: [
      { value: "ownHouse", label: "Own a house" },
      { value: "rentHouse", label: "Rent a house" },
    ],
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText: "Do you have permission from your landlord to have a pet?",
    labelFor: "hasRentPetPermission",
    id: "hasRentPetPermission",
    name: "hasRentPetPermission",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
    dependsOn: "residenceType",
    dependsOnValue: "rentHouse",
  },
  {
    labelText: "Are there any children in the household?",
    labelFor: "hasChildren",
    id: "hasChildren",
    name: "hasChildren",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "What are their ages?",
    labelFor: "childrenAges",
    id: "childrenAges",
    name: "childrenAges",
    type: "text",
    placeholder: "Enter ages separated by commas",
    isRequired: false,
    dependsOn: "hasChildren",
    dependsOnValue: "true",
  },
  {
    labelText: "Do you have any other pets in your household?",
    labelFor: "hasOtherPets",
    id: "hasOtherPets",
    name: "hasOtherPets",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "What are their types and how many are there?",
    labelFor: "otherPetsInfo",
    id: "otherPetsInfo",
    name: "otherPetsInfo",
    type: "text",
    placeholder: "Cat 1, Dog 2",
    isRequired: false,
    dependsOn: "hasOtherPets",
    dependsOnValue: "true",
  },
  {
    labelText: "How many hours a day will the pet be left alone?",
    labelFor: "petAloneTime",
    id: "petAloneTime",
    name: "petAloneTime",
    type: "number",
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText: "Do you have a fenced yard or nearby parks for playtime?",
    labelFor: "hasPlayTimeParks",
    id: "hasPlayTimeParks",
    name: "hasPlayTimeParks",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "What kind of activities would you like to do with your pet?",
    labelFor: "petActivities",
    id: "petActivities",
    name: "petActivities",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Activities with the pet",
  },
  {
    labelText:
      "How would you handle destructive behavior like scratching furniture or chewing shoes?",
    labelFor: "handlePetIssues",
    id: "handlePetIssues",
    name: "handlePetIssues",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText:
      "Are you financially prepared to provide for a pet's needs, including food, regular veterinary care, etc.?",
    labelFor: "canAffordPetsNeeds",
    id: "canAffordPetsNeeds",
    name: "canAffordPetsNeeds",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText:
      "If the pet falls ill or has a medical emergency, are you financially prepared to provide the necessary care?",
    labelFor: "canAffordPetsMediacal",
    id: "canAffordPetsMediacal",
    name: "canAffordPetsMediacal",
    type: "toggle",
    autoComplete: "off",
    isRequired: true,
    defaultValue: false,
  },
  {
    labelText: "What would you do with the pet if you have to move?",
    labelFor: "moveWithPet",
    id: "moveWithPet",
    name: "moveWithPet",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText: "What are your plans for the pet when you're travelling?",
    labelFor: "petTravelPlans",
    id: "petTravelPlans",
    name: "petTravelPlans",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
  },
  {
    labelText:
      "If the pet outlives you, do you have plans for who will take care of it?",
    labelFor: "petOutlivePlans",
    id: "petOutlivePlans",
    name: "petOutlivePlans",
    type: "textarea",
    autoComplete: "off",
    isRequired: true,
  },
];

export const reviewFields = [
  {
    labelText: "Rating",
    labelFor: "rating",
    id: "rating",
    name: "rating",
    type: "number",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Enter your rating",
  },
  {
    labelText: "Review",
    labelFor: "review",
    id: "review",
    name: "review",
    type: "text",
    autoComplete: "off",
    isRequired: true,
    placeholder: "Write your review here...",
  },
];
