import { useNavigate } from "react-router-dom";

interface Pet {
  microchipID: string;
  shelterID: string;
  name: string;
  birthDate: string;
  color: string;
  bio: string;
  images: string[];
}

interface PetCardProps {
  pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-gray-100 rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center hover:cursor-pointer hover:shadow-primary transform transition-all duration-300 hover:scale-105"
      onClick={() =>
        navigate(`/pet/${pet.microchipID}`, {
          state: { pet },
        })
      }
    >
      <img
        src={pet.images[0]}
        alt="Pet Image"
        className="w-full h-80 object-cover rounded-t-lg"
      />
      <div className="mt-2 flex flex-col gap-4 p-4">
        <h3 className="text-2xl text-primary font-bold text-center">
          {pet.name}
        </h3>
        <p className="text-md text-gray-500 line-clamp-2 text-justify px-4">
          {pet.bio}
        </p>
      </div>
    </div>
  );
};

export default PetCard;
