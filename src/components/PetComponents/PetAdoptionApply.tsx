import { FormEvent, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

interface PetAdoptionApplyProps {
  petShelterID: string;
  petShelterName: string;
  petShelterRating: number;
  petAdoptionFee: string;
  handleSubmit: (e: FormEvent) => void;
  text: string;
  isAdopted: boolean;
}

const PetAdoptionApply = ({
  petShelterID,
  petShelterName,
  petShelterRating,
  petAdoptionFee,
  handleSubmit,
  text,
  isAdopted,
}: PetAdoptionApplyProps) => {
  const appContext = useContext(AppContext);
  const userRole = appContext.userRole;

  return (
    <div className="flex flex-col gap-6 max-w-9xl p-12 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 ">
      <p className="text-lg text-gray-500">
        <span className="text-primary font-bold">Shelter Name:</span>{" "}
        <Link
          className="hover:underline"
          to={`/shelterProfile/${petShelterID}`}
        >
          {petShelterName}
        </Link>
        {petShelterRating && (
          <StarRatings
            rating={petShelterRating}
            starDimension="20px"
            starSpacing="3px"
            starRatedColor="gold"
          />
        )}
      </p>
      <p className="text-lg text-gray-500">
        <span className="text-primary font-bold">Adoption Fee:</span>{" "}
        {petAdoptionFee}
      </p>
      <div className="flex items-center justify-center">
        {userRole === "USER" &&
          (isAdopted ? (
            <p className="text-gray-700 text-xl font-medium">
              This pet has been adopted
            </p>
          ) : (
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary"
              onClick={handleSubmit}
            >
              {text}
            </button>
          ))}
      </div>
    </div>
  );
};

export default PetAdoptionApply;
