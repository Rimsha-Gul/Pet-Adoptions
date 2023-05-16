import Header from "../components/Header";
import SignuppForm from "../components/SignupForm";

function Signup() {
  return (
    <>
      <Header
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/"
      />
      <SignuppForm />
    </>
  );
}

export default Signup;
