import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
