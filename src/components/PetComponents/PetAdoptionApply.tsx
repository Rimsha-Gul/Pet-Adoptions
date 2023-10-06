import { FormEvent, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import StarRatings from "react-star-ratings";
import { BiLinkExternal } from "react-icons/bi";

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
    <div className="flex flex-col gap-6 max-w-9xl p-8 sm:p-12 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 ">
      <p className="text-lg flex flex-wrap items-end gap-2">
        <span className="text-primary font-bold">Shelter Name:</span>
        <a
          data-cy="shelter-link"
          className="hover:underline text-gray-500"
          href={`/shelterProfile/${petShelterID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            data-cy="shelter-name"
            className="flex items-center gap-1 font-medium"
          >
            {petShelterName}
            <BiLinkExternal className="w-5 h-5" />
          </span>
        </a>
        {petShelterRating !== 0 && (
          <>
            <StarRatings
              rating={petShelterRating}
              starDimension="20px"
              starSpacing="3px"
              starRatedColor="gold"
            />
            <span className="flex items-end justify-end text-lg text-gray-600">
              {petShelterRating.toFixed(1)}
            </span>
          </>
        )}
      </p>
      <p className="text-lg text-gray-500">
        <span className="text-primary font-bold">Adoption Fee:</span>{" "}
        <span data-cy="adoption-fee">{petAdoptionFee}</span>
      </p>
      <div className="flex items-center justify-center">
        {userRole === "USER" &&
          (isAdopted ? (
            <p className="text-gray-700 text-xl font-medium">
              This pet has been adopted
            </p>
          ) : (
            <button
              data-cy="application-button"
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
