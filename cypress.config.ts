import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    BURGER_API_URL: 'https://norma.nomoreparties.space/api',
  },
  e2e: {
    baseUrl: 'http://localhost:4000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 
    supportFile: 'cypress/support/e2e.ts',
  },
});
