import { petData } from '../../fixtures/addingPet/petData'

describe('Adoption Application Approval', () => {
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

    // Residence Information
    cy.get('#residenceType').click()
    cy.get('[id="react-select-5-listbox"]').contains('Own a house').click()

    // Pet Engagement Information
    cy.get('input[data-cy=petAloneTime]').type('1')
    cy.get('[data-cy=hasPlayTimeParks-div]')
      .find('.react-switch-handle')
      .click()
    cy.get('textarea[data-cy=petActivities]').type('Walk, Play')

    // Pet Commitment Information
    cy.get('textarea[data-cy=handlePetIssues]').type('Will buy new things')
    cy.get('textarea[data-cy=moveWithPet]').type('Will take him with me')
    cy.get('textarea[data-cy=petTravelPlans]').type(
      'Will take him wherever i go'
    )
    cy.get('textarea[data-cy=petOutlivePlans]').type(
      'Will have my friend take care of him'
    )

    cy.get('button[type=submit]').click()

    cy.get('.swal2-title').should('have.text', 'Success!')
    cy.get('.swal2-html-container').should(
      'have.text',
      'Application submitted successfully.'
    )
    cy.get('.swal2-footer')
      .contains('View your application and its status')
      .click()

    cy.getApplicationIdFromUrl().then((applicationID) => {
      const currentDate = new Date().toLocaleDateString('en-US')
      cy.get('[data-cy=applicationID]').should('have.text', applicationID)
      cy.get('[data-cy=application-status]').should('have.text', 'Under Review')
      cy.get('[data-cy=shelter-name]').should('have.text', 'Test Shelter')
      cy.get('[data-cy=submission-date]').should('have.text', currentDate)

      // Residence Information
      cy.get('[data-cy=residenceType-field]').should('have.text', 'Owns house')
      cy.get('[data-cy=hasChildren-field]').should('have.text', 'No')
      cy.get('[data-cy=hasOtherPets-field]').should('have.text', 'No')

      // Pet Engagement Information
      cy.get('[data-cy=petAloneTime-field]').should('have.text', '1 hr')
      cy.get('[data-cy=hasPlayTimeParks-field]').should('have.text', 'Yes')
      cy.get('[data-cy=petActivities-field]').should('have.text', 'Walk, Play')

      // Pet Commitment Information
      cy.get('[data-cy=handlePetIssues-field]').should(
        'have.text',
        'Will buy new things'
      )
      cy.get('[data-cy=moveWithPet-field]').should(
        'have.text',
        'Will take him with me'
      )
      cy.get('[data-cy=canAffordPetsNeeds-field]').should('have.text', 'No')
      cy.get('[data-cy=canAffordPetsMedical-field]').should('have.text', 'No')
      cy.get('[data-cy=petTravelPlans-field]').should(
        'have.text',
        'Will take him wherever i go'
      )
      cy.get('[data-cy=petOutlivePlans-field]').should(
        'have.text',
        'Will have my friend take care of him'
      )
    })
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
    cy.get('[data-cy=application-card]').click()
    cy.get('[data-cy=request-for-home-visit-button]').click()
    cy.wait('@statusApiCall')
    cy.get('.swal2-confirm').click()

    cy.get('[data-cy=application-status]').should(
      'have.text',
      'Home Visit Requested'
    )
  })

  // // Schedule Home Visit/Inspection
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
    cy.get('[data-cy=application-card]').click()
    cy.get('[data-cy=schedule-shelter-s-visit-to-your-home-button]').click()

    cy.get('#time').click()
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

      cy.get('[data-cy=application-status]').should(
        'have.text',
        'Home Visit Scheduled'
      )
    })
  })

  // // Approve Home Visit and Schedule Shelter Visit
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
    cy.get('[data-cy=application-card]').click()

    const tomorrow = new Date(new Date().setDate(new Date().getDate() - 1))
    const nextDayDate = tomorrow.toLocaleDateString('en-US')
    const timeSlot = '9:00:00 AM'
    const nextDayDateTime = `${nextDayDate}, ${timeSlot}`
    cy.get('[data-cy=home-visit-date]').should('have.text', nextDayDateTime)

    cy.get('[data-cy=approve-applicant-home-button]').click()
    cy.wait('@statusApiCall')
    cy.get('.swal2-confirm').click()

    cy.get('[data-cy=application-status]').should('have.text', 'Home Approved')

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

      cy.get('[data-cy=application-status]').should(
        'have.text',
        'User Visit Scheduled'
      )
    })
  })

  // Approve Application
  it('login shelter and approve application', () => {
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
    cy.get('[data-cy=application-card]').click()

    const tomorrow = new Date(new Date().setDate(new Date().getDate() - 1))
    const nextDayDate = tomorrow.toLocaleDateString('en-US')
    const timeSlot = '10:00:00 AM'
    const nextDayDateTime = `${nextDayDate}, ${timeSlot}`
    cy.get('[data-cy=shelter-visit-date]').should('have.text', nextDayDateTime)

    cy.get('[data-cy=approve-application-button]').click()
    cy.wait('@statusApiCall')
    cy.get('.swal2-confirm').click()
    cy.url().should('contain', '/view/application')
    cy.get('[data-cy=application-status]').should('have.text', 'Approved')
  })
})
