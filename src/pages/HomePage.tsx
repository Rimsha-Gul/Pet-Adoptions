import { useCallback, useContext, useEffect, useState } from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import loadingIcon from "../assets/loading.gif";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import PetCard from "../components/PetComponents/PetCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";

export interface Pet {
  shelterId: number;
  shelterName: string;
  microchipID: string;
  name: string;
  birthDate: string;
  color: string;
  bio: string;
  images: string[];
  applicationID?: string;
  gender: string;
  breed: string;
  activityNeeds: string;
  levelOfGrooming: string;
  isHouseTrained: string;
  healthInfo: {
    healthCheck: boolean;
    allergiesTreated: boolean;
    wormed: boolean;
    heartwormTreated: boolean;
    vaccinated: boolean;
    deSexed: boolean;
  };
  traits: string[];
  adoptionFee: string;
  hasAdoptionRequest: boolean;
  isAdopted: boolean;
  category: string;
}

const ageRange = (ages: number[]): string[] => {
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const rangeSize = Math.ceil((maxAge - minAge) / 5); // define the increment for age ranges

  const ageRanges = [];
  for (let i = minAge; i < maxAge; i += rangeSize) {
    const next = i + rangeSize;
    ageRanges.push(
      next < maxAge ? `${i}-${next} years` : `${i} years and above`
    );
  }

  return ageRanges;
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

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
  const [noPetsFound, setNoPetsFound] = useState<boolean>(false);

  if (!appContext.loggedIn) {
    //console.log(localStorage.getItem("userEmail"));
    //return <Navigate to={"/"} />;
  }

  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  //const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const response = await api.get("/session");

  //       if (response.status === 200) {
  //         appContext.setDisplayName?.(response.data.name);
  //         appContext.setUserEmail?.(response.data.email);
  //         appContext.setUserRole?.(response.data.role);
  //         appContext.setProfilePhoto?.(response.data.profilePhoto);
  //         //localStorage.setItem("userEmail", response.data.email);
  //         //localStorage.setItem("userName", response.data.name);
  //         //localStorage.setItem("userRole", response.data.role);
  //         console.log(response.data);
  //       }
  //     } catch (error: any) {
  //       // if (error.response.status === 401) {
  //       //   console.error(error.response.status);
  //       //   navigate("/");
  //       // }
  //     }
  //   };

  //   fetchSession();
  // }, []);

  useEffect(() => {
    // When category changes, reset all the filters
    if (prevFilterOption !== filterOption) {
      setColorFilter("");
      setAgeFilter("");
      setBreedFilter("");
      setGenderFilter("");
    }
  }, [filterOption]);

  // Function to debounce the setting of the search query
  const debouncedSetSearchQuery = useCallback(
    debounce((query) => setDebouncedSearchQuery(query), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);

  useEffect(() => {
    console.log("useEffect called");
    fetchPets(currentPage);
  }, [
    filterOption,
    debouncedSearchQuery,
    colorFilter,
    ageFilter,
    breedFilter,
    genderFilter,
  ]);

  const fetchPets = async (apiPage: number) => {
    try {
      let page = apiPage;
      console.log("In fetch pets");
      setPetsLoadingError("");
      setIsLoading(true);
      if (
        prevFilterOption !== filterOption ||
        prevSearchQuery !== searchQuery
      ) {
        page = 1;
        console.log("Current page: ", currentPage);
        setCurrentPage(1);
        console.log("api page: ", page);
        setPrevFilterOption(filterOption);
        setPrevSearchQuery(searchQuery);
      }
      const response = await api.get("/pet/all", {
        params: {
          page,
          limit: 6,
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
      appContext.setLoggedIn?.(true);
      const ageRanges = ageRange(ages);
      setNoPetsFound(false);
      if (totalPages === 0) setNoPetsFound(true);
      setPets(pets);
      setTotalPages(totalPages);
      setColors(colors);
      setAges(ageRanges);
      setBreeds(breeds);
      setGenders(genders);
      console.log("Total P: ", totalPages);
    } catch (error: any) {
      console.error(error);
      //appContext.setLoggedIn?.(false);
      // if (error.response.status === 401) {
      //   console.error(error.response.status);
      //   navigate("/");
      // }
      if (error.response.status === 500) {
        setPetsLoadingError("Failed to fetch pets");
      }
    } finally {
      setIsLoading(false);
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

  const loadMoreData = async () => {
    if (currentPage < totalPages) {
      try {
        setIsLoading(true);
        const nextPage = currentPage + 1;

        // Fetch the next page of data
        const response = await api.get("/pet/all", {
          params: {
            page: nextPage,
            limit: 6,
            searchQuery,
            filterOption,
            colorFilter,
            ageFilter,
            breedFilter,
            genderFilter,
          },
        });

        const {
          pets: newPets,
          totalPages,
          colors,
          ages,
          breeds,
          genders,
        } = response.data;

        // Append the new pets to the existing pets
        setPets((prevPets) => [...prevPets, ...newPets]);
        setCurrentPage(nextPage);
        setTotalPages(totalPages);
        setColors(colors);
        setAges(ages);
        setBreeds(breeds);
        setGenders(genders);
        console.log("Updated pets:", pets);
      } catch (error: any) {
        //console.error(error);
        // if (error.response.status === 401) {
        //   console.error(error.response.status);
        //   navigate("/");
        // }
        if (error.response.status === 500) {
          setPetsLoadingError("Failed to fetch pets");
        }
      } finally {
        setIsLoading(false);
      }
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
      <div className="flex flex-col justify-center p-8 sm:mt-14">
        <div className="flex flex-row gap-6 justify-end me-0 md:me-24 items-end pt-8">
          <div className="flex items-center justify-between w-72 h-[3.3rem] pr-4 border border-gray-400 rounded-md focus-within:outline-none focus-within:ring-primary focus-within:border-primary hover:border-primary">
            <input
              type="text"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full focus:outline-none rounded-md"
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
            {noPetsFound ? (
              <div className="flex items-center justify-center h-full">
                <p>No pets found with the selected criteria.</p>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={pets.length}
                next={loadMoreData}
                hasMore={currentPage < totalPages}
                loader={
                  <div className="flex items-center justify-center" key={0}>
                    <img
                      src={loadingIcon}
                      alt="Loading"
                      className="h-10 w-10"
                    />
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-16 m-0 md:m-12">
                  {pets.map((pet) => (
                    <PetCard key={pet.microchipID} pet={pet} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default HomePage;
