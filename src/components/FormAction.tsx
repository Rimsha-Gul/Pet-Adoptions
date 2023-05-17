import { FormEvent } from "react";

interface FormActionProps {
  handleSubmit: (e: FormEvent) => void;
  type?: "Button";
  action?: "submit";
  text: string;
}

export default function FormAction({
  handleSubmit,
  type = "Button",
  action = "submit",
  text,
}: FormActionProps) {
  return (
    <>
      {type === "Button" ? (
        <button
          type={action}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700 mt-10"
          onClick={handleSubmit}
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
