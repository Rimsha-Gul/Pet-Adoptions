import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleAddPetClick = () => {
    navigate("/addpet");
  };
  return (
    <div className="flex justify-center p-8 mt-24 sm:mt-48">
      <button
        className="w-1/4 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary"
        onClick={handleAddPetClick}
      >
        Add a pet
      </button>
    </div>
  );
};

export default Dashboard;
