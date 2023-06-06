import { useContext, useEffect, useState } from "react";
import api from "../api";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import loadingIcon from "../assets/loading.gif";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import PetCard from "../components/PetComponents/PetCard";

interface Pet {
  shelterId: number;
  name: string;
  age: string;
  color: string;
  bio: string;
  images: string[];
}

const ageToMonths = (age: string): number => {
  const parts = age.split(" ");

  let totalMonths = 0;
  for (let part of parts) {
    if (part.endsWith("yr")) {
      const years = parseInt(part.slice(0, -2));
      totalMonths += years * 12;
    } else if (part.endsWith("m")) {
      const months = parseInt(part.slice(0, -1));
      totalMonths += months;
    }
  }

  return totalMonths;
};

const ageRange = (ageInMonths: number): string => {
  if (ageInMonths <= 12) {
    return "Less than a year";
  } else if (ageInMonths <= 24) {
    return "1-2 years";
  } else if (ageInMonths <= 36) {
    return "2-3 years";
  } else if (ageInMonths <= 48) {
    return "3-4 years";
  } else {
    return "4+ years";
  }
};

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoadingError, setPetsLoadingError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");
  const [prevFilterOption, setPrevFilterOption] = useState<string>("");
  const [prevSearchQuery, setPrevSearchQuery] = useState<string>("");
  const [showExtraFilters, setShowExtraFilters] = useState<boolean>(false);
  const [colors, setColors] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string>("");
  const [ages, setAges] = useState<string[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [breedFilter, setBreedFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");

  const [isPrevButtonDisabled, setIsPrevButtonDisabled] =
    useState<boolean>(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);

  if (!localStorage.getItem("userEmail")) {
    console.log(localStorage.getItem("userEmail"));
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
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userName", response.data.name);
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
    // When category changes, reset all the filters
    if (prevFilterOption !== filterOption) {
      setColorFilter("");
      setAgeFilter("");
      setBreedFilter("");
      setGenderFilter("");
    }
  }, [filterOption]);

  useEffect(() => {
    fetchPets(currentPage);
  }, [
    currentPage,
    filterOption,
    searchQuery,
    colorFilter,
    ageFilter,
    breedFilter,
    genderFilter,
  ]);

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
          colorFilter,
          ageFilter,
          breedFilter,
          genderFilter,
        },
      });
      const { pets, totalPages, colors, ages, breeds, genders } = response.data;
      console.log(totalPages);
      console.log(colors);
      let ageRanges: string[] = Array.from(
        new Set(ages.map((age: string) => ageRange(ageToMonths(age))))
      );

      setPets(pets);
      setTotalPages(totalPages);
      setColors(colors);
      setAges(ageRanges);
      setBreeds(breeds);
      setGenders(genders);
      setIsPrevButtonDisabled(
        isLoading || currentPage === 1 || totalPages === 0
      );
      setIsNextButtonDisabled(
        isLoading || currentPage === totalPages || totalPages === 0
      );
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
      setShowExtraFilters(selectedOption.value !== "");
    } else {
      setFilterOption("");
      setShowExtraFilters(false);
    }
  };

  // Convert colors array to Select options
  const colorOptions = colors.map((color) => ({ value: color, label: color }));
  const ageOptions = ages.map((age) => ({ value: age, label: age }));
  const breedOptions = breeds.map((breed) => ({ value: breed, label: breed }));
  const genderOptions = genders.map((gender) => ({
    value: gender,
    label: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
  }));

  // Add 'All' option
  colorOptions.unshift({ value: "", label: "All" });
  ageOptions.unshift({ value: "", label: "All" });
  breedOptions.unshift({ value: "", label: "All" });
  genderOptions.unshift({ value: "", label: "All" });

  return (
    <>
      <div className="flex flex-col justify-center p-8 mt-4">
        <div className="flex flex-row gap-6 justify-end mt-16 me-0 md:me-24 items-end">
          <div className="flex items-center justify-between w-64 pr-4 border border-gray-400 rounded focus-within:outline-none focus-within:ring-primary focus-within:border-primary hover:border-primary">
            <input
              type="text"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full focus:outline-none"
            />
            <FaSearch className="text-gray-500 hover:cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-primary">Filter by category</p>
            <Select
              className="w-64"
              options={options}
              styles={customStyles}
              onChange={handleOptionChange}
              value={options.find((option) => option.value === filterOption)}
            />
          </div>
        </div>

        {showExtraFilters && (
          <div className="flex flex-wrap md:flex-row gap-6 mt-6 me-0 md:me-24 justify-end ">
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Color</p>
              <Select
                className="w-64"
                options={colorOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setColorFilter(selectedOption?.value || "")
                }
                value={colorOptions.find(
                  (option) => option.value === colorFilter
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Age</p>
              <Select
                className="w-64"
                options={ageOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setAgeFilter(selectedOption?.value || "")
                }
                value={ageOptions.find((option) => option.value === ageFilter)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Breed</p>
              <Select
                className="w-64"
                options={breedOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setBreedFilter(selectedOption?.value || "")
                }
                value={breedOptions.find(
                  (option) => option.value === breedFilter
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Gender</p>
              <Select
                className="w-64"
                options={genderOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setGenderFilter(selectedOption?.value || "")
                }
                value={genderOptions.find(
                  (option) => option.value === genderFilter
                )}
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        )}
        {petsLoadingError && <p>{petsLoadingError}</p>}
        {!petsLoadingError && (
          <>
            {pets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p>No pets found with the selected criteria.</p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-16 m-0 md:m-12 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                {pets.map((pet) => (
                  <PetCard key={pet.name} pet={pet} />
                ))}
              </div>
            )}
            {totalPages && (
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
            )}
          </>
        )}
      </div>
    </>
  );
};
export default HomePage;
