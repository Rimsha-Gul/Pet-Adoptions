import '@testing-library/jest-dom'

jest.mock('../envConfig.ts', () => {
  return {
    __esModule: true,
    default: () => ({
      serverUrl: 'http://mock-url.com'
    })
  }
})
