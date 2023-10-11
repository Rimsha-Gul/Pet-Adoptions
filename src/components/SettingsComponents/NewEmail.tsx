import { useContext, useState } from "react";
import loadingIcon from "../../assets/loading.gif";
import api from "../../api";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const NewEmailForm = () => {
  const [userNewEmail, setuserNewEmail] = useState<string>("");
  const appContext = useContext(AppContext);
  appContext.setNewEmail?.(userNewEmail);
  appContext.setVerificationOperation?.("changedEmail");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationCodeError, setVerificationCodeError] =
    useState<string>("");

  const handleEmailChange = async (e: any) => {
    setVerificationCodeError("");
    e.preventDefault();
    checkEmail();
  };

  const checkEmail = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await api.get("/auth/email/availability", {
        params: {
          email: appContext.newEmail,
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        navigate("/verifyemail");
      }
    } catch (error: any) {
      setVerificationCodeError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={handleEmailChange}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <div className="w-full">
              <label>
                New Email:
                <input
                  name="email"
                  type="email"
                  value={userNewEmail}
                  onChange={(e) => setuserNewEmail(e.target.value)}
                  required
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              </label>
            </div>
            <button
              data-cy="verify-new-email-button"
              className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ${
                isLoading ? "bg-primary text-white cursor-not-allowed" : ""
              } `}
              type="submit"
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Verify New Email
            </button>
          </div>
          {verificationCodeError && (
            <p className="flex items-center justify-center mt-4 text-sm text-red-500">
              {verificationCodeError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewEmailForm;
