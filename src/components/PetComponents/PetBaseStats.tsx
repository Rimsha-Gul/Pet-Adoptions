import { formatAge } from "../../utils/formatAge";
interface PetBaseStatProps {
  petBirthDate: string;
  petColor: string;
  petGender: string;
  petBreed: string;
  petActivityNeeds: string;
  petLevelOfGrooming: string;
  petIsHouseTrained: string;
}

const PetBaseStats = ({
  petBirthDate,
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
        { name: "Age", value: formatAge(petBirthDate) },
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
            <span
              data-cy={`${name.toLowerCase().replace(/ /g, "-")}-stat`}
              className="capitalize"
            >
              {value.toLowerCase()}
            </span>
          ) : (
            <span data-cy={`${name.toLowerCase().replace(/ /g, "-")}-stat`}>
              {value.replace(/_/g, " ")}
            </span>
          )}
        </p>
      ))}
    </div>
  );
};

export default PetBaseStats;
