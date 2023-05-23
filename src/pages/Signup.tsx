import { useEffect } from "react";
import Header from "../components/Header";
import SignuppForm from "../components/SignupForm";

function Signup() {
  useEffect(() => {
    console.log("useEffect called");
  }, []);
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
