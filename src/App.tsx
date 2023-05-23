import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import HomePage from "./pages/HomePage";
// import PrimaryHeader from "./layouts/PrimaryHeader";

function App() {
  return (
    <div className="min-h-full h-screen flex flex-col">
      <BrowserRouter>
        {/* <PrimaryHeader /> */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/homepage" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
