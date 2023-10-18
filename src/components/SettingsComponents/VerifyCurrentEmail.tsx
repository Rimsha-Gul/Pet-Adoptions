import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const VerifyCurrentEmail = () => {
  const appContext = useContext(AppContext)

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/verifyemail')
  }

  useEffect(() => {
    appContext.setVerificationOperation?.('changeEmail')
  }, [])

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <div className="flex flex-col gap-4 mt-2 items-center justify-center">
          <p className="flex items-center justify-center mb-4 text-center text-lg font-bold text-gray-700">
            To protect your account security, we need to verify your identity
          </p>
          <button
            data-cy="verify-current-email-button"
            className="flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer "
            onClick={handleClick}
          >
            Verify Current Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyCurrentEmail
