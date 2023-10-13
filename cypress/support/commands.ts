/// <reference types="cypress" />
import 'cypress-file-upload'
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Custom command to check the URL
Cypress.Commands.add('checkUrlIs', (expectedPath: string) => {
  cy.url().should('eq', `${Cypress.config('baseUrl')}${expectedPath}`)
})

// Custom command to set local storage
Cypress.Commands.add('setLocalStorage', (key: string, value: string) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value)
  })
})

// Custom command to intercept the verificationCode api
Cypress.Commands.add(
  'interceptverificationCodeApi',
  (statusCode = 200, message = 'Signup email sent successfully') => {
    cy.intercept(
      {
        method: 'POST',
        url: '/auth/verificationCode'
      },
      {
        statusCode,
        body: {
          message
        }
      }
    ).as('verificationCode')
  }
)

// Custom command to intercept the verifyResetToken api
Cypress.Commands.add(
  'interceptVerifyResetTokenApi',
  (statusCode = 200, email = 'test-user@example.com') => {
    cy.intercept(
      {
        method: 'GET',
        url: '/auth/password/reset/token/verify*'
      },
      {
        statusCode,
        body: {
          email
        }
      }
    ).as('verifyResetToken')
  }
)

Cypress.Commands.add('getApplicationIdFromUrl', () => {
  cy.url().then((url) => {
    const parts = url.split('/')
    const applicationId = parts[parts.length - 1]
    return cy.wrap(applicationId)
  })
})
