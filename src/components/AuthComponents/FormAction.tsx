import { FormEvent } from 'react'
import loadingIcon from '../../assets/loading.gif'

interface FormActionProps {
  handleSubmit: (e: FormEvent) => void
  type?: 'button' | 'submit' | 'reset'
  text: string
  isLoading?: boolean
  disabled?: boolean
  customClass: string
}

const FormAction = ({
  handleSubmit,
  type = 'submit',
  text,
  isLoading = false,
  disabled = true,
  customClass
}: FormActionProps) => {
  return (
    <button
      type={type}
      className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary mt-10 ${
        isLoading ? 'bg-primary text-white' : ''
      } ${disabled ? 'opacity-50' : ''} ${customClass}`}
      onClick={handleSubmit}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <img
          src={loadingIcon}
          alt="Loading"
          data-cy="loadingIcon"
          className="mr-2 h-4 w-4"
        />
      )}
      {text}
    </button>
  )
}

export default FormAction
