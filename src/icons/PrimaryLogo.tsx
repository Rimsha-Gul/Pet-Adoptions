import logo from "../assets/logo.svg";

const PrimaryLogo = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <img alt="" className="h-14 w-14" src={logo} />
      </div>
      <h1 className="font-pacifico text-6xl font-extrabold italic text-primary">
        Purrfect Adoptions
      </h1>
    </div>
  );
};

export default PrimaryLogo;
