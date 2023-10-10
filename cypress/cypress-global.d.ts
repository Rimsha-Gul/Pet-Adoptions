declare namespace Cypress {
  interface Chainable<Subject> {
    checkUrlIs(expectedPath: string): Chainable<void>;
    setSessionStorage(key: string, value: string): Chainable<void>;
    setLocalStorage(key: string, value: string): Chainable<void>;
    interceptverificationCodeApi(
      statusCode?: number,
      message?: string
    ): Chainable<void>;
    interceptVerifyResetTokenApi(
      statusCode?: number,
      email?: string
    ): Chainable<void>;
    getApplicationIdFromUrl(): Chainable<void>;
  }
}
