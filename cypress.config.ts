import dotenv from 'dotenv'
dotenv.config()

import { defineConfig } from 'cypress'
import { plugins } from './cypress/e2e/plugins/tasks'

export default defineConfig({
  numTestsKeptInMemory: 100,
  e2e: {
    baseUrl: 'http:/localhost:5173',
    setupNodeEvents: plugins
  }
})
