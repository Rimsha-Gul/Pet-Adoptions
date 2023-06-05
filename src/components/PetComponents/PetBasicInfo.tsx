interface PetBasicInfoProps {
  petBio: string;
}
const PetBasicInfo = ({ petBio }: PetBasicInfoProps) => {
  return (
    <div className="p-8 w-full max-w-9xl">
      <div className="flex flex-col items-center justify-center">
        <div className="mt-2 flex flex-col gap-4">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-500 text-justify whitespace-pre-line">
              {petBio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBasicInfo;
