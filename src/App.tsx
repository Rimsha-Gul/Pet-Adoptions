import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/PageNotFound";
// import PrimaryHeader from "./layouts/PrimaryHeader";

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center">
      <BrowserRouter>
        {/* <PrimaryHeader /> */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pagenotfound" element={<NotFoundPage />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/homepage" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
