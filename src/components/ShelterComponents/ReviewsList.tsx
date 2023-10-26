import StarRatings from 'react-star-ratings'
import loadingIcon from '../../assets/loading.gif'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Review, Shelter } from '../../types/interfaces'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { FiMoreVertical } from 'react-icons/fi'
import { reviewFields } from '../../constants/formFields'
import { validateField } from '../../utils/formValidation'
import { FieldsState } from '../../types/common'
import api from '../../api'
import { showErrorAlert, showSuccessAlert } from '../../utils/alert'
import { useParams } from 'react-router-dom'
import ReviewModal from './ReviewModel'

interface ReviewListProps {
  reviews: Review[]
  shelter: Shelter
  loadMoreData: () => void
  currentPage: number
  totalPages: number
  isMoreLoading: boolean
}

const fields = reviewFields
const fieldsState: FieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ''))

const ReviewList = ({
  reviews,
  shelter,
  loadMoreData,
  currentPage,
  totalPages,
  isMoreLoading
}: ReviewListProps) => {
  const { shelterID } = useParams()
  const appContext = useContext(AppContext)
  const userEmail = appContext.userEmail
  const [, setShelter] = useState<Shelter | null>(shelter)
  const [showReviewOption, setShowReviewOption] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useState({
    rating: '',
    review: ''
  })

  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const editReviewRef = useRef<HTMLDivElement>(null)
  const [reviewState, setReviewState] = useState<FieldsState>(fieldsState)
  const reviewData = {
    rating: Number(reviewState.rating),
    reviewText: reviewState.review
  }

  // Handler for clicking outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editReviewRef.current &&
        !editReviewRef.current.contains(event.target as Node)
      ) {
        setShowReviewOption(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleShowEditClick = () => {
    setShowReviewOption(!showReviewOption)
  }

  const handleEditClick = (review: Review) => {
    setShowReviewOption(false)
    setReviewState({
      rating: review.rating.toString(),
      review: review.reviewText
    })
    setReview(review.reviewText)
    setRating(review.rating)
    setShowEditModal(true)
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

  const handleUpdateReview = (e: FormEvent) => {
    e.preventDefault()
    updateReview()
  }

  const updateReview = async () => {
    try {
      setIsLoading(true)
      const response = await api.put(`/reviews/${shelterID}`, reviewData)
      if (response.status === 200) {
        setShowEditModal(false)
        showSuccessAlert(response.data.message, undefined, () =>
          setShelter(null)
        )
      }
    } catch (error: any) {
      if (error.response.status === 404) showErrorAlert(error.response.data)
    } finally {
      setIsLoading(false)
    }
  }

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
          {shelter.rating.toFixed(1)} ({shelter.numberOfReviews}{' '}
          {shelter.numberOfReviews > 1 ? ' reviews' : ' review'})
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
                <h3 data-cy="applicant-name" className="text-xl font-semibold">
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
                              handleEditClick(review)
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
              <p data-cy="review-text" className="mt-2 text-justify">
                {review.reviewText}
              </p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {showEditModal && (
        <ReviewModal
          showModal={showEditModal}
          rating={rating}
          review={review}
          handleChange={handleChange}
          handleReviewSubmit={handleUpdateReview}
          isLoading={isLoading}
          isFormValid={isFormValid}
          setShowModal={setShowEditModal}
        />
      )}
    </div>
  )
}

export default ReviewList
