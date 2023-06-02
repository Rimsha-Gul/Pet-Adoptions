import { useContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate, Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import loadingIcon from "../assets/loading.gif";
import Select from "react-select";

interface Pet {
  shelterId: number;
  name: string;
  age: string;
  color: string;
  bio: string;
  images: string[];
}

const HomePage = () => {
  const options = [
    { value: "", label: "All" },
    { value: "CAT", label: "Cats" },
    { value: "DOG", label: "Dogs" },
    { value: "HORSE", label: "Horses" },
    { value: "RABBIT", label: "Rabbits" },
    { value: "SMALL_AND_FURRY", label: "Small & Furry" },
    { value: "SCALES_FINS_AND_OTHERS", label: "Scales, fins & others" },
    { value: "BARNYARD", label: "Barnyard" },
  ];
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #ff5363" : "1px solid #9ca3af",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      padding: "0.5rem",
      cursor: "pointer",
      "&:hover": {
        border: "1px solid #ff5363",
      },
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ff5363" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      padding: "0.5rem",
      "&:hover": {
        backgroundColor: "#fb7a75",
        color: "#fff",
        cursor: "pointer",
      },
    }),
  };
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoadingError, setPetsLoadingError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");
  const [prevFilterOption, setPrevFilterOption] = useState<string>("");
  const [prevSearchQuery, setPrevSearchQuery] = useState<string>("");

  const [isPrevButtonDisabled, setIsPrevButtonDisabled] =
    useState<boolean>(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);

  if (!appContext.userEmail) {
    console.log(appContext.userEmail);
    return <Navigate to={"/"} />;
  }

  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get("/session");
        appContext.setDisplayName?.(response.data.name);
        console.log(response.data);
        console.log(appContext.loggedIn);
        console.log(appContext.userEmail);
        console.log(appContext.displayName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    fetchPets(currentPage);
  }, [currentPage, filterOption, searchQuery]);

  const fetchPets = async (page: number) => {
    try {
      setIsLoading(true);
      if (
        prevFilterOption !== filterOption ||
        prevSearchQuery !== searchQuery
      ) {
        setCurrentPage(1);
        setPrevFilterOption(filterOption);
        setPrevSearchQuery(searchQuery);
      }
      const response = await api.get("/pet", {
        params: {
          page,
          limit: 3,
          searchQuery,
          filterOption,
        },
      });
      const { pets, totalPages } = response.data;
      console.log(pets);
      console.log(totalPages);

      setPets(pets);
      setTotalPages(totalPages);
      setIsPrevButtonDisabled(isLoading || currentPage === 1);
      setIsNextButtonDisabled(isLoading || currentPage === totalPages);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 500) {
        setPetsLoadingError("Failed to fetch pets");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOptionChange = (selectedOption: any) => {
    if (selectedOption) {
      setFilterOption(selectedOption.value);
    } else {
      setFilterOption("");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center p-8 mt-28">
        <div className="flex flex-row gap-6 justify-end mt-16 me-24">
          <input
            type="text"
            placeholder="Search pets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-primary focus:border-primary hover:border-primary"
          />

          <Select
            className="w-64"
            options={options}
            styles={customStyles}
            onChange={handleOptionChange}
          />
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        )}
        {petsLoadingError && <p>{petsLoadingError}</p>}
        {!petsLoadingError && (
          <>
            {" "}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-16 m-12 ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {pets.map((pet) => (
                <div
                  key={pet.name}
                  className="bg-gray-100 rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center hover:cursor-pointer hover:shadow-primary transform transition-all duration-300 hover:scale-105"
                  onClick={() =>
                    navigate(`/pet/${encodeURIComponent(pet.name)}`, {
                      state: { pet },
                    })
                  }
                >
                  <img
                    src={pet.images[0]}
                    alt="Pet Image"
                    className="w-full h-80 object-cover"
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
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={isPrevButtonDisabled}
                className={`px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded mr-2 ${
                  isPrevButtonDisabled ? "opacity-50" : ""
                }`}
              >
                Previous Page
              </button>
              <button
                onClick={handleNextPage}
                disabled={isNextButtonDisabled}
                className={`px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded ${
                  isNextButtonDisabled ? "opacity-50" : ""
                }`}
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default HomePage;
