describe("Pets Display Flow", () => {
  // Pets Display Cases
  describe("Grid Display", () => {
    before(() => {
      cy.task("db:seed");
      // Perform login via API
      cy.request({
        method: "POST",
        url: "http://localhost:8080/auth/login",
        body: {
          email: "test-user@example.com",
          password: "123456",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        // Save tokens in local storage
        const { accessToken, refreshToken } = response.body.tokens;
        cy.setLocalStorage("accessToken", accessToken);
        cy.setLocalStorage("refreshToken", refreshToken);

        // Save user email in session storage
        cy.setLocalStorage("userEmail", "test-user@example.com");
      });

      cy.task("db:seedPets");

      // Navigate to login page
      cy.visit("/homepage");
    });

    it("should display the pet grid", () => {
      cy.get("[data-cy=pet-grid]").should("exist");
    });

    it("should display pet cards within the grid", () => {
      cy.get("[data-cy=pet-grid]")
        .find("[data-cy=pet-card]")
        .should("have.length.greaterThan", 0);
    });
  });
});
