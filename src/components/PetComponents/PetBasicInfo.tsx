interface PetBasicInfoProps {
  petBio: string;
  petCategory: string;
  petTraits: string[];
}
const PetBasicInfo = ({
  petBio,
  petCategory,
  petTraits,
}: PetBasicInfoProps) => {
  return (
    <div className="p-8 w-full">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="mt-2 flex flex-col gap-4 p-4">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-500 text-justify whitespace-pre-line">
              {petBio}
            </p>
          </div>
          <div className="max-w-3xl mt-8">
            <p className="text-lg text-gray-500 text-justify">
              If you're looking for a {petCategory.toLowerCase()} that is
            </p>
            <div className="max-w-3xl flex flex-wrap gap-2 mt-4">
              {petTraits.map((trait, index) => (
                <div key={index} className="bg-secondary-10 px-3 py-1 rounded">
                  <p className="text-lg text-primary">{trait}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBasicInfo;
