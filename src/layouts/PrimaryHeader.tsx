import PrimaryLogo from "../icons/PrimaryLogo";

const PrimaryHeader = () => {
  return (
    <>
      <div className="flex items-center justify-between p-4 shadow-md">
        <PrimaryLogo />
        <button className="px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer">
          Logout
        </button>
      </div>
    </>
  );
};

export default PrimaryHeader;
