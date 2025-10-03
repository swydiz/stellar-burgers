export interface Selectors {
  ingredientBun: string;
  ingredientMain: string;
  ingredientSauce: string;
  burgerConstructorSection: string;
  burgerConstructorButton: string;
  modalData: string;
  modalCloseButton: string;
  modalOverlay: string;
}

export const selectors: Selectors = {
  ingredientBun: '[data-cy="ingredient-bun"]',
  ingredientMain: '[data-cy="ingredient-main"]',
  ingredientSauce: '[data-cy="ingredient-sauce"]',
  burgerConstructorSection: '[data-cy="burger-constructor-section"]',
  burgerConstructorButton: '[data-cy="burger-constructor-button"]',
  modalData: '[data-cy="modal-data"]',
  modalCloseButton: '[data-cy="modal-data"] button:first',
  modalOverlay: '[data-cy="modal-data"] + div'
};
