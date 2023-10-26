import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { errorMessages } from '../constants/errorMessages'
import { showSuccessAlert } from '../utils/alert'
import Loading from './Loading'
import LogoSection from '../components/AuthComponents/LogoSection'
import EmailVerificationForm from '../components/AuthComponents/VerifyEmail'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState<string>('')
  const appContext = useContext(AppContext)
  const userEmail = localStorage.getItem('userEmail')
  const remainingTimeStr = localStorage.getItem('remainingTime')

  const [timer, setTimer] = useState<number>(
    remainingTimeStr ? parseInt(remainingTimeStr, 10) : 0
  )
  const [resendDisabled, setResendDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isResending, setIsResending] = useState<boolean>(false)
  const [verificationCodeError, setVerificationCodeError] = useState<string>('')
  const [showBlankScreen, setShowBlankScreen] = useState(false)
  const [emailForVerification] = useState<string | null>(userEmail)

  const accessToken = localStorage.getItem('accessToken')
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

  const sendCodeData = {
    email: emailForVerification
  }

  useEffect(() => {
    const sendVerificationCode = async () => {
      const isOTPSent = localStorage.getItem('isOTPSent')
      // Check if usermail is not null
      if (emailForVerification) {
        if (!isOTPSent) {
          try {
            if (appContext.verificationOperation === 'changedEmail') {
              await api.post('/auth/verificationCode', {
                email: appContext.newEmail,
                emailChangeRequest: 'newEmailStep'
              })
            } else if (appContext.verificationOperation === 'changeEmail') {
              await api.post('/auth/verificationCode', {
                email: emailForVerification,
                emailChangeRequest: 'currentEmailStep'
              })
            } else {
              await api.post('/auth/verificationCode', sendCodeData)
            }
            localStorage.setItem('isOTPSent', 'true')

            // Initialize timer if a previous timer exists in session storage
            const remainingTimeStr = localStorage.getItem('remainingTime')
            if (remainingTimeStr) {
              const remainingTime = parseInt(remainingTimeStr, 10)
              setTimer(remainingTime)
            } else {
              setTimer(60)
            }
          } catch (error: any) {
            if (error.response.status === 404) {
              navigate('/pagenotfound', {
                state: errorMessages.pageNotFound
              })
            } else if (error.response.status === 422) {
              // user is already verified
              navigate('/homepage')
            } else if (error.response.status === 500) {
              navigate('/pagenotfound', {
                state: errorMessages.emailSendingError
              })
            }
          }
        }
      } else {
        navigate('/pagenotfound')
      }
    }

    sendVerificationCode()
    // Initialize timer if a previous timer exists in session storage
    const remainingTimeStr = localStorage.getItem('remainingTime')
    if (remainingTimeStr) {
      const remainingTime = parseInt(remainingTimeStr, 10)
      setTimer(remainingTime)
    } else {
      setTimer(60)
    }
  }, [emailForVerification])

  // Retrieving the remaining time when the component mounts
  useEffect(() => {
    const remainingTimeStr = localStorage.getItem?.('remainingTime')
    if (remainingTimeStr) {
      const remainingTime = parseInt(remainingTimeStr, 10)
      setTimer(remainingTime)
    }
  }, [])

  const handleClick = async () => {
    // VerifyEmail API integration
    const verificationData = {
      email: emailForVerification,
      verificationCode: verificationCode
    }
    try {
      setIsLoading(true)
      const response = await api.post(
        '/auth/email/verification',
        verificationData
      )

      if (response.status === 200) {
        appContext.setLoggedIn?.(true)
        const { tokens } = response.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        if (appContext.verificationOperation === 'changeEmail') {
          appContext.setIsEmailVerified?.(true)
          navigate('/changeEmail')
        } else if (appContext.verificationOperation === 'changedEmail') {
          const accessToken = localStorage.getItem('accessToken')

          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          const response = await api.put('/auth/email', {
            email: appContext.newEmail
          })
          const { tokens } = response.data
          appContext.setUserEmail?.(appContext.newEmail)
          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
          setShowBlankScreen(true)
          // show success alert
          showSuccessAlert(response.data.message, undefined, () =>
            navigate('/userProfile')
          )
        } else {
          navigate('/homepage')
        }
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        navigate('/pagenotfound', {
          state: errorMessages.pageNotFound
        })
      } else if (error.response.status === 401) {
        setVerificationCodeError(
          'Verification code expired. Please request a new code.'
        )
      } else if (error.response.status === 400) {
        setVerificationCodeError('Incorrect verification code')
      } else if (error.response.status === 409) {
        setVerificationCodeError(error.response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendClick = async () => {
    // Resend code api integration
    const resendCodeData = {
      email: appContext.userEmail
    }
    setVerificationCodeError('')
    try {
      setIsResending(true)
      let response
      if (appContext.verificationOperation === 'changedEmail') {
        response = await api.post('/auth/verificationCode', {
          email: appContext.newEmail,
          emailChangeRequest: true
        })
      } else {
        response = await api.post('/auth/verificationCode', resendCodeData)
      }

      if (response.status === 200) {
        setTimer(60) // After a successful response, start the timer for 60 seconds
        setResendDisabled(true)
      }
    } catch (error: any) {
      if (error.response.status === 422) {
        // user is already verified
        navigate('/homepage')
      } else if (error.response.status === 404) {
        navigate('/pagenotfound', {
          state: errorMessages.pageNotFound
        })
      }
    } finally {
      setIsResending(false)
    }
  }

  // Implement the countdown timer logic using useEffect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1)
      }, 1000)
      localStorage.setItem('remainingTime', timer.toString())

      return () => clearTimeout(countdown)
    } else {
      setResendDisabled(false) // Enable the resend button when timer reaches zero
    }
  }, [timer])

  const isCodeValid = verificationCode.length === 6

  return showBlankScreen ? (
    <Loading />
  ) : appContext.verificationOperation !== 'changeEmail' &&
    appContext.verificationOperation !== 'changedEmail' ? (
    <div className="sm:bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-8 sm:p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection />
        <EmailVerificationForm
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isLoading={isLoading}
          handleClick={handleClick}
          timer={timer}
          isResending={isResending}
          handleResendClick={handleResendClick}
          resendDisabled={resendDisabled}
          verificationCodeError={verificationCodeError}
          isCodeValid={isCodeValid}
          customClassName="bg-white px-6 sm:px-12 pb-12 md:py-12 md:px-4 "
        />
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center">
      <EmailVerificationForm
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        handleClick={handleClick}
        timer={timer}
        isResending={isResending}
        handleResendClick={handleResendClick}
        resendDisabled={resendDisabled}
        verificationCodeError={verificationCodeError}
        isCodeValid={isCodeValid}
        customClassName="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 p-6 sm:p-12"
      />
    </div>
  )
}

export default VerifyEmail
