import Header from "../components/Header";
import SignupForm from "../components/SignupForm";

function Signup() {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <Header
          heading="Signup to create an account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/"
        />
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;
