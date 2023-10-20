declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    checkUrlIs(expectedPath: string): Chainable<void>
    setLocalStorage(key: string, value: string): Chainable<void>
    interceptverificationCodeApi(
      statusCode?: number,
      message?: string
    ): Chainable<void>
    interceptVerifyResetTokenApi(
      statusCode?: number,
      email?: string
    ): Chainable<void>
    getApplicationIdFromUrl(): Chainable<void>
  }
}
