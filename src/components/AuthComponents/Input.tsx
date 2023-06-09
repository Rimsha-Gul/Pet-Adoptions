import { useState } from "react";
import Select from "react-select";

interface InputProps {
  handleChange: any;
  value: string;
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  placeholder?: string;
  customClass: string;
  validationError?: string;
  options?: Array<string | { label: string; value: string }>;
  showShelterID?: boolean;
}

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm";

const fixedRadioClass =
  "form-radio h-4 mr-2 w-4 text-secondary border-gray-300 focus:ring-primary hover:ring-primary";

const fixedSelectClass =
  "rounded-md appearance-none relative block w-1/2 px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm";

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
  options,
  showShelterID,
}: InputProps) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #ff5363" : "1px solid #9ca3af",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      padding: "0.5rem",
      cursor: "pointer",
      "&:hover": {
        border: "1px solid #ff5363",
      },
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ff5363" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      padding: "0.5rem",
      "&:hover": {
        backgroundColor: "#fb7a75",
        color: "#fff",
        cursor: "pointer",
      },
    }),
  };

  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputType = showPassword ? "text" : type;

  const handleBlur = () => {
    setIsTouched(true);
  };

  if (type === "radio") {
    const radioOptions = options as string[];
    return (
      <div className="flex flex-col my-10">
        <label>{labelText}</label>
        <div className="flex flex-row gap-8 items-center">
          {radioOptions?.map((option) => (
            <label key={option} className="items-start">
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                onChange={handleChange}
                checked={value === option}
                className={`${fixedRadioClass} ${customClass} ${
                  validationError && isTouched ? "border-red-500" : ""
                }`}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === "select") {
    const selectOptions = options as { label: string; value: string }[];

    return (
      <div className="my-5">
        <label>{labelText}</label>
        <Select
          className={`${fixedSelectClass} ${customClass} ${
            validationError && isTouched ? "border-red-500" : ""
          }`}
          name={name}
          id={id}
          options={selectOptions}
          styles={customStyles}
          onChange={(selectedOption) =>
            handleChange({
              target: { id: id, value: selectedOption?.value || "" },
            })
          }
          value={selectOptions.find((option) => option.value === value)}
        />
      </div>
    );
  }

  if (id === "shelterID" && !showShelterID) {
    return null; // Return null if the shelterID input should not be shown
  }

  return (
    <div className="my-5">
      <label htmlFor={labelFor} className="not-sr-only">
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
