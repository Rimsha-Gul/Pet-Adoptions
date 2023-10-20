import LoginForm from '../components/AuthComponents/LoginForm'
import LogoSection from '../components/AuthComponents/LogoSection'

function Login() {
  return (
    <div className="sm:bg-radial-gradient min-h-screen flex flex-col justify-center items-center p-8 sm:p-16 lg:px-18 xl:px-32 2xl:px-72">
      <div className="grid md:grid-cols-2 w-full">
        <LogoSection
          paragraph="Don't have an account yet?"
          linkName="Signup"
          linkUrl="/signup"
        />
        <div className="bg-white rounded-lg shadow-md px-6 sm:px-12 pb-6 sm:pb-12 md:py-12 md:px-4 md:rounded-l-none">
          <h2 className="mt-6 text-center text-xl sm:text-3xl font-extrabold text-gray-700">
            Login to your account
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login
