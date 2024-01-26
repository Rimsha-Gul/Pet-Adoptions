import { fireEvent, render, waitFor } from '@testing-library/react'
import SignupForm from './SignupForm'
import { BrowserRouter as Router } from 'react-router-dom'
import api from '../../api'

jest.mock('../../api')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(api.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        name: 'User',
        email: 'user@example.com'
      }
    })
  })

  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <SignupForm />
      </Router>
    )
    expect(getByText('Signup')).toBeInTheDocument()
    expect(getByLabelText('Email')).toBeInTheDocument()
    expect(getByLabelText('Password')).toBeInTheDocument()
    expect(getByLabelText('ConfirmPassword')).toBeInTheDocument()
    expect(getByLabelText('Name')).toBeInTheDocument()
  })

  it('navigates to a specified page on successful signup', async () => {
    const { getByLabelText, getByRole } = render(
      <Router>
        <SignupForm />
      </Router>
    )

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'newuser@example.com' }
    })
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(getByLabelText('ConfirmPassword'), {
      target: { value: 'password123' }
    })
    fireEvent.change(getByLabelText('Name'), {
      target: { value: 'John Doe' }
    })
    // Add any other fields that need to be filled out

    fireEvent.click(getByRole('button', { name: 'Signup' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verifyemail')
    })
  })

  it('navigates to a specified page on successful signup', async () => {
    const mockedPost = api.post as jest.Mock
    mockedPost.mockRejectedValueOnce({
      response: { status: 400, data: 'Invalid invitation' }
    })

    const { findByText, getByLabelText, getByRole } = render(
      <Router>
        <SignupForm />
      </Router>
    )

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'newuser@example.com' }
    })
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(getByLabelText('ConfirmPassword'), {
      target: { value: 'password123' }
    })
    fireEvent.change(getByLabelText('Name'), {
      target: { value: 'John Doe' }
    })

    fireEvent.click(getByRole('button', { name: 'Signup' }))

    const errorMessage = await findByText('Invalid invitation')
    expect(errorMessage).toBeInTheDocument()
  })
})
