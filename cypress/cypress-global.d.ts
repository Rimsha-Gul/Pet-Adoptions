declare namespace Cypress {
  interface Chainable<Subject> {
    checkUrlIs(expectedPath: string): Chainable<void>;
    setSessionStorage(key: string, value: string): Chainable<void>;
    interceptSendVerificationCodeApi(
      statusCode?: number,
      message?: string
    ): Chainable<void>;
    interceptVerifyResetTokenApi(
      statusCode?: number,
      email?: string
    ): Chainable<void>;
  }
}
