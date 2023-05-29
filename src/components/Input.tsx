import { ChangeEventHandler, useState } from "react";

interface InputProps {
  handleChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  placeholder: string;
  customClass: string;
  validationError?: string;
}

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm";

const Input = ({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  validationError,
}: InputProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputType = showPassword ? "text" : type;

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className="my-5">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      <div className="relative">
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          id={id}
          name={name}
          type={inputType}
          required={isRequired}
          className={`${fixedInputClass} ${customClass} ${
            validationError && isTouched ? "border-red-500" : ""
          }`}
          placeholder={placeholder}
        />

        {type === "password" && (
          <label className="flex items-center mt-2 ml-2">
            <input
              type="checkbox"
              className="mr-2 w-3 h-3"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <span className="text-xs text-gray-600">Show password</span>
          </label>
        )}
      </div>

      {validationError && isTouched && (
        <p className="text-red-500 text-xs mt-1">{validationError}</p>
      )}
    </div>
  );
};

export default Input;
