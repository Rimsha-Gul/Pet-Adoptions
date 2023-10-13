import { useContext, useEffect, useState } from 'react'
import { Review, Shelter } from '../types/interfaces'
import api from '../api'
import { useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { validateField } from '../utils/formValidation'
import { FieldsState } from '../types/common'
import { reviewFields } from '../constants/formFields'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import loadingIcon from '../assets/loading.gif'
import { UserRole } from '../types/enums'
import { AppContext } from '../context/AppContext'
import ReviewList from '../components/ShelterComponents/ReviewsList'

const fields = reviewFields
const fieldsState: FieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ''))

const ShelterProfile = () => {
  const { shelterID } = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [reviewState, setReviewState] = useState<FieldsState>(fieldsState)
  const [errors, setErrors] = useState({
    rating: 'Rating is required',
    review: 'Review is required'
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const reviewData = {
    rating: reviewState.rating,
    reviewText: reviewState.review
  }
  const [shelter, setShelter] = useState<Shelter | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false)
  const appContext = useContext(AppContext)
  const userRole = appContext.userRole

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/shelters/${shelterID}`)

        console.log(response.data)
        //const shelterData = response.data;
        setShelter(response.data)
        const reviewsResponse = await api.get(`/reviews/${shelterID}`, {
          params: {
            page: 1,
            limit: 3
          }
        })
        console.log(reviewsResponse)
        const { reviews, totalPages } = reviewsResponse.data
        setReviews(reviews)
        setTotalPages(totalPages)
        setCurrentPage(1)
      } catch (error: any) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (shelterID && !shelter) fetchUserData()
  }, [shelterID, shelter])

  const loadMoreData = async () => {
    console.log('Load more reviews')
    //console.log("currentPage", currentPage);
    if (currentPage < totalPages) {
      try {
        setIsMoreLoading(true)
        const nextPage = currentPage + 1
        //console.log("nextPage", nextPage);

        // Fetch the next page of data
        const response = await api.get(`/reviews/${shelterID}`, {
          params: {
            page: nextPage,
            limit: 3
          }
        })
        //console.log(response.data);
        const { reviews: newReviews, totalPages } = response.data

        // Append the new reviews to the existing reviews
        setReviews((prevReviews) => [...prevReviews, ...newReviews])
        setCurrentPage(nextPage)
        setTotalPages(totalPages)
        console.log('Updated reviews:', reviews)
      } catch (error: any) {
        console.error(error.response.status)
      } finally {
        setIsMoreLoading(false)
      }
    }
  }

  const handleReview = () => {
    console.log('Review')
    setShowModal(true)
  }

  const handleChange = (id: any, value: any) => {
    let newError = ''
    if (id === 'review') {
      setReview(value)
      newError = validateField('review', value, reviewState)
    } else if (id === 'rating') {
      setRating(value)
      newError = validateField('rating', value, reviewState)
    }
    setReviewState((prevReviewState) => ({
      ...prevReviewState,
      [id]: value
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: newError
    }))
  }

  useEffect(() => {
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ''
    )
    setIsFormValid(isAllFieldsValid)
  }, [errors])

  const handleReviewSubmit = (event: any) => {
    console.log(reviewData)
    event.preventDefault()
    submitReview()
  }

  const submitReview = async () => {
    try {
      setIsLoading(true)
      const response = await api.post(`/reviews/${shelterID}`, reviewData)
      if (response.status === 200) {
        setShowModal(false)
        console.log(response.data)
        showSuccessAlert(response.data.message, undefined, () =>
          setShelter(null)
        )
      }
    } catch (error: any) {
      showErrorAlert(error.response.data)
    } finally {
      setIsLoading(false)
    }
  }

  let imageSrc
  if (shelter?.profilePhoto) {
    imageSrc = shelter.profilePhoto as string
  }

  return (
    <div className="bg-white mt-28 mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pb-8">
      {isLoading && (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      )}
      {shelter && (
        <div className="w-full flex flex-col items-center justify-center py-2">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-4">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile photo"
                className=" w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full mb-4 text-sm border-4 border-secondary shadow-md"
              />
            ) : (
              <div className=" w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-4 bg-gray-200 flex items-center justify-center border-4 border-secondary shadow-md">
                <span className="text-gray-500 text-5xl font-medium">
                  {shelter.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="text-lg text-gray-500 mb-4 bg-gray-100 rounded-full px-4 py-2">
            {shelter.email}
          </div>
          <div className="flex flex-col items-center justify-center w-full lg:w-3/4 xl:w-2/3 mb-8">
            <div className="flex w-full flex-col items-center mb-8 gap-4">
              <p className="text-2xl text-gray-700 font-bold whitespace-pre-line">
                {shelter.name}
              </p>
              {shelter.rating > 0 ? (
                <div className="flex flex-row gap-4">
                  <StarRatings
                    rating={shelter.rating}
                    starDimension="20px"
                    starSpacing="5px"
                    starRatedColor="gold"
                  />
                  <p className="text-lg text-gray-600">
                    {shelter.rating.toFixed(1)} ({shelter.numberOfReviews}{' '}
                    {shelter.numberOfReviews > 1 ? 'reviews' : 'review'})
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-600">No reviews yet</p>
              )}

              <p className="w-5/6 sm:w-2/3 text-md sm:text-xl text-gray-600 whitespace-pre-line text-justify">
                {shelter.bio}
              </p>
              {shelter.canReview && userRole === UserRole.User && (
                <button
                  data-cy="review-button"
                  className={`mt-8 group relative w-1/3 lg:w-1/5 2xl:w-1/6 flex justify-center py-2 px-4 border border-transparent text-md uppercase font-medium rounded-md text-white bg-primary hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:ring-offset-2" ${
                    isLoading
                      ? `bg-primary text-white cursor-not-allowed items-center`
                      : ''
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
                          field.name === 'rating' ? (
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
                      data-cy="submit-review-button"
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-primary text-base font-medium text-white hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        isLoading
                          ? `bg-primary opacity-70 text-white items-center`
                          : ''
                      } ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {reviews.length > 0 && (
            <ReviewList
              reviews={reviews}
              shelter={shelter}
              loadMoreData={loadMoreData}
              currentPage={currentPage}
              totalPages={totalPages}
              isMoreLoading={isMoreLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ShelterProfile
