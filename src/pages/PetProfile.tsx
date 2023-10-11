import { useNavigate, useParams } from "react-router-dom";
import PetImagesCarousel from "../components/PetComponents/PetImagesCarousel";
import PetBasicInfo from "../components/PetComponents/PetBasicInfo";
import PetAdditionalInfo from "../components/PetComponents/PetAdditionalInfo";
import PetTraits from "../components/PetComponents/PetTraits";
import PetAdoptionApply from "../components/PetComponents/PetAdoptionApply";
import api from "../api";
import { useEffect, useState } from "react";
import loadingIcon from "../assets/loading.gif";
import { Pet } from "./HomePage";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

const PetProfile = () => {
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { petID } = useParams();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/pets/${petID}`);
        setPet(response.data.pet);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (petID && !pet) {
      fetchPet();
    }
  }, [petID, pet]);
  console.log(pet);

  const handleAdoptionApply = () => {
    navigate(`/adoptionApplication/${pet?.microchipID || ""}`);
  };

  const handleViewApplication = () => {
    navigate(`/view/application/${pet?.applicationID}`);
  };

  return (
    <>
      {isLoading && (
        <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-28 pb-8">
          <div className="flex items-center justify-center mb-8">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        </div>
      )}
      {pet && (
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 flex flex-col justify-center items-center mt-20">
          <PetImagesCarousel petImages={pet.images} />
          <div className="flex flex-col md:flex-row justify-center w-full px-8 space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-3/4 mx-auto max-w-6xl">
              <PetBasicInfo petBio={pet.bio.replace(/\\n/g, "\n \n")} />
            </div>
            <div className="w-full md:w-1/4">
              <PetAdditionalInfo
                petName={pet.name}
                petBirthDate={pet.birthDate}
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
              <PetTraits petTraits={pet.traits} />
            </div>
            <div className="w-full md:w-1/4">
              <PetAdoptionApply
                petShelterID={pet.shelterID}
                petShelterName={pet.shelterName}
                petShelterRating={pet.shelterRating}
                petAdoptionFee={pet.adoptionFee}
                handleSubmit={
                  pet.hasAdoptionRequest
                    ? handleViewApplication
                    : handleAdoptionApply
                }
                text={
                  pet.hasAdoptionRequest
                    ? "View Application Status"
                    : "Apply for Adoption"
                }
                isAdopted={pet.isAdopted}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetProfile;
