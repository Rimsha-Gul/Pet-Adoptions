import {
  FaCheckCircle,
  FaStethoscope,
  FaMicrochip,
  FaBug,
  FaHeartbeat,
  FaSyringe,
  FaNeuter,
} from "react-icons/fa";

interface petHealthInfoProps {
  petHealthInfo: {
    healthCheck: boolean;
    microchip: boolean;
    wormed: boolean;
    heartwormTreated: boolean;
    vaccinated: boolean;
    deSexed: boolean;
  };
}

const PetHealthInfo = ({ petHealthInfo }: petHealthInfoProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 py-4 px-2">
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
          className="flex flex-col items-center gap-2 w-1/3 lg:w-1/4"
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
  );
};

export default PetHealthInfo;
