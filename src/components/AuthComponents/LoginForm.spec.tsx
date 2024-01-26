import { fireEvent, render, waitFor } from '@testing-library/react'
import LoginForm from './LoginForm'
import { BrowserRouter as Router } from 'react-router-dom'
import api from '../../api'

jest.mock('../../api')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(api.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { tokens: { accessToken: 'token', refreshToken: 'token' } }
    })
  })

  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <LoginForm />
      </Router>
    )
    expect(getByText('Login')).toBeInTheDocument()
    expect(getByLabelText('Email')).toBeInTheDocument()
    expect(getByLabelText('Password')).toBeInTheDocument()
  })

  it('navigates to the homepage on successful login', async () => {
    const { getByLabelText, getByRole } = render(
      <Router>
        <LoginForm />
      </Router>
    )

    // Simulate user input
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' }
    })

    // Simulate form submission
    fireEvent.click(getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/homepage')
    })
  })

  it('displays an error message on failed login', async () => {
    const mockedPost = api.post as jest.Mock
    mockedPost.mockRejectedValueOnce({
      response: { status: 401, data: 'Invalid credentials!' }
    })

    const { getByLabelText, getByRole, findByText } = render(
      <Router>
        <LoginForm />
      </Router>
    )

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'incorrect' }
    })
    fireEvent.click(getByRole('button', { name: 'Login' }))

    const errorMessage = await findByText('Invalid credentials!')
    expect(errorMessage).toBeInTheDocument()
  })

  // it('displays an error message on user not found', async () => {
  //   const mockedPost = api.post as jest.Mock
  //   mockedPost.mockRejectedValueOnce({
  //     response: { status: 404, data: 'User not found.' }
  //   })

  //   const { getByLabelText, getByRole, findByText } = render(
  //     <Router>
  //       <LoginForm />
  //     </Router>
  //   )

  //   fireEvent.change(getByLabelText('Email'), {
  //     target: { value: 'user@example.com' }
  //   })
  //   fireEvent.change(getByLabelText('Password'), {
  //     target: { value: 'password' }
  //   })
  //   fireEvent.click(getByRole('button', { name: 'Login' }))

  //   const emailError = await findByText('User not found.', {
  //     selector: '[data-cy="error-message"]'
  //   })
  //   expect(emailError).toBeInTheDocument()
  // })

  it('navigates to the verifyemail page when user is not verified', async () => {
    const mockedPost = api.post as jest.Mock
    mockedPost.mockRejectedValueOnce({
      response: { status: 403, data: 'User not verified' }
    })

    const { getByLabelText, getByRole } = render(
      <Router>
        <LoginForm />
      </Router>
    )

    // Simulate user input
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' }
    })

    // Simulate form submission
    fireEvent.click(getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verifyemail')
    })
  })
})
