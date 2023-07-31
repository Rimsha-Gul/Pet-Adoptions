import { useEffect, useState } from "react";
import { User } from "../types/interfaces";
import api from "../api";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { validateField } from "../utils/formValidation";
import { FieldsState } from "../types/common";
import { reviewFields } from "../constants/formFields";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const fields = reviewFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const ShelterProfile = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reviewState, setReviewState] = useState<FieldsState>(fieldsState);
  const [errors, setErrors] = useState({
    rating: "Rating is required",
    review: "Review is required",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const reviewData = {
    shelterID: id,
    rating: reviewState.rating,
    reviewText: reviewState.review,
  };
  const [shelter, setShelter] = useState<User>({
    profilePhoto: "",
    name: "",
    email: "",
    address: "",
    bio: "",
    canReview: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/shelter/", {
          params: {
            id: id,
          },
        });
        if (response.status === 200) {
          console.log(response.data);
          const shelterData = response.data;
          setShelter({
            profilePhoto: shelterData.profilePhoto || "",
            name: shelterData.name || "",
            email: shelterData.email,
            address: shelterData.address || "",
            bio: shelterData.bio || "",
            canReview: shelterData.canReview || false,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const handleReview = () => {
    console.log("Review");
    setShowModal(true);
  };

  const handleChange = (id: any, value: any) => {
    let newError = "";
    if (id === "review") {
      setReview(value);
      newError = validateField("review", value, reviewState);
    } else if (id === "rating") {
      setRating(value);
      newError = validateField("rating", value, reviewState);
    }
    setReviewState((prevReviewState) => ({
      ...prevReviewState,
      [id]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: newError,
    }));
  };

  useEffect(() => {
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );
    setIsFormValid(isAllFieldsValid);
  }, [errors]);

  const handleReviewSubmit = (event: any) => {
    console.log(reviewData);
    event.preventDefault();
    submitReview();
  };

  const submitReview = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/review/", reviewData);
      if (response.status === 200) {
        console.log(response.data);
        showSuccessAlert(response.data);
      }
    } catch (error: any) {
      showErrorAlert(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  let imageSrc;
  if (shelter.profilePhoto) {
    imageSrc = shelter.profilePhoto as string;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center">
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
        <div className="relative w-48 h-48 rounded-full mb-4">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Profile photo"
              className="w-48 h-48 object-cover rounded-full mb-4 text-sm border-4 border-secondary shadow-md"
            />
          ) : (
            <div className="w-48 h-48 rounded-full mb-4 bg-gray-200 flex items-center justify-center border-4 border-secondary shadow-md">
              <span className="text-gray-500 text-5xl font-medium">
                {shelter.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="text-lg text-gray-500 mb-20 bg-gray-100 rounded-full px-4 py-2">
          {shelter.email}
        </div>

        <div className="flex flex-col items-center justify-center w-full lg:w-3/4 xl:w-2/3 mb-8">
          <div className="flex w-full flex-col items-center mb-8 gap-4">
            <p className="text-2xl text-gray-700 font-bold whitespace-pre-line">
              {shelter.name}
            </p>
            <p className="w-2/3 text-xl text-gray-600 whitespace-pre-line text-justify">
              {shelter.bio}
            </p>
            {shelter.canReview && (
              <button
                className={`mt-8 group relative w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white bg-primary hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:ring-offset-2" ${
                  isLoading
                    ? `bg-primary text-white cursor-not-allowed items-center`
                    : ""
                }`}
                onClick={handleReview}
              >
                Write a Review
              </button>
            )}
          </div>
        </div>
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        Write a Review
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Your feedback helps us make our service better for
                          everyone. Please be honest and respectful.
                        </p>
                      </div>
                      {reviewFields.map((field) =>
                        field.name === "rating" ? (
                          <div className="mt-4">
                            <StarRatings
                              rating={rating}
                              starHoverColor="orange"
                              starRatedColor="orange"
                              changeRating={(newRating) =>
                                handleChange(field.name, newRating)
                              }
                              numberOfStars={5}
                              name="rating"
                              starDimension="40px"
                              starSpacing="15px"
                            />
                          </div>
                        ) : (
                          <div className="mt-4">
                            <textarea
                              className="p-2 border resize rounded-md w-full"
                              placeholder={field.placeholder}
                              value={review}
                              onChange={(e) =>
                                handleChange(field.name, e.target.value)
                              }
                              rows={3}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-10 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-primary text-base font-medium text-white hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                      isLoading
                        ? `bg-primary text-white cursor-not-allowed items-center`
                        : ""
                    } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isFormValid}
                    onClick={handleReviewSubmit}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-md px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterProfile;
