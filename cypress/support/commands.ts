import { selectors } from './selectors';
import * as orderFixture from '../fixtures/order.json';

// Реализация пользовательских команд
Cypress.Commands.add('addIngredient', (type: 'bun' | 'main' | 'sauce') => {
  const key =
    `ingredient${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof selectors; //Формирования ключа для поиска селектора
  const selector = selectors[key];
  cy.get(selector).first().find('button').contains('Добавить').click();
});

Cypress.Commands.add('openIngredientModal', () => {
  cy.get(selectors.ingredientBun).first().click();
  cy.get(selectors.modalData).should('be.visible');
});

Cypress.Commands.add(
  'closeModal',
  (method: 'button' | 'overlay' | 'escape') => {
    if (method === 'button') {
      cy.get(selectors.modalCloseButton).click();
    } else if (method === 'overlay') {
      cy.get(selectors.modalOverlay).click({ force: true });
    } else if (method === 'escape') {
      cy.get('body').type('{esc}');
    }
    cy.get(selectors.modalData).should('not.exist');
  }
);

Cypress.Commands.add('createOrder', () => {
  cy.get(selectors.burgerConstructorButton).click();
  cy.get(selectors.modalData).should('be.visible');
  cy.get(selectors.modalData)
    .find('h2')
    .first()
    .should('have.text', String(orderFixture.order.number));
  cy.get(selectors.modalCloseButton).click();
  cy.get(selectors.modalData).should('not.exist');
});
