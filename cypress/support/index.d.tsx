declare namespace Cypress {
  interface Chainable {
    addIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<void>;
    openIngredientModal(): Chainable<void>;
    closeModal(method: 'button' | 'overlay' | 'escape'): Chainable<void>;
    createOrder(): Chainable<void>;
  }
}
