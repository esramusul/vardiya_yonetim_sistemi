const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  // Always capture videos during `cypress run`
  video: true,
  // Keep videos/screenshots from previous runs
  trashAssetsBeforeRuns: false,
  e2e: {
    specPattern: [
      "cypress/e2e/**/*.feature",
      "cypress/e2e/**/*.cy.{js,ts}"
    ],
    stepDefinitions: "cypress/e2e/step_definitions/**/*.{js,ts}", // 👈 EKLENDİ
    baseUrl: "http://localhost:5173",

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});
