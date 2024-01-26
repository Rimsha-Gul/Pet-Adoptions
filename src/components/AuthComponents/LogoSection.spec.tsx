import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import LogoSection from './LogoSection'

describe('LogoSection', () => {
  it('renders correctly', () => {
    const { getByText, getByAltText } = render(
      <Router>
        <LogoSection />
      </Router>
    )

    expect(getByAltText('')).toBeInTheDocument()
    expect(getByText('Purrfect Adoptions')).toBeInTheDocument()
  })

  it('does not render paragraph and link when props are not provided', () => {
    const { queryByTestId } = render(
      <Router>
        <LogoSection />
      </Router>
    )

    expect(queryByTestId('logo-section-link')).not.toBeInTheDocument()
  })

  it('renders paragraph and link when props are provided', () => {
    const paragraph = 'Welcome to our website!'
    const linkName = 'Learn More'
    const linkUrl = '/about'

    const { getByText } = render(
      <Router>
        <LogoSection
          paragraph={paragraph}
          linkName={linkName}
          linkUrl={linkUrl}
        />
      </Router>
    )

    // Check for rendered paragraph and link
    expect(getByText(paragraph)).toBeInTheDocument()
    expect(getByText(linkName)).toBeInTheDocument()
    // Additional test can be added to check if link navigates to the correct URL
  })
})
