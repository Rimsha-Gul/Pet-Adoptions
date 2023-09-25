import StarRatings from "react-star-ratings";
import loadingIcon from "../../assets/loading.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import { Review, Shelter } from "../../types/interfaces";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FiMoreVertical } from "react-icons/fi";
import { reviewFields } from "../../constants/formFields";
import { validateField } from "../../utils/formValidation";
import { FieldsState } from "../../types/common";
import api from "../../api";
import { showErrorAlert, showSuccessAlert } from "../../utils/alert";
import { useParams } from "react-router-dom";

interface ReviewListProps {
  reviews: Review[];
  shelter: Shelter;
  loadMoreData: () => void;
  currentPage: number;
  totalPages: number;
  isMoreLoading: boolean;
}

const fields = reviewFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const ReviewList = ({
  reviews,
  shelter,
  loadMoreData,
  currentPage,
  totalPages,
  isMoreLoading,
}: ReviewListProps) => {
  const { id } = useParams();
  const appContext = useContext(AppContext);
  const userEmail = appContext.userEmail;
  const [, setShelter] = useState<Shelter | null>(shelter);
  const [showReviewOption, setShowReviewOption] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    rating: "",
    review: "",
  });

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const editReviewRef = useRef<HTMLDivElement>(null);
  const [reviewState, setReviewState] = useState<FieldsState>(fieldsState);
  const reviewData = {
    shelterID: id,
    rating: Number(reviewState.rating),
    reviewText: reviewState.review,
  };

  // Handler for clicking outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editReviewRef.current &&
        !editReviewRef.current.contains(event.target as Node)
      ) {
        setShowReviewOption(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowEditClick = () => {
    setShowReviewOption(!showReviewOption);
  };

  const handleEditClick = (review: Review) => {
    setShowReviewOption(false);
    setReviewState({
      rating: review.rating.toString(),
      review: review.reviewText,
    });
    setReview(review.reviewText);
    setRating(review.rating);
    setShowEditModal(true);
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

  const handleUpdateReview = (e: FormEvent) => {
    e.preventDefault();
    updateReview();
  };

  const updateReview = async () => {
    try {
      setIsLoading(true);
      const response = await api.put("/review/update", reviewData);
      if (response.status === 200) {
        setShowEditModal(false);
        console.log(response.data);
        showSuccessAlert(response.data.message, undefined, () =>
          setShelter(null)
        );
      }
    } catch (error: any) {
      showErrorAlert(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-3/4 xl:w-2/3 mb-8 px-8 sm:px-16">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="flex flex-row gap-4 mb-4">
        <StarRatings
          rating={shelter.rating}
          starDimension="20px"
          starSpacing="5px"
          starRatedColor="gold"
        />
        <p className="text-lg text-gray-600">
          {shelter.rating.toFixed(1)} ({shelter.numberOfReviews}{" "}
          {shelter.numberOfReviews > 1 ? " reviews" : " review"})
        </p>
      </div>
      <InfiniteScroll
        dataLength={reviews.length}
        next={loadMoreData}
        hasMore={currentPage < totalPages}
        loader={
          isMoreLoading && (
            <div className="flex items-center justify-center" key={0}>
              <img src={loadingIcon} alt="Loading" className="mt-2 h-10 w-10" />
            </div>
          )
        }
        className="overflow-hidden py-2"
      >
        <div
          data-cy="reviews-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {reviews.map((review) => (
            <div
              data-cy="review"
              key={review.applicantEmail}
              className="border rounded-lg p-4 mb-4 bg-secondary-10 shadow-lg rounded-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {review.applicantName}
                </h3>
                {review.applicantEmail === userEmail && (
                  <div className="relative" ref={editReviewRef}>
                    <button
                      data-cy="review-options"
                      onClick={handleShowEditClick}
                    >
                      <FiMoreVertical />
                    </button>
                    {showReviewOption && (
                      <div
                        ref={editReviewRef}
                        className="absolute right-4 -mt-6 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div
                          className="rounded-md bg-white shadow-xs divide-y"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <button
                            data-cy="edit-review"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => {
                              handleEditClick(review);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <StarRatings
                rating={review.rating}
                starDimension="20px"
                starSpacing="5px"
                starRatedColor="gold"
              />
              <p className="mt-2 text-justify">{review.reviewText}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {showEditModal && (
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
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
                            name="reviewText"
                            className="p-2 border resize rounded-md w-full"
                            placeholder={field.placeholder}
                            value={review}
                            onChange={(e) =>
                              handleChange(field.name, e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-secondary-10 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  data-cy="review-button"
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-primary text-base font-medium text-white hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    isLoading
                      ? `bg-primary opacity-70 text-white items-center`
                      : ""
                  } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isFormValid}
                  onClick={handleUpdateReview}
                >
                  {isLoading && (
                    <img
                      src={loadingIcon}
                      alt="Loading"
                      className="mr-2 h-4 w-4"
                    />
                  )}
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-md px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
