import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FormAction from './FormAction'

describe('<FormAction />', () => {
  test('renders a button with provided text', () => {
    render(<FormAction handleSubmit={jest.fn()} text="Submit" customClass="" />)
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  test('button is disabled and shows loading icon when isLoading is true', () => {
    render(
      <FormAction
        handleSubmit={jest.fn()}
        text="Submit"
        isLoading={true}
        customClass=""
      />
    )
    const button = screen.getByText('Submit')
    expect(button).toBeDisabled()
    expect(screen.getByAltText('Loading')).toBeInTheDocument()
  })

  test('button is disabled when disabled prop is true', () => {
    render(
      <FormAction
        handleSubmit={jest.fn()}
        text="Submit"
        disabled={true}
        customClass=""
      />
    )
    const button = screen.getByText('Submit')
    expect(button).toBeDisabled()
  })

  test('invokes handleSubmit when clicked', () => {
    const handleSubmitMock = jest.fn()
    render(
      <FormAction
        handleSubmit={handleSubmitMock}
        text="Submit"
        disabled={false}
        customClass=""
      />
    )
    const button = screen.getByText('Submit')
    fireEvent.click(button)
    expect(handleSubmitMock).toHaveBeenCalledTimes(1)
  })

  test('renders a button with type "submit" by default', () => {
    render(<FormAction handleSubmit={jest.fn()} text="Submit" customClass="" />)
    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  // Test explicit 'button' type when 'type' prop is provided
  test('renders a button with type "button" when provided', () => {
    render(
      <FormAction
        handleSubmit={jest.fn()}
        text="Submit"
        type="button"
        customClass=""
      />
    )
    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  test('applies custom class to the button', () => {
    const customClass = 'custom-class'
    render(
      <FormAction
        handleSubmit={jest.fn()}
        text="Submit"
        customClass={customClass}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass(customClass)
  })
})
