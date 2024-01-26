import { fireEvent, render, screen } from '@testing-library/react'
import EmailVerificationForm from './VerifyEmail'

describe('EmailVerificationForm', () => {
  const mockSetVerificationCode = jest.fn()
  const mockHandleClick = jest.fn()
  const mockHandleResendClick = jest.fn()

  it('renders correctly', () => {
    render(
      <EmailVerificationForm
        verificationCode=""
        setVerificationCode={mockSetVerificationCode}
        isLoading={false}
        handleClick={mockHandleClick}
        timer={60}
        isResending={false}
        handleResendClick={mockHandleResendClick}
        resendDisabled={false}
        verificationCodeError=""
        isCodeValid={true}
        customClassName=""
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Verify')).toBeInTheDocument()
  })

  it('updates verification code input', () => {
    render(
      <EmailVerificationForm
        verificationCode=""
        setVerificationCode={mockSetVerificationCode}
        isLoading={false}
        handleClick={mockHandleClick}
        timer={60}
        isResending={false}
        handleResendClick={mockHandleResendClick}
        resendDisabled={false}
        verificationCodeError=""
        isCodeValid={true}
        customClassName=""
      />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '123456' } })
    expect(mockSetVerificationCode).toHaveBeenCalledWith('123456')
  })

  it('calls handleClick on verify button click', () => {
    render(
      <EmailVerificationForm
        verificationCode="123456"
        setVerificationCode={mockSetVerificationCode}
        isLoading={false}
        handleClick={mockHandleClick}
        timer={60}
        isResending={false}
        handleResendClick={mockHandleResendClick}
        resendDisabled={false}
        verificationCodeError=""
        isCodeValid={true}
        customClassName=""
      />
    )
    fireEvent.click(screen.getByText('Verify'))
    expect(mockHandleClick).toHaveBeenCalled()
  })

  it('calls handleResendClick on resend button click', () => {
    render(
      <EmailVerificationForm
        verificationCode=""
        setVerificationCode={mockSetVerificationCode}
        isLoading={false}
        handleClick={mockHandleClick}
        timer={0} // Setting timer to 0 to enable the resend button
        isResending={false}
        handleResendClick={mockHandleResendClick}
        resendDisabled={false}
        verificationCodeError=""
        isCodeValid={false}
        customClassName=""
      />
    )
    fireEvent.click(screen.getByText('Resend Code'))
    expect(mockHandleResendClick).toHaveBeenCalled()
  })
})
