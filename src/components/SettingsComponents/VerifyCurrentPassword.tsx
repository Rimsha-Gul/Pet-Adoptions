import loadingIcon from "../../assets/loading.gif";

interface PasswordComponentProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  userCurrentPassword: string;
  setUserCurrentPassword: (value: string) => void;
  verificationCodeError: string;
}

// compoennt to validate user's identity by requiring him to enter his current password
const VerifyCurrentPassword = ({
  onSubmit,
  isLoading,
  showPassword,
  togglePasswordVisibility,
  userCurrentPassword,
  setUserCurrentPassword,
  verificationCodeError,
}: PasswordComponentProps) => {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md p-12">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 mt-2 items-center justify-center">
            <div className="w-full mb-2">
              <p className="flex items-center justify-center mb-8 text-center text-lg font-bold text-gray-700">
                To continue, first verify it's you
              </p>
              <label>
                Current Password:
                <input
                  type={showPassword ? "text" : "password"}
                  value={userCurrentPassword}
                  onChange={(e) => setUserCurrentPassword(e.target.value)}
                  required
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              </label>
              <label className="flex items-center mt-2 ml-2">
                <input
                  type="checkbox"
                  className="mr-2 w-3 h-3"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <span className="text-xs text-gray-600">Show password</span>
              </label>
            </div>
            <button
              className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ${
                isLoading ? "bg-primary text-white cursor-not-allowed" : ""
              } `}
              type="submit"
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Verify Current Password
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

export default VerifyCurrentPassword;
