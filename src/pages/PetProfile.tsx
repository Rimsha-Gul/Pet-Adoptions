import { useLocation } from "react-router-dom";
import PetImagesCarousel from "../components/PetComponents/PetImagesCarousel";
import PetBasicInfo from "../components/PetComponents/PetBasicInfo";
import PetAdditionalInfo from "../components/PetComponents/PetAdditionalInfo";

const PetProfile = () => {
  const location = useLocation();
  const { pet } = location.state;
  const petBio = pet.bio.replace(/\\n/g, "\n \n");

  return (
    <>
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 flex flex-col justify-center items-center mt-24 mb-8">
        <PetImagesCarousel petImages={pet.images} />
        <div className="flex flex-row justify-center items-start gap-12">
          <PetBasicInfo
            petBio={petBio}
            petCategory={pet.category}
            petTraits={pet.traits}
          />
          <PetAdditionalInfo
            petName={pet.name}
            petAge={pet.age}
            petColor={pet.color}
            petGender={pet.gender}
            petBreed={pet.breed}
            petActivityNeeds={pet.activityNeeds}
            petLevelOfGrooming={pet.levelOfGrooming}
            petIsHouseTrained={pet.isHouseTrained}
            petHealthInfo={pet.healthInfo}
            petAdoptionFee={pet.adoptionFee}
          />
        </div>
      </div>
    </>
  );
};

export default PetProfile;
