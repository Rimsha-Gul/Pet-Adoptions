import {
  FaCheckCircle,
  FaStethoscope,
  FaMicrochip,
  FaBug,
  FaHeartbeat,
  FaSyringe,
  FaNeuter,
} from "react-icons/fa";

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
    microchip: boolean;
    wormed: boolean;
    heartwormTreated: boolean;
    vaccinated: boolean;
    deSexed: boolean;
  };
  petAdoptionFee: string;
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
  petAdoptionFee,
}: PetAdditionalInfoProps) => {
  return (
    <div className="flex flex-col gap-2 w-1/2 bg-white rounded p-12">
      <p className="text-primary font-bold text-xl uppercase mb-3">
        {petName}'s' Stats
      </p>
      <div className="border border-gray-200"></div>
      <div className="flex flex-col gap-4 p-4 w-full">
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Age:</span> {petAge}
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Color:</span> {petColor}
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Gender:</span>{" "}
          <span className="capitalize">{petGender.toLowerCase()}</span>
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Breed:</span> {petBreed}
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Activity needs:</span>{" "}
          <span className="capitalize">{petActivityNeeds.toLowerCase()}</span>
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">Level Of Grooming:</span>{" "}
          <span className="capitalize">{petLevelOfGrooming.toLowerCase()}</span>
        </p>
        <p className="text-lg text-gray-500">
          <span className="text-secondary font-bold">House trained:</span>{" "}
          {petIsHouseTrained ? "Yes" : "No"}
        </p>
      </div>
      <p className="text-primary font-bold text-xl uppercase">Health Info</p>
      <div className="border border-gray-200"></div>
      <div className="flex flex-wrap md:flex-row w-full gap-4 mt-4 items-center justify-center">
        {[
          {
            name: "Health Check",
            icon: FaStethoscope,
            value: petHealthInfo.healthCheck,
          },
          {
            name: "Microchip",
            icon: FaMicrochip,
            value: petHealthInfo.microchip,
          },
          { name: "Wormed", icon: FaBug, value: petHealthInfo.wormed },
          {
            name: "Heartworm Treated",
            icon: FaHeartbeat,
            value: petHealthInfo.heartwormTreated,
          },
          {
            name: "Vaccinated",
            icon: FaSyringe,
            value: petHealthInfo.vaccinated,
          },
          {
            name: "Desexed",
            icon: FaNeuter,
            value: petHealthInfo.deSexed,
          },
        ].map(({ name, icon: Icon, value }) => (
          <div
            key={name}
            className="w-full md:w-1/4 flex flex-col items-center gap-2"
          >
            <div className="bg-secondary-50 rounded-full p-3 relative">
              <Icon className="text-primary text-3xl" />
              {value && (
                <FaCheckCircle className="text-green-500 text-xl absolute top-0 left-0" />
              )}
            </div>
            <p className="text-md text-gray-500 text-center">{name}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 w-full mt-6">
        <p className="text-lg text-gray-500">
          <span className="text-primary font-bold">Adoption Fee:</span>{" "}
          {petAdoptionFee}
        </p>
        <div className="flex items-center justify-center">
          <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary">
            Apply for adoption
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetAdditionalInfo;
