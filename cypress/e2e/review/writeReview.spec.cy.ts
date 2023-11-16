import { petData } from '../../fixtures/addingPet/petData'

describe('Successfully write review of shelter', () => {
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
    cy.task('deleteMany', {
      collection: 'applications',
      params: {
        microchipID: 'A123456789',
        applicantEmail: 'test-user@example.com'
      }
    })
    cy.task('deleteMany', {
      collection: 'visits',
      params: {
        applicantEmail: 'test-user@example.com'
      }
    })
    cy.task('deleteMany', {
      collection: 'reviews',
      params: {
        applicantEmail: 'test-user@example.com'
      }
    })
    cy.task('deleteMany', {
      collection: 'notifications',
      params: {
        userEmail: 'test-user@example.com'
      }
    })
  }

  before(cleanUp)
  after(cleanUp)

  it('creates shelter', () => {
    cy.task('createUser', {
      role: 'SHELTER',
      name: 'Test Shelter',
      email: 'test-shelter@example.com'
    })
  })

  it('login shelter and add pet', () => {
    cy.task('login', { email: 'test-shelter@example.com' })
    cy.task('getAccessToken', { email: 'test-shelter@example.com' }).then(
      (accessToken) => {
        cy.task('addPet', {
          accessToken: accessToken,
          petData: petData
        })
      }
    )
  })

  it('creates user', () => {
    cy.task('createUser', {
      role: 'USER',
      name: 'Test User',
      email: 'test-user@example.com'
    })
  })

  it('login user and apply for a pet', () => {
    cy.task('login', { email: 'test-user@example.com' }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage('accessToken', accessToken)
        cy.setLocalStorage('refreshToken', refreshToken)
        cy.setLocalStorage('userEmail', 'test-user@example.com')
      }
    )
    cy.visit('/homepage')

    cy.get('[data-cy=pet-grid]').find('[data-cy=pet-card]').click()
    cy.get('[data-cy=application-button]').click()

    cy.get('#residenceType').click()
    cy.get('[id="react-select-5-listbox"]').contains('Own a house').click()
    cy.get('input[data-cy=petAloneTime]').type('1')
    cy.contains('Do you have a fenced yard or nearby parks for playtime?')
      .parent()
      .find('.react-switch')
      .click()
    cy.get('textarea[data-cy=petActivities]').type('Walk, Play')
    cy.get('textarea[data-cy=handlePetIssues]').type('Will buy new things')

    cy.get('textarea[data-cy=moveWithPet]').type('Will take him with me')
    cy.get('textarea[data-cy=petTravelPlans]').type(
      'Will take him wherever i go'
    )
    cy.get('textarea[data-cy=petOutlivePlans]').type(
      'Will have my friend take care of him'
    )
    cy.get('button[type=submit]').click()
    cy.get('.swal2-footer').click()
  })

  // Request Home Visit/Inspection
  it('login shelter and request home visit', () => {
    cy.intercept('PUT', '/applications/*/status').as('statusApiCall')
    cy.task('login', { email: 'test-shelter@example.com' }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage('accessToken', accessToken)
        cy.setLocalStorage('refreshToken', refreshToken)
        cy.setLocalStorage('userEmail', 'test-shelter@example.com')
      }
    )
    cy.visit('/homepage')

    cy.get('[data-cy=profile-photo]').click()
    cy.get('[data-cy=view-applications-link]').click()
    cy.get('[data-cy=application-card]').should('be.visible').click()
    cy.get('[data-cy=request-for-home-visit-button]').click()
    cy.wait('@statusApiCall')
    cy.get('.swal2-confirm').click()
  })

  // Schedule Home Visit/Inspection
  it('login user and schedule home visit', () => {
    cy.intercept('POST', '/applications/*/homeVisit').as('visitApiCall')
    cy.task('login', { email: 'test-user@example.com' }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage('accessToken', accessToken)
        cy.setLocalStorage('refreshToken', refreshToken)
        cy.setLocalStorage('userEmail', 'test-user@example.com')
      }
    )
    cy.visit('/homepage')

    cy.get('[data-cy=profile-photo]').click()
    cy.get('[data-cy=view-applications-link]').click()
    cy.get('[data-cy=application-card]').should('be.visible').click()
    cy.get('[data-cy=schedule-shelter-s-visit-to-your-home-button]').click()

    cy.get('#time').should('exist').should('be.visible').click()
    cy.get('[id="react-select-7-listbox"]').contains('9:00').click()
    cy.get('button[type=submit]').click()
    cy.wait('@visitApiCall')
    cy.get('.swal2-confirm').click()
    cy.url().should('contain', '/view/application')
    cy.getApplicationIdFromUrl().then((applicationID) => {
      cy.task('setVisitDateToPast', {
        applicationID: applicationID,
        visitType: 'Home'
      })
    })
  })

  // Approve Home Visit and Schedule Shelter Visit
  it("login shelter, approve home visit, and schedule applicant's visit to shelter", () => {
    cy.intercept('PUT', '/applications/*/status').as('statusApiCall')
    cy.intercept('POST', '/applications/*/shelterVisit').as('visitApiCall')
    cy.task('login', { email: 'test-shelter@example.com' }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage('accessToken', accessToken)
        cy.setLocalStorage('refreshToken', refreshToken)
        cy.setLocalStorage('userEmail', 'test-shelter@example.com')
      }
    )
    cy.visit('/homepage')

    cy.get('[data-cy=profile-photo]').click()
    cy.get('[data-cy=view-applications-link]').click()
    cy.get('[data-cy=application-card]').should('be.visible').click()
    cy.get('[data-cy=approve-applicant-home-button]')
      .should('exist')
      .should('be.visible')
      .click()
    cy.wait('@statusApiCall')
    cy.get('.swal2-confirm').click()
    cy.get('[data-cy=schedule-applicant-s-visit-to-shelter-button]').click()

    cy.get('#time').click()
    cy.get('[id="react-select-7-listbox"]').contains('10:00').click()
    cy.get('button[type=submit]').click()
    cy.wait('@visitApiCall')
    cy.get('.swal2-confirm').click()
    cy.url().should('contain', '/view/application')
    cy.getApplicationIdFromUrl().then((applicationID) => {
      cy.task('setVisitDateToPast', {
        applicationID: applicationID,
        visitType: 'Shelter'
      })
    })
  })

  it('login user and write review of shelter', () => {
    cy.task('login', { email: 'test-user@example.com' }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage('accessToken', accessToken)
        cy.setLocalStorage('refreshToken', refreshToken)
        cy.setLocalStorage('userEmail', 'test-user@example.com')
      }
    )
    cy.visit('/homepage')

    cy.get('[data-cy=pet-grid]').find('[data-cy=pet-card]').click()
    cy.get('[data-cy=shelter-link]').invoke('removeAttr', 'target').click()
    cy.get('[data-cy=review-button]')
      .should('exist')
      .should('be.visible')
      .click()
    cy.get('.star-container:nth-child(6)').click()
    cy.get('.star').eq(4).click()
    cy.get('textarea[data-cy=reviewText]').type(
      'This shelter provided an incredibly positive adoption experience. The staff were knowledgeable, the facility was clean, and they genuinely cared for the well-being of all animals. Highly recommended for anyone looking to adopt a pet.'
    )
    cy.get('[data-cy=submit-review-button]').click()
    cy.get('.swal2-confirm').click()
    cy.get('[data-cy=reviews-grid]').find('[data-cy=review]').should('exist')

    cy.get('[data-cy=shelter-rating]').should('have.text', '5.0 (1 review)')
    cy.get('[data-cy=applicant-name]').should('have.text', 'Test User')
    cy.get('[data-cy=review-text]').should(
      'have.text',
      'This shelter provided an incredibly positive adoption experience. The staff were knowledgeable, the facility was clean, and they genuinely cared for the well-being of all animals. Highly recommended for anyone looking to adopt a pet.'
    )
  })
})
