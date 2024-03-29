import { useState } from 'react'
import 'react-datetime/css/react-datetime.css'
import DatePicker from 'react-tailwindcss-datepicker'
import Select from 'react-select'
import Switch from 'react-switch'

interface InputProps {
  handleChange: any
  value: string
  labelText: string
  labelFor: string
  id: string
  name: string
  type: string
  isRequired: boolean
  placeholder?: string
  rows?: number
  customClass: string
  validationError?: string
  options?: Array<string | { label: string; value: string }>
  showShelterID?: boolean
  labelClassName?: string
  readOnly?: boolean
}

const fixedInputClass =
  'rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm'

const fixedSelectClass =
  'rounded-md appearance-none relative block w-full py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm'

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
  rows,
  customClass,
  validationError,
  options,
  showShelterID,
  labelClassName,
  readOnly
}: InputProps) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? '1px solid #ff5363' : '1px solid #9ca3af',
      borderRadius: '0.375rem',
      backgroundColor: '#fff',
      padding: '0.5rem',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid #ff5363'
      }
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ff5363' : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      padding: '0.5rem',
      '&:hover': {
        backgroundColor: '#fb7a75',
        color: '#fff',
        cursor: 'pointer'
      }
    })
  }

  const [isTouched, setIsTouched] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState(false)
  const [dateValue, setDateValue] = useState<{
    startDate: null | Date
    endDate: null | Date
  }>({
    startDate: null,
    endDate: null
  })

  const handleToggle = () => {
    setIsChecked((prevChecked) => !prevChecked)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  const inputType = showPassword ? 'text' : type

  const handleBlur = () => {
    setIsTouched(true)
  }

  if (id === 'shelter' && !showShelterID) {
    return null // Return null if the shelterID input should not be shown
  }

  if (type === 'date') {
    const handleValueChange = (newValue: any) => {
      setDateValue(newValue)
      handleChange({
        target: {
          id: id,
          value: newValue.startDate
        }
      })
    }

    return (
      <div className="my-5">
        <label htmlFor={labelFor} className={`not-sr-only  ${labelClassName}`}>
          {labelText}
        </label>
        <DatePicker
          data-cy="date-of-birth"
          useRange={false}
          asSingle={true}
          value={dateValue}
          onChange={handleValueChange}
          maxDate={new Date()}
        />

        {validationError && isTouched && (
          <p className="text-red-500 text-xs mt-1">{validationError}</p>
        )}
      </div>
    )
  }

  if (type === 'select') {
    const selectOptions = options as { label: string; value: string }[]

    return (
      <div className="my-5">
        <label className={` ${labelClassName}`}>{labelText}</label>
        <Select
          className={`${fixedSelectClass} ${customClass} ${
            validationError && isTouched ? 'border-red-500' : ''
          }`}
          name={name}
          id={id}
          options={selectOptions}
          styles={customStyles}
          isSearchable
          menuPlacement="auto"
          maxMenuHeight={200}
          onChange={(selectedOption) => {
            console.log(
              'handle change calledddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
            )
            handleChange({
              target: { id: id, value: selectedOption?.value || '' }
            })
          }}
          value={selectOptions.find((option) => option.value === value)}
        />
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className="my-5">
        <label className={` ${labelClassName}`} htmlFor={labelFor}>
          {labelText}
        </label>
        <textarea
          data-cy={`${id}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          id={id}
          name={name}
          required={isRequired}
          rows={rows}
          className={`${fixedInputClass} ${customClass} ${
            validationError && isTouched ? 'border-red-500' : ''
          }`}
          placeholder={placeholder}
        />
        {validationError && isTouched && (
          <p data-cy="error-message" className="text-red-500 text-xs mt-1">
            {validationError}
          </p>
        )}
      </div>
    )
  }

  if (type === 'toggle') {
    return (
      <div
        data-cy={`${name}-div`}
        className="flex flex-row my-5 justify-between"
      >
        <label className={` ${labelClassName}`}>{labelText}</label>

        <Switch
          checked={isChecked}
          onChange={() => {
            handleToggle()
            handleChange({ target: { id, value: !isChecked } })
          }}
          offHandleColor="#fff"
          onColor="#fb7a75"
          onHandleColor="#fff"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className={`react-switch ${customClass} `}
        />
      </div>
    )
  }

  return (
    <div className="my-5">
      <label htmlFor={labelFor} className={`not-sr-only  ${labelClassName} `}>
        {labelText}
      </label>
      <div className="relative">
        <input
          data-cy={`${id}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          id={id}
          name={name}
          type={inputType}
          required={isRequired}
          readOnly={type === 'email' && readOnly}
          disabled={type === 'email' && readOnly}
          className={`${fixedInputClass} ${customClass} ${
            validationError && isTouched ? 'border-red-500' : ''
          }`}
          placeholder={placeholder}
        />

        {type === 'password' && (
          <label className={`flex items-center mt-2 ml-2 ${labelClassName}`}>
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
        <p data-cy="error-message" className="text-red-500 text-xs mt-1">
          {validationError}
        </p>
      )}
    </div>
  )
}

export default Input
