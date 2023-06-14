import PetBaseStats from "./PetBaseStats";
import PetHealthInfo from "./PetHealthInfo";

interface PetAdditionalInfoProps {
  petName: string;
  petAge: string;
  petColor: string;
  petGender: string;
  petBreed: string;
  petActivityNeeds: string;
  petLevelOfGrooming: string;
  petIsHouseTrained: string;
  petHealthInfo: {
    healthCheck: boolean;
    allergiesTreated: boolean;
    wormed: boolean;
    heartwormTreated: boolean;
    vaccinated: boolean;
    deSexed: boolean;
  };
}

const PetAdditionalInfo = ({
  petName,
  petAge,
  petColor,
  petGender,
  petBreed,
  petActivityNeeds,
  petLevelOfGrooming,
  petIsHouseTrained,
  petHealthInfo,
}: PetAdditionalInfoProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white rounded p-12 h-full">
      <p className="text-primary font-bold text-xl uppercase mb-3">
        {petName}'s Stats
      </p>
      <div className="border border-gray-200"></div>
      <PetBaseStats
        petAge={petAge}
        petColor={petColor}
        petGender={petGender}
        petBreed={petBreed}
        petActivityNeeds={petActivityNeeds}
        petLevelOfGrooming={petLevelOfGrooming}
        petIsHouseTrained={petIsHouseTrained}
      />
      <p className="text-primary font-bold text-xl uppercase">Health Info</p>
      <div className="border border-gray-200"></div>
      <PetHealthInfo petHealthInfo={petHealthInfo} />
    </div>
  );
};

export default PetAdditionalInfo;
