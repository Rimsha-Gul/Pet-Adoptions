/// <reference types="cypress" />
import axios from "axios";
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
Cypress.Commands.add("checkUrlIs", (expectedPath: string) => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}${expectedPath}`);
});

// Custom command to set session storage
Cypress.Commands.add("setSessionStorage", (key: string, value: string) => {
  cy.window().then((win) => {
    win.sessionStorage.setItem(key, value);
  });
});

// Custom command to set local storage
Cypress.Commands.add("setLocalStorage", (key: string, value: string) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value);
  });
});

// Custom command to intercept the sendVerificationCode api
Cypress.Commands.add(
  "interceptSendVerificationCodeApi",
  (
    statusCode: number = 200,
    message: string = "Signup email sent successfully"
  ) => {
    cy.intercept(
      {
        method: "POST",
        url: "/auth/sendVerificationCode",
      },
      {
        statusCode,
        body: {
          message,
        },
      }
    ).as("sendVerificationCode");
  }
);

// Custom command to intercept the verifyResetToken api
Cypress.Commands.add(
  "interceptVerifyResetTokenApi",
  (statusCode: number = 200, email: string = "test-user@example.com") => {
    cy.intercept(
      {
        method: "GET",
        url: "/auth/verifyResetToken*",
      },
      {
        statusCode,
        body: {
          email,
        },
      }
    ).as("verifyResetToken");
  }
);

// Cypress.Commands.add("login", async () => {
//   await axios
//     .post("/auth/login", {
//       email: "test-user@example.com",
//       password: "123456",
//     })
//     .then((response) => {
//       expect(response.status).to.eq(200);

//       const { accessToken, refreshToken } = response.data.tokens; // Make sure to navigate through the response correctly

//       cy.setLocalStorage("accessToken", accessToken);
//       cy.setLocalStorage("refreshToken", refreshToken);
//       cy.setSessionStorage("userEmail", "test-user@example.com");

//       cy.visit("/homepage");
//     });
// });
