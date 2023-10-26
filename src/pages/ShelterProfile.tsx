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
import ReviewModal from '../components/ShelterComponents/ReviewModel'

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
        setShelter(response.data)
        const reviewsResponse = await api.get(`/reviews/${shelterID}`, {
          params: {
            page: 1,
            limit: 3
          }
        })
        const { reviews, totalPages } = reviewsResponse.data
        setReviews(reviews)
        setTotalPages(totalPages)
        setCurrentPage(1)
      } catch (error: any) {
        if (error.response.status === 404) showErrorAlert(error.response.data)
      } finally {
        setIsLoading(false)
      }
    }

    if (shelterID && !shelter) fetchUserData()
  }, [shelterID, shelter])

  const loadMoreData = async () => {
    if (currentPage < totalPages) {
      try {
        setIsMoreLoading(true)
        const nextPage = currentPage + 1

        // Fetch the next page of data
        const response = await api.get(`/reviews/${shelterID}`, {
          params: {
            page: nextPage,
            limit: 3
          }
        })
        const { reviews: newReviews, totalPages } = response.data

        // Append the new reviews to the existing reviews
        setReviews((prevReviews) => [...prevReviews, ...newReviews])
        setCurrentPage(nextPage)
        setTotalPages(totalPages)
      } catch (error: any) {
        if (error.response.status === 404) showErrorAlert(error.response.data)
      } finally {
        setIsMoreLoading(false)
      }
    }
  }

  const handleReview = () => {
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
    event.preventDefault()
    submitReview()
  }

  const submitReview = async () => {
    try {
      setIsLoading(true)
      const response = await api.post(`/reviews/${shelterID}`, reviewData)
      if (response.status === 200) {
        setShowModal(false)
        showSuccessAlert(response.data.message, undefined, () =>
          setShelter(null)
        )
      }
    } catch (error: any) {
      if (error.response.status === 400 || error.response.status === 404)
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
                  <p data-cy="shelter-rating" className="text-lg text-gray-600">
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
            <ReviewModal
              showModal={showModal}
              rating={rating}
              review={review}
              handleChange={handleChange}
              handleReviewSubmit={handleReviewSubmit}
              isLoading={isLoading}
              isFormValid={isFormValid}
              setShowModal={setShowModal}
            />
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
