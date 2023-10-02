import { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { validateField } from "../../utils/formValidation";
import { FieldsState } from "../../types/common";
import { reviewFields } from "../../constants/formFields";
import loadingIcon from "../../assets/loading.gif";

const fields = reviewFields;
let fieldsState: FieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const ReviewModal = ({
  show,
  onClose,
  onSubmit,
  isLoading,
}:Props) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [errors, setErrors] = useState({
    rating: "Rating is required",
    review: "Review is required",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [reviewState, setReviewState] = useState<FieldsState>(fieldsState);

  const reviewData = {
    rating,
    review,
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
    event.preventDefault();
    if (isFormValid) {
      onSubmit(reviewData);
    }
  };

  return (
    <>
      {show && (
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
                      ? `bg-primary opacity-70 text-white items-center`
                      : ""
                  } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isFormValid}
                  onClick={handleReviewSubmit}
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
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewModal;
