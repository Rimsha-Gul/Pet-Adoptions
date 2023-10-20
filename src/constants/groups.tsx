export const applicationGroups = [
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
      "canAffordPetsMedical",
      "petTravelPlans",
      "petOutlivePlans",
    ],
  },
];
