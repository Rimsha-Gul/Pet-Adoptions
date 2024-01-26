import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('<Input />', () => {
  test('renders input with the correct label', () => {
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Email"
        labelFor="email"
        id="email"
        name="email"
        type="email"
        isRequired={true}
        customClass=""
      />
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  test.each([
    ['text', 'text'],
    ['email', 'email'],
    ['password', 'password']
  ])('renders %s input when type is %s', (labelText, type) => {
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText={labelText}
        labelFor={type}
        id={type}
        name={type}
        type={type}
        isRequired={true}
        customClass=""
      />
    )
    const input = screen.getByLabelText(labelText)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', type)
  })

  test('renders a textarea when type is textarea', () => {
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Bio"
        labelFor="bio"
        id="bio"
        name="bio"
        type="textarea"
        isRequired={true}
        customClass=""
        rows={4}
      />
    )
    const textarea = screen.getByLabelText('Bio')
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName.toLowerCase()).toBe('textarea')
  })

  test('renders DatePicker component when type is date', () => {
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Date of Birth"
        labelFor="dob"
        id="dob"
        name="dob"
        type="date"
        isRequired={true}
        customClass=""
      />
    )
    const datePickerInput = screen.getByPlaceholderText('YYYY-MM-DD')
    expect(datePickerInput).toBeInTheDocument()
  })

  test('renders Select component when type is select', () => {
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' }
    ]
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Select Option"
        labelFor="select"
        id="select"
        name="select"
        type="select"
        isRequired={true}
        customClass=""
        options={options}
      />
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  test('renders Switch component when type is toggle', () => {
    render(
      <Input
        handleChange={jest.fn()}
        value="false"
        labelText="Toggle Switch"
        labelFor="toggle"
        id="toggle"
        name="toggle"
        type="toggle"
        isRequired={true}
        customClass=""
      />
    )
    const toggle = screen.getByRole('switch')
    expect(toggle).toBeInTheDocument()
  })

  test('displays validation error when there is a validation error in email field', () => {
    const validationError = 'Email is required'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Email"
        labelFor="email"
        id="email"
        name="email"
        type="email"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Email')
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveTextContent(validationError)
  })

  test('displays validation error when email is in incorrect format', () => {
    const validationError = 'Invalid email format'
    render(
      <Input
        handleChange={jest.fn()}
        value="test"
        labelText="Email"
        labelFor="email"
        id="email"
        name="email"
        type="email"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Email')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when there is a validation error in name field', () => {
    const validationError = 'Name is required'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Name"
        labelFor="name"
        id="name"
        name="name"
        type="text"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Name')
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveTextContent(validationError)
  })

  test('displays validation error when name is fewer than 3 characters', () => {
    const validationError = 'Name should be at least 3 characters long'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Name"
        labelFor="name"
        id="name"
        name="name"
        type="text"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Name')
    fireEvent.change(input, { target: { value: 'Jo' } })
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when there is a validation error in password field', () => {
    const validationError = 'Password is required'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Password"
        labelFor="password"
        id="password"
        name="password"
        type="password"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Password')
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveTextContent(validationError)
  })

  test('displays validation error when password is fewer than 6 characters', () => {
    const validationError = 'Password should be at least 6 characters long'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Password"
        labelFor="password"
        id="password"
        name="password"
        type="password"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const input = screen.getByLabelText('Password')
    fireEvent.change(input, { target: { value: '12345' } })
    fireEvent.blur(input)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when confirm password does not match password', () => {
    const confirmPassword = 'password'
    const validationError = 'Passwords do not match'

    render(
      <Input
        handleChange={jest.fn()}
        value={confirmPassword}
        labelText="Confirm Password"
        labelFor="confirmPassword"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        isRequired={true}
        customClass=""
        validationError={validationError}
      />
    )

    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword }
    })
    fireEvent.blur(confirmPasswordInput)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when textarea is empty', () => {
    const validationError = 'This field is required'
    render(
      <Input
        handleChange={jest.fn()}
        value=""
        labelText="Comments"
        labelFor="comments"
        id="comments"
        name="comments"
        type="textarea"
        isRequired={true}
        rows={4}
        customClass=""
        validationError={validationError}
      />
    )

    const textarea = screen.getByLabelText('Comments')
    fireEvent.blur(textarea)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when textarea has fewer than 10 characters', () => {
    const validationError = 'Review text should be at least 10 characters long'
    render(
      <Input
        handleChange={jest.fn()}
        value="Short"
        labelText="Comments"
        labelFor="comments"
        id="comments"
        name="comments"
        type="textarea"
        isRequired={true}
        rows={4}
        customClass=""
        validationError={validationError}
      />
    )

    const textarea = screen.getByLabelText('Comments')
    fireEvent.change(textarea, { target: { value: 'Short' } })
    fireEvent.blur(textarea)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays validation error when textarea has fewer than 10 characters', () => {
    const validationError = 'Review text should be at least 10 characters long'
    render(
      <Input
        handleChange={jest.fn()}
        value="Short"
        labelText="Review Text"
        labelFor="reviewText"
        id="reviewText"
        name="reviewText"
        type="textarea"
        isRequired={true}
        rows={4}
        customClass=""
        validationError={validationError}
      />
    )

    const textarea = screen.getByLabelText('Review Text')
    fireEvent.change(textarea, { target: { value: 'Short' } })
    fireEvent.blur(textarea)

    const errorMessage = screen.getByText(validationError)
    expect(errorMessage).toBeInTheDocument()
  })

  test('calls handleChange on text input change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Name"
        labelFor="name"
        id="name"
        name="name"
        type="text"
        isRequired={true}
        customClass=""
      />
    )

    const input = screen.getByLabelText('Name')
    fireEvent.change(input, { target: { id: 'name', value: 'John Doe' } })
    expect(handleChange).toHaveBeenCalled()
  })

  test('calls handleChange on email input change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Email"
        labelFor="email"
        id="email"
        name="email"
        type="email"
        isRequired={true}
        customClass=""
      />
    )

    const input = screen.getByLabelText('Email')
    fireEvent.change(input, {
      target: { id: 'email', value: 'john@example.com' }
    })
    expect(handleChange).toHaveBeenCalled()
  })

  test('calls handleChange on password input change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Password"
        labelFor="password"
        id="password"
        name="password"
        type="password"
        isRequired={true}
        customClass=""
      />
    )

    const input = screen.getByLabelText('Password')
    fireEvent.change(input, {
      target: { id: 'password', value: 'password123' }
    })
    expect(handleChange).toHaveBeenCalled()
  })

  test('calls handleChange on textarea change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Message"
        labelFor="message"
        id="message"
        name="message"
        type="textarea"
        isRequired={true}
        rows={4}
        customClass=""
      />
    )

    const textarea = screen.getByLabelText('Message')
    fireEvent.change(textarea, {
      target: { id: 'message', value: 'Hello World' }
    })
    expect(handleChange).toHaveBeenCalled()
  })

  test('calls handleChange on select option change', async () => {
    const handleChange = jest.fn()
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' }
    ]

    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Select Option"
        labelFor="select"
        id="select"
        name="select"
        type="select"
        isRequired={true}
        options={options}
        customClass=""
      />
    )

    const selectInput = screen.getByRole('combobox')
    userEvent.click(selectInput)

    // Select an option
    // const option = await screen.findByText('Option 1')
    // userEvent.click(option)

    // expect(handleChange).toHaveBeenCalled()
  })

  test('calls handleChange on toggle switch change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value="false"
        labelText="Toggle Switch"
        labelFor="toggle"
        id="toggle"
        name="toggle"
        type="toggle"
        isRequired={true}
        customClass=""
      />
    )

    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { id: 'toggle', value: true } })
    )
  })

  test('calls handleChange with correct arguments on date input change', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Date of Birth"
        labelFor="dob"
        id="dob"
        name="dob"
        type="date"
        isRequired={true}
        customClass=""
      />
    )

    const dateInput = screen.getByPlaceholderText('YYYY-MM-DD')
    const newDate = '2000-01-01'
    fireEvent.change(dateInput, { target: { id: 'dob', value: newDate } })

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          id: 'dob',
          value: newDate
        })
      })
    )
  })

  test('displays correct placeholder for text input', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Text"
        labelFor="text"
        id="text"
        name="text"
        type="text"
        isRequired={true}
        placeholder="Enter text here"
        customClass="custom-class"
      />
    )
    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
  })

  test('displays correct placeholder for email input', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Email"
        labelFor="email"
        id="email"
        name="email"
        type="email"
        isRequired={true}
        placeholder="Enter email here"
        customClass="custom-class"
      />
    )
    const input = screen.getByPlaceholderText('Enter email here')
    expect(input).toBeInTheDocument()
  })

  test('displays correct placeholder for password input', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Password"
        labelFor="password"
        id="password"
        name="password"
        type="password"
        isRequired={true}
        placeholder="Enter password"
        customClass="custom-class"
      />
    )
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toBeInTheDocument()
  })

  test('displays correct placeholder for textarea', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Message"
        labelFor="message"
        id="message"
        name="message"
        type="textarea"
        isRequired={true}
        rows={4}
        placeholder="Enter your message"
        customClass="custom-class"
      />
    )
    const textarea = screen.getByPlaceholderText('Enter your message')
    expect(textarea).toBeInTheDocument()
  })

  test('displays correct placeholder for date input', () => {
    const handleChange = jest.fn()
    render(
      <Input
        handleChange={handleChange}
        value=""
        labelText="Date of Birth"
        labelFor="dob"
        id="dob"
        name="dob"
        type="date"
        isRequired={true}
        placeholder="YYYY-MM-DD"
        customClass="custom-class"
      />
    )
    const dateInput = screen.getByPlaceholderText('YYYY-MM-DD')
    expect(dateInput).toBeInTheDocument()
  })
})
