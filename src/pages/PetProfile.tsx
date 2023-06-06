import { useLocation } from "react-router-dom";
import PetImagesCarousel from "../components/PetComponents/PetImagesCarousel";
import PetBasicInfo from "../components/PetComponents/PetBasicInfo";
import PetAdditionalInfo from "../components/PetComponents/PetAdditionalInfo";
import PetTraits from "../components/PetComponents/PetTraits";
import PetAdoptionApply from "../components/PetComponents/PetAdoptionApply";

const PetProfile = () => {
  const location = useLocation();
  const { pet } = location.state;
  const petBio = pet.bio.replace(/\\n/g, "\n \n");

  return (
    <>
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 flex flex-col justify-center items-center mt-24">
        <PetImagesCarousel petImages={pet.images} />
        <div className="flex flex-col md:flex-row justify-center w-full px-8 space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-3/4 mx-auto max-w-6xl">
            <PetBasicInfo petBio={petBio} />
          </div>
          <div className="w-full md:w-1/4">
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
            />
          </div>
        </div>
        <div className="md:bg-white flex flex-col md:flex-row justify-start w-full px-8 space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-3/4 mx-auto max-w-6xl">
            <PetTraits petCategory={pet.category} petTraits={pet.traits} />
          </div>
          <div className="w-full md:w-1/4">
            <PetAdoptionApply petAdoptionFee={pet.adoptionFee} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PetProfile;
