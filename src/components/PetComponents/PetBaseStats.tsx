interface PetBaseStatProps {
  petAge: string;
  petColor: string;
  petGender: string;
  petBreed: string;
  petActivityNeeds: string;
  petLevelOfGrooming: string;
  petIsHouseTrained: string;
}

const PetBaseStats = ({
  petAge,
  petColor,
  petGender,
  petBreed,
  petActivityNeeds,
  petLevelOfGrooming,
  petIsHouseTrained,
}: PetBaseStatProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {[
        { name: "Age", value: petAge },
        { name: "Color", value: petColor },
        { name: "Gender", value: petGender, isLowercase: true },
        { name: "Breed", value: petBreed },
        { name: "Activity needs", value: petActivityNeeds, isLowercase: true },
        {
          name: "Level Of Grooming",
          value: petLevelOfGrooming,
          isLowercase: true,
        },
        { name: "House trained", value: petIsHouseTrained ? "Yes" : "No" },
      ].map(({ name, value, isLowercase }) => (
        <p className="text-lg text-gray-500" key={name}>
          <span className="text-secondary font-bold">{name}:</span>{" "}
          {isLowercase ? (
            <span className="capitalize">{value.toLowerCase()}</span>
          ) : (
            value
          )}
        </p>
      ))}
    </div>
  );
};

export default PetBaseStats;
