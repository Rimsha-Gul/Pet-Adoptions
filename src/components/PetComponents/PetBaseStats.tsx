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
        { name: "Gender", value: petGender },
        { name: "Breed", value: petBreed },
        { name: "Activity needs", value: petActivityNeeds },
        {
          name: "Level Of Grooming",
          value: petLevelOfGrooming,
        },
        { name: "House trained", value: petIsHouseTrained ? "Yes" : "No" },
      ].map(({ name, value }) => (
        <p className="text-lg text-gray-500" key={name}>
          <span className="text-secondary font-bold">{name}:</span>{" "}
          <span
            data-cy={`${name.toLowerCase().replace(/ /g, "-")}-stat`}
            className="capitalize"
          >
            {value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default PetBaseStats;
