import { FormEvent } from "react";
import loadingIcon from "../../assets/loading.gif";

interface FormActionProps {
  handleSubmit: (e: FormEvent) => void;
  type?: "Button";
  action?: "submit";
  text: string;
  isLoading?: boolean;
  disabled?: boolean; // Add disabled prop
}

const FormAction = ({
  handleSubmit,
  type = "Button",
  action = "submit",
  text,
  isLoading = false,
  disabled = true,
}: FormActionProps) => {
  return (
    <>
      {type === "Button" ? (
        <button
          type={action}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary mt-10 ${
            isLoading ? "bg-primary text-white cursor-not-allowed" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
          disabled={isLoading || disabled} // Use disabled prop
        >
          {isLoading && (
            <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
          )}
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default FormAction;
