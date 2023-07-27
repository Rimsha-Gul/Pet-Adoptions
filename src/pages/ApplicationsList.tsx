import { useCallback, useContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { getStatusIcon } from "../utils/getStatusIcon";
import loadingIcon from "../assets/loading.gif";
import { AppContext } from "../context/AppContext";
import { Application } from "../types/interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import { debounce } from "lodash";

const accessToken = localStorage.getItem("accessToken");
api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

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

const ViewApplications = () => {
  const appContext = useContext(AppContext);
  const userRole = appContext.userRole;
  const navigate = useNavigate();
  const [applicationsLoadingError, setApplicationsLoadingError] =
    useState<string>("");

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [noApplications, setNoApplications] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [applicationStatuses, setApplicationStatuses] = useState<string[]>([]);
  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState<string>("");

  useEffect(() => {
    //console.log("Updated applications:", applications);
  }, [applications]);

  // Function to debounce the setting of the search query
  const debouncedSetSearchQuery = useCallback(
    debounce((query) => setDebouncedSearchQuery(query), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [debouncedSearchQuery, applicationStatusFilter]);

  const fetchApplications = async (apiPage: number) => {
    try {
      console.log("fetch applications");
      let page = apiPage;
      console.log(page);

      setApplicationsLoadingError("");

      setIsLoading(true);
      const response = await api.get("/application/applications", {
        params: {
          page: 1,
          limit: 5,
          searchQuery,
          applicationStatusFilter,
        },
      });

      //console.log(response.data);
      //console.log(response.data.applications.length === 0);
      const { applications, totalPages, applicationStatuses } = response.data;
      setNoApplications(false);
      if (totalPages === 0) setNoApplications(true);
      setApplications(applications);
      setTotalPages(totalPages);
      setApplicationStatuses(applicationStatuses);
      setCurrentPage(1);
      //console.log(totalPages);
    } catch (error: any) {
      console.error(error);
      setApplicationsLoadingError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    //console.log("Load more applications");
    //console.log("currentPage", currentPage);
    if (currentPage < totalPages) {
      try {
        setIsMoreLoading(true);
        const nextPage = currentPage + 1;
        //console.log("nextPage", nextPage);

        // Fetch the next page of data
        const response = await api.get("/application/applications", {
          params: {
            page: nextPage,
            limit: 5,
            searchQuery,
            applicationStatusFilter,
          },
        });
        //console.log(response.data);
        const {
          applications: newApplicatiions,
          totalPages,
          applicationStatuses,
        } = response.data;

        // Append the new pets to the existing pets
        setApplications((prevApps) => [...prevApps, ...newApplicatiions]);
        setCurrentPage(nextPage);
        setTotalPages(totalPages);
        setApplicationStatuses(applicationStatuses);
        //console.log("Updated applications:", applications);
      } catch (error: any) {
        console.error(error.response.status);
        setApplicationsLoadingError(error.response.data);
      } finally {
        setIsMoreLoading(false);
      }
    }
  };

  const applicationStatusOptions = applicationStatuses.map((name) => ({
    value: name,
    label: name,
  }));

  applicationStatusOptions.unshift({ value: "", label: "All" });
  console.log("noApplications", noApplications);
  return (
    <>
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <h2 className="mt-12 text-center text-4xl font-extrabold text-primary mb-12">
          Your Applications
        </h2>
        <div className="flex flex-wrap md:flex-row gap-6 mt-6 mb-6 justify-end ">
          <div className="flex items-center justify-between w-72 h-[3.3rem] pr-4 mt-7 border border-gray-400 rounded-md focus-within:outline-none focus-within:ring-primary focus-within:border-primary hover:border-primary">
            <input
              type="text"
              placeholder={
                userRole === "USER"
                  ? "Type pet's or shelter's name..."
                  : "Type pet's or applicant's name..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full focus:outline-none rounded-md"
            />
            <FaSearch className="text-gray-500 hover:cursor-pointer" />
          </div>

          <div className="flex flex-wrap md:flex-row gap-6 justify-end ">
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Application Status</p>
              <Select
                className="w-64"
                options={applicationStatusOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setApplicationStatusFilter(selectedOption?.value || "")
                }
                value={applicationStatusOptions.find(
                  (option) => option.value === applicationStatusFilter
                )}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center mt-8 mb-8">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        )}
        {applicationsLoadingError && <p>{applicationsLoadingError}</p>}
        {!applicationsLoadingError && (
          <>
            {noApplications && !isLoading ? (
              <p className="text-gray-700 text-xl font-medium text-center">
                No applications found
              </p>
            ) : (
              applications &&
              !isLoading && (
                <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12 mt-8">
                  <div className="flex flex-col justify-center gap-4">
                    <div className="flex flex-row justify-between px-4">
                      <div className="w-full grid grid-cols-4 items-center justify-evenly gap-4">
                        <h2 className="text-2xl text-gray-700 font-bold">
                          Application for
                        </h2>
                        <h2 className="text-2xl text-gray-700 font-bold">
                          Status
                        </h2>
                        {userRole === "SHELTER" ? (
                          <h2 className="text-2xl text-gray-700 font-bold">
                            Applicant
                          </h2>
                        ) : (
                          <h2 className="text-2xl text-gray-700 font-bold">
                            Shelter Name
                          </h2>
                        )}
                        <h2 className="text-2xl text-gray-700 font-bold">
                          Submitted on
                        </h2>
                      </div>
                    </div>
                    <div className="border-b-2 border-gray-200"></div>
                    <InfiniteScroll
                      dataLength={applications.length}
                      next={loadMoreData}
                      hasMore={currentPage < totalPages}
                      loader={
                        isMoreLoading && (
                          <div
                            className="flex items-center justify-center"
                            key={0}
                          >
                            <img
                              src={loadingIcon}
                              alt="Loading"
                              className="mt-2 h-10 w-10"
                            />
                          </div>
                        )
                      }
                      className="overflow-hidden p-2"
                    >
                      <div>
                        {applications.map((application, index) => (
                          <div
                            key={index}
                            className="flex flex-row hover:bg-gray-100 shadow-md p-4 flex flex-col justify-center items-center hover:cursor-pointer hover:shadow-primary transform transition-all duration-300 hover:scale-[1.01] rounded-lg"
                            onClick={() =>
                              navigate(`/view/application/${application.id}`, {
                                state: { application },
                              })
                            }
                          >
                            <div className="w-full grid grid-cols-4 items-center justify-evenly gap-4">
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
                                <img
                                  src={application.petImage}
                                  alt="Pet Image"
                                  className="h-20 w-20 object-cover rounded-lg"
                                />
                                <p className="text-xl text-gray-600 whitespace-pre-line">
                                  {application.petName}
                                </p>
                              </div>
                              <div className="flex flex-row items-center gap-1">
                                {getStatusIcon(application.status)}
                                <p className="text-xl text-gray-600 whitespace-pre-line">
                                  {application.status}
                                </p>
                              </div>
                              {userRole === "SHELTER" ? (
                                <p className="text-xl text-gray-600 whitespace-pre-line">
                                  {application.applicantName}
                                </p>
                              ) : (
                                <p className="text-xl text-gray-600 whitespace-pre-line">
                                  {application.shelterName}
                                </p>
                              )}
                              <p className="text-xl text-gray-600 whitespace-pre-line">
                                {new Date(
                                  application.submissionDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="border-b-2 border-gray-200"></div>
                          </div>
                        ))}
                      </div>
                    </InfiniteScroll>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ViewApplications;
