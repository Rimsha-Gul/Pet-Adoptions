declare namespace Cypress {
  interface Chainable<Subject> {
    checkUrlIs(expectedPath: string): Chainable<void>;
  }
}
