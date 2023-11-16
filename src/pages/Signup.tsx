import { useLocation } from 'react-router-dom'
import LogoSection from '../components/AuthComponents/LogoSection'
import SignupForm from '../components/AuthComponents/SignupForm'
import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

function Signup() {
  const location = useLocation()
  const initialEmail = location.state?.email
  const initialRole = location.state?.role
  const appContext = useContext(AppContext)

  useEffect(() => {
    appContext.setVerificationOperation?.('null')
    localStorage.setItem('verificationOperation', 'null')
    localStorage.setItem('remainingTime', '60')
    localStorage.setItem('isOTPSent', 'false')
  }, [])

  return (
    <div className="sm:bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-8 sm:p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection
          paragraph="Already have an account?"
          linkName="Login"
          linkUrl="/"
        />
        <div className="bg-white rounded-lg shadow-md px-6 sm:px-12 pb-12 md:py-12 md:px-4 md:rounded-l-none">
          <h2 className="mt-6 text-center text-xl sm:text-3xl font-extrabold text-gray-700">
            Signup to create an account
          </h2>
          <SignupForm initialEmail={initialEmail} initialRole={initialRole} />
        </div>
      </div>
    </div>
  )
}

export default Signup
