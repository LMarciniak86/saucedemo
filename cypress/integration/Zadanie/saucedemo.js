/// <reference types="cypress" />


describe('www.saucedemo.com tests', () => {
    beforeEach(() => {

        cy.visit('https://www.saucedemo.com/')
        cy.request('https://www.saucedemo.com/')
            .should((response) => {
                expect(response.status).to.eq(200)
            })
    })

    it('Login form validation', () => {
        
        cy.get('form').submit().should('text', 'Epic sadface: Username is required')
        cy.get('[data-icon="times-circle"]').as('errorIcon')
        cy.get('@errorIcon').should('be.visible')
    })

    const userName = "standard_user"
    const password = "secret_sauce"

    beforeEach(() => {

        cy.get('form').find('input:first-child').as('loginField')
        cy.get('input[id="password"]').as('passwordField')
        cy.get('#login-button').as('loginButton')
    })

    it('Success Login', () => {
        
        cy.get('@loginField').type(userName).should('have.value', 'standard_user')
        cy.get('@passwordField').type(password).should('have.value', 'secret_sauce')
        cy.get('@loginButton').should('be.enabled').click()
       
        cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
        cy.get('.header_secondary_container').as('loggedPage')
        cy.get('@loggedPage').should('be.visible')
    })

    it('Success Order', () => {
        
        cy.get('@loginField').type(userName)
        cy.get('@passwordField').type(password)
        cy.get('@loginButton').click()
        
        cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
        cy.get('path').as('loggedUserCart')
        cy.get('@loggedUserCart').should('be.visible')

        cy.get(':nth-child(1)').contains('Sauce Labs Backpack')
        cy.get(':nth-child(1) > .pricebar > .btn_primary').click().should('have.text', 'REMOVE')
        cy.get('.fa-layers-counter').as('inCart')
        cy.get('@inCart').should('have.text', '1').and('be.visible')
        cy.get('path').click()

        cy.url().should('include', '/cart.html')

        cy.get('.cart_item').as('cart')
        cy.get('.inventory_item_price').as('price')

        cy.get('@cart').contains('Sauce Labs Backpack')
        cy.get('@price').should('be.visible')
        cy.get('.checkout_button').click()

        cy.url().should('eq', 'https://www.saucedemo.com/checkout-step-one.html')
        cy.get('form').find('input').should('have.id', 'first-name', 'last-name', 'postal-code')

        cy.get('[id="first-name"]').as('firstName')
        cy.get('[id="last-name"]').as('lastName')
        cy.get('[id="postal-code"]').as('postalCode')
        cy.get('.btn_primary').as('continueButton')

        cy.get('@firstName').type('first')
        cy.get('@lastName').type('last')
        cy.get('@postalCode').type('000')
        cy.get('@continueButton').click()

        cy.url().should('include', '/checkout-step-two.htm')
        cy.get('.cart_button').as('finishButton')
        cy.get('@finishButton').click()

        cy.url().should('eq', 'https://www.saucedemo.com/checkout-complete.html')
        cy.get('.complete-header').should('have.text', 'THANK YOU FOR YOUR ORDER')
    })
})