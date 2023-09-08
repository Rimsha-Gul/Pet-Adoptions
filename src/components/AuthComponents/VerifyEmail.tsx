import loadingIcon from "../../assets/loading.gif";

interface EmailVerificationFormProps {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  isLoading: boolean;
  handleClick: () => void;
  timer: number;
  isResending: boolean;
  handleResendClick: () => void;
  resendDisabled: boolean;
  verificationCodeError: string;
  isCodeValid: boolean;
  customClassName: string;
}

const EmailVerificationForm = ({
  verificationCode,
  setVerificationCode,
  isLoading,
  handleClick,
  timer,
  isResending,
  handleResendClick,
  resendDisabled,
  verificationCodeError,
  isCodeValid,
  customClassName,
}: EmailVerificationFormProps) => {
  return (
    <div
      className={` ${customClassName} rounded-lg shadow-md md:rounded-l-none flex flex-col items-center justify-center`}
    >
      <h1 className="mt-6 sm:mt-0 text-xl sm:text-3xl text-primary font-bold mb-4">
        Verify Your Email Account
      </h1>
      <p className="text-md sm:text-lg mb-8">
        Please enter the 6-digit code sent to your email.
      </p>
      <div className="flex flex-row mt-2 items-center justify-center">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          pattern="\d{6}"
          maxLength={6}
          required
          className="w-1/2 px-4 py-2 border border-primary focus:border-primary rounded mb-4"
        />
      </div>
      <div className="flex flex-row gap-4 mt-2 items-center justify-center">
        <button
          data-cy="verify-button"
          className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer ${
            !isCodeValid ? "opacity-50 cursor-not-allowed" : ""
          } ${
            isLoading
              ? "bg-primary text-white opacity-50 cursor-not-allowed"
              : ""
          } `}
          onClick={handleClick}
          disabled={!isCodeValid}
        >
          {isLoading && (
            <img
              data-cy="loadingIcon"
              src={loadingIcon}
              alt="Loading"
              className="mr-2 h-4 w-4"
            />
          )}
          Verify
        </button>
        <div>
          {timer === 0 ? (
            <button
              data-cy="resend-button"
              className={`flex items-center justify-center px-4 py-2 border border-primary hover:bg-primary text-primary hover:text-white rounded cursor-pointer 
        ${
          isResending
            ? "bg-primary text-white opacity-50 cursor-not-allowed"
            : ""
        } `}
              onClick={handleResendClick}
              disabled={resendDisabled}
            >
              {isResending && (
                <img
                  data-cy="loadingIcon"
                  src={loadingIcon}
                  alt="Loading"
                  className="mr-2 h-4 w-4"
                />
              )}
              Resend Code
            </button>
          ) : (
            <div data-cy="timer">Code will expire in {timer} seconds</div>
          )}
        </div>
      </div>
      {verificationCodeError && (
        <p
          data-cy="error-message"
          className="flex items-center justify-center mt-4 text-sm text-red-500"
        >
          {verificationCodeError}
        </p>
      )}
    </div>
  );
};

export default EmailVerificationForm;
