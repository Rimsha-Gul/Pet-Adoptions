import { LoginResponse } from '../../support/types'

describe('Successfully add pet', () => {
  const cleanUp = () => {
    cy.task('deleteMany', {
      collection: 'users',
      params: {
        email: {
          $in: ['test-shelter@example.com', 'test-user@example.com']
        }
      }
    })
    cy.task('deleteMany', {
      collection: 'pets',
      params: { microchipID: 'A123456789' }
    })
  }

  before(cleanUp)
  after(cleanUp)

  it('creates shelter user', () => {
    cy.task('createUser', {
      role: 'SHELTER',
      name: 'Test Shelter',
      email: 'test-shelter@example.com'
    })
  })

  it('login as shelter and add pet', () => {
    cy.intercept('POST', '/pets').as('petApiCall')

    cy.task('login', { email: 'test-shelter@example.com' }).then((response) => {
      const { accessToken, refreshToken } = response as LoginResponse
      cy.log('userEmail: ', 'test-shelter@example.com')

      cy.setLocalStorage('accessToken', accessToken)
      cy.setLocalStorage('refreshToken', refreshToken)
      cy.setLocalStorage('userEmail', 'test-shelter@example.com')
    })

    cy.visit('/homepage')

    cy.get('[data-cy=profile-photo]').click()
    cy.get('[data-cy=profile-and-settings-link]').click()
    cy.get('[data-cy=add-a-pet-button]').click()

    cy.get('#category').click()
    cy.get('[id="react-select-5-listbox"]').contains('Small & Furry').click()

    cy.get('input[data-cy=microchipID]').type('A123456789')

    cy.get('input[data-cy=petName]').type('Snowball')

    cy.get('#gender').click()
    cy.get('[id="react-select-7-listbox"]').contains('Male').click()

    cy.get('[placeholder=YYYY-MM-DD]').click().type('2020-02-20')
    cy.get('body').click(0, 0)

    cy.get('input[data-cy=breed]').type('Mini Rex')

    cy.get('input[data-cy=color]').type('White')

    cy.get('#activityNeeds').click()
    cy.get('[id="react-select-9-listbox"]').contains('Very Low').click()

    cy.get('#levelOfGrooming').click()
    cy.get('[id="react-select-11-listbox"]').contains('Medium').click()

    cy.get('[data-cy=isHouseTrained-div]').find('.react-switch-handle').click()
    cy.get('[data-cy=healthCheck-div]').find('.react-switch-handle').click()
    cy.get('[data-cy=wormed-div]').find('.react-switch-handle').click()
    cy.get('[data-cy=vaccinated-div]').find('.react-switch-handle').click()

    cy.get('input[data-cy=traits]').type('Playful, Social')
    cy.get('input[data-cy=adoptionFee]').type('100')
    cy.get('#currency').click()
    cy.get('[id="react-select-13-listbox"]').contains('USD').click()

    cy.get('textarea[data-cy=bio]').type(
      'Snowball, an alluring male Mini Lop rabbit, boasts a pristine white coat that perfectly mirrors his name. Born in 2020, his vibrant curiosity and playful energy are well-balanced by a gentle, sociable nature, which is a hallmark of his breed. His dark, expressive eyes add to his endearing charm.'
    )

    cy.get('[data-cy=image-upload] input').then((input) => {
      const inputElement = input.get(0) as HTMLInputElement

      cy.fixture('addingPet/snowball-1.jpg', 'binary').then((fileContent) => {
        const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/jpg')
        const testFile = new File([blob], 'snowball-1.jpg', {
          type: 'image/jpg'
        })
        const dataTransfer = new DataTransfer()

        dataTransfer.items.add(testFile)
        inputElement.files = dataTransfer.files
        inputElement.dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('button[type="submit"]').click()
    cy.wait('@petApiCall')

    cy.get('.swal2-title').should('have.text', 'Success!')
    cy.get('.swal2-html-container').should(
      'have.text',
      'The pet has been added successfully.'
    )
    cy.get('.swal2-confirm').click()
  })

  it('creates a simple user', () => {
    cy.task('createUser', {
      role: 'USER',
      name: 'Test User',
      email: 'test-user@example.com'
    })
  })

  it('login as simple user and see a pet', () => {
    cy.task('login', { email: 'test-user@example.com' }).then((response) => {
      const { accessToken, refreshToken } = response as LoginResponse
      cy.setLocalStorage('accessToken', accessToken)
      cy.setLocalStorage('refreshToken', refreshToken)
      cy.setLocalStorage('userEmail', 'test-user@example.com')
    })
    cy.visit('/homepage')
    cy.get('[data-cy=pet-grid]').find('[data-cy=pet-card]').click()
    cy.checkUrlIs('/pet/A123456789')

    cy.get('[data-cy=bio]').should(
      'have.text',
      'Snowball, an alluring male Mini Lop rabbit, boasts a pristine white coat that perfectly mirrors his name. Born in 2020, his vibrant curiosity and playful energy are well-balanced by a gentle, sociable nature, which is a hallmark of his breed. His dark, expressive eyes add to his endearing charm.'
    )
    cy.get('[data-cy=age-stat]').should('have.text', '3 years old')
    cy.get('[data-cy=color-stat]').should('have.text', 'White')
    cy.get('[data-cy=gender-stat]').should('have.text', 'Male')
    cy.get('[data-cy=breed-stat]').should('have.text', 'Mini Rex')
    cy.get('[data-cy=activity-needs-stat]').should('have.text', 'Very Low')
    cy.get('[data-cy=level-of-grooming-stat]').should('have.text', 'Medium')
    cy.get('[data-cy=house-trained-stat]').should('have.text', 'Yes')

    const healthInfoItems = [
      'health-check',
      'allergies-treated',
      'wormed',
      'heartworm-treated',
      'vaccinated',
      'desexed'
    ]

    healthInfoItems.forEach((item) => {
      if (
        item === 'health-check' ||
        item === 'wormed' ||
        item === 'vaccinated'
      ) {
        cy.get(`[data-cy=${item}-check-icon]`).should('be.visible')
      } else {
        cy.get(`[data-cy=${item}-check-icon]`).should('not.exist')
      }
    })

    cy.get('[data-cy=shelter-name]').should('have.text', 'Test Shelter')
    cy.get('[data-cy=adoption-fee]').should('have.text', '100 USD')
    cy.get('[data-cy=application-button]').should(
      'have.text',
      'Apply for Adoption'
    )

    const expectedTraits = ['Playful', 'Social']

    expectedTraits.forEach((trait, index) => {
      cy.get(`[data-cy=trait-${index}]`).contains(trait)
    })
  })
})
