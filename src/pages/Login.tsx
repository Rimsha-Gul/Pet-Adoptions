import { useEffect } from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function Login() {
  useEffect(() => {
    console.log("useEffect called");
  }, []);
  return (
    <>
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <LoginForm />
    </>
  );
}

export default Login;
