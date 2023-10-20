interface PetTraitsProps {
  petTraits: string[];
}

const PetTraits = ({ petTraits }: PetTraitsProps) => {
  return (
    <div className="w-full mx-auto max-w-9xl p-8">
      <div className="flex flex-col items-start md:ml-44">
        <div className="mt-2 flex flex-col gap-4">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-500 text-justify">
              If you're looking for a pet that is
            </p>
            <div className="max-w-3xl flex flex-wrap gap-2 mt-4">
              {petTraits.map((trait, index) => (
                <div key={index} className="bg-secondary-10 px-3 py-1 rounded">
                  <p
                    data-cy={`trait-${index}`}
                    className="text-lg text-primary"
                  >
                    {trait}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetTraits;
