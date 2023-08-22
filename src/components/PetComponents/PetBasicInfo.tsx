interface PetBasicInfoProps {
  petBio: string;
}
const PetBasicInfo = ({ petBio }: PetBasicInfoProps) => {
  return (
    <div className="w-full mx-auto max-w-9xl p-4 sm:p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="mt-2 md:ml-44 flex flex-col gap-4">
          <div className="max-w-4xl">
            <p className="text-md sm:text-lg text-gray-500 text-justify whitespace-pre-line">
              {petBio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBasicInfo;
