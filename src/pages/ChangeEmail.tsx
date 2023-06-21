import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ChangeEmail = () => {
  const [userNewEmail, setuserNewEmail] = useState("");
  const appContext = useContext(AppContext);
  appContext.setNewEmail?.(userNewEmail);
  appContext.setVerificationOperation?.("changedEmail");
  const navigate = useNavigate();

  const handleEmailChange = async (e: any) => {
    e.preventDefault();
    navigate("/verifyemail");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={handleEmailChange}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <label>
              New Email:
              <input
                type="email"
                value={userNewEmail}
                onChange={(e) => setuserNewEmail(e.target.value)}
                required
                className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
              />
            </label>
            <button
              className="flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer "
              type="submit"
            >
              Verify New Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmail;
