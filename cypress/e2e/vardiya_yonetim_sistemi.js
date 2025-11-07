const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

const BASE_URL = Cypress.config("baseUrl") || "http://localhost:3000";

function selectFirstOptionByExactText(selector, text) {
  cy.get(selector).then(($select) => {
    const el = $select[0];
    const options = Array.from(el.options || []);
    const matches = options.filter((o) => (o.text || '').trim() === text);
    expect(matches.length, `option with text '${text}'`).to.be.greaterThan(0);
    const chosen = matches[matches.length - 1];
    cy.wrap($select).select(chosen.value);
  });
}

Given("vardiya yönetim sayfasındayım", () => {
  cy.visit(BASE_URL + "/shifts");
});

When('{string} e-posta ve {string} şifre ile giriş yaparım', (email, password) => {
  cy.intercept('POST', '/api/v1/auth/login').as('login');
  cy.get('[data-test="login-email"]').clear().type(email);
  cy.get('[data-test="login-password"]').clear().type(password);
  cy.get('[data-test="login-submit"]').click();
  cy.wait('@login');
});

Then("sistemde oturum açmış olmalıyım", () => {
  cy.window().its('localStorage').invoke('getItem', 'authToken').should('exist');
});

Then('sayfa başlığı {string} görünmelidir', (title) => {
  cy.contains("h1", title).should("be.visible");
});

When('{string} departmanını oluştururum', (depName) => {
  cy.get('[data-test="department-name"]').clear().type(depName);
  cy.get('[data-test="department-submit"]').click();
});

Then('departman listesinde {string} görünmelidir', (depName) => {
  cy.get('[data-test="department-list"]').contains(depName).should("be.visible");
});

When('departman {string} için {string} çalışanını oluştururum', (depName, empName) => {
  selectFirstOptionByExactText('[data-test="employee-department"]', depName);
  cy.get('[data-test="employee-name"]').clear().type(empName);
  cy.get('[data-test="employee-submit"]').click();
});

Then('çalışan listesinde {string} görünmelidir', (empName) => {
  cy.get('[data-test="employee-list"]').contains(empName).should("be.visible");
});

When('{string} vardiya şablonunu {string} ve {string} saatleriyle oluştururum', (shiftName, start, end) => {
  cy.get('[data-test="shift-template-name"]').clear().type(shiftName);
  cy.get('[data-test="shift-template-start"]').clear().type(start);
  cy.get('[data-test="shift-template-end"]').clear().type(end);
  cy.get('[data-test="shift-template-submit"]').click();
});

Then('vardiya şablonları listesinde {string} görünmelidir', (shiftName) => {
  cy.get('[data-test="shift-template-list"]').contains(shiftName).should("be.visible");
});

When('{string} çalışanına {string} şablonunu {string} tarihi için atarım', (empName, shiftName, date) => {
  selectFirstOptionByExactText('[data-test="assignment-employee"]', empName);
  selectFirstOptionByExactText('[data-test="assignment-shift-template"]', shiftName);
  cy.get('[data-test="assignment-date"]').type(date);
  cy.get('[data-test="assignment-submit"]').click();
});

Then('{string} çalışanının {string} tarihli vardiyasında {string} görünmelidir', (empName, date, shiftName) => {
  cy.get('[data-test="assignment-list"]')
    .contains(empName)
    .parent()
    .should("contain", date)
    .and("contain", shiftName);
});
