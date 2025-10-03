import { selectors } from '../support/selectors';

describe('E2E тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Устанавливаем фейковые токены авторизации
    cy.setCookie('accessToken', 'fakeAccessToken');
    localStorage.setItem('refreshToken', 'fakeRefreshToken');

    // Перехват запросов
   cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user' }).as('getUser');
    cy.intercept('POST', '/api/orders', { fixture: 'order' }).as('createOrder');

    // Переход на главную страницу и ожидание загрузки данных
    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    // Очистка токенов
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Проверка наличия ингредиентов', () => {
    it('Ингредиенты загружены и доступны для выбора', () => {
      cy.get(selectors.ingredientBun).should('have.length.at.least', 1);
      cy.get(selectors.ingredientMain).should('have.length.at.least', 1);
      cy.get(selectors.ingredientSauce).should('have.length.at.least', 1);
    });
  });

  describe('Проверка конструктора бургеров', () => {
    it('Добавление ингредиентов в конструктор', () => {
      // Проверяем, что конструктор пуст и кнопка изначально отключена
      cy.get(selectors.burgerConstructorSection)
        .find('.constructor-element__text')
        .should('have.length', 0);
      cy.get(selectors.burgerConstructorButton).should('be.disabled');

      // Добавляем булку
      cy.addIngredient('bun').then(() => {
        cy.wait('@getIngredients'); // Синхронизация вместо фиксированного таймаута
        cy.get(selectors.burgerConstructorSection)
          .find('.constructor-element__text')
          .as('constructorElements'); // Регистрируем алиас
        cy.get('@constructorElements')
          .contains('Краторная булка N-200i (верх)')
          .should('exist');
        cy.get('@constructorElements')
          .contains('Краторная булка N-200i (низ)')
          .should('exist');
        cy.get(selectors.burgerConstructorButton).should('be.enabled');
      });

      // Добавляем начинку
      cy.addIngredient('main').then(() => {
        cy.wait('@getIngredients');
        cy.get('@constructorElements')
          .contains('Биокотлета из марсианской Магнолии')
          .should('exist');
        cy.get(selectors.burgerConstructorButton).should('be.enabled');
      });

      // Добавляем соус
      cy.addIngredient('sauce').then(() => {
        cy.wait('@getIngredients');
        cy.get('@constructorElements')
          .contains('Соус с шипами Антарианского плоскоходца')
          .should('exist');
        cy.get(selectors.burgerConstructorButton).should('be.enabled');
      });
    });
  });

  describe('Проверка работы модальных окон', () => {
    describe('Проверка открытия', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.get(selectors.ingredientBun)
          .first()
          .as('selectedIngredient')
          .click();

        cy.get(selectors.modalData).should('be.visible');

        // Проверяем, что отображается имя выбранного ингредиента
        cy.get('@selectedIngredient').then(
          ($ingredient: JQuery<HTMLElement>) => {
            const ingredientName = $ingredient
              .find('[data-cy="ingredient-name"]')
              .text();
            cy.log('Extracted ingredientName:', ingredientName);
            expect(ingredientName).to.not.be.empty;
            cy.get(selectors.modalData)
              .find('[data-cy="modal-ingredient-name"]')
              .should('have.text', ingredientName);
          }
        );
      });

      it('Модальное окно открыто после перезагрузки страницы', () => {
        cy.openIngredientModal();
        cy.reload(true);
        cy.get(selectors.modalData).should('be.visible');
      });
    });

    describe('Проверка закрытия', () => {
      it('По клику на крестик', () => {
        cy.openIngredientModal();
        cy.closeModal('button');
        cy.get(selectors.modalData).should('not.exist');
      });

      it('По клику на оверлей', () => {
        cy.openIngredientModal();
        cy.closeModal('overlay');
        cy.get(selectors.modalData).should('not.exist');
      });

      it('По клику на Escape', () => {
        cy.openIngredientModal();
        cy.closeModal('escape');
        cy.get(selectors.modalData).should('not.exist');
      });
    });
  });

  describe('Проверка создания заказа', () => {
    it('Создание заказа', () => {
      // Добавляем ингредиенты
      cy.addIngredient('bun');
      cy.addIngredient('main');
      cy.get(selectors.burgerConstructorButton).should('be.enabled');

      cy.get(selectors.burgerConstructorButton).click();
      cy.wait('@createOrder').then((interception: Cypress.ObjectLike) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200); // Проверяем статус ответа
        }
        cy.get(selectors.modalData).should('be.visible');
        cy.get(selectors.modalData).find('[data-cy="order-number"]');
        cy.closeModal('button');
        cy.get(selectors.modalData).should('not.exist');
        cy.get(selectors.burgerConstructorSection)
          .find('.constructor-element__text')
          .should('have.length', 0);
      });
    });
  });
});
