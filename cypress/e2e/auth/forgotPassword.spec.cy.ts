describe("Forgot Password Flow", () => {
  beforeEach(() => {
    // Navigate to reset password page
    cy.visit("/resetPasswordRequest");
  });

  // Successful Reset Password Request Case
  describe("Successful Reset Password Request", () => {
    it("should successfully send reset password request", () => {
      cy.task("db:seed");

      // Type user email
      cy.get("input[name=email]").type("test-user@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Verify success message using SweetAlert's classes
      cy.get(".swal2-title").should("have.text", "Success!");
      cy.get(".swal2-html-container").should(
        "have.text",
        "Please check your email inbox for a link to complete the reset."
      );

      // Click OK button on the success alert
      cy.get(".swal2-confirm").click();
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    it("should show an error message when user does not exist", () => {
      // Type user email
      cy.get("input[name=email]").type("nonExistentUser@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "User not found.");
    });

    it("should show an error message when there is error in creating request", () => {
      cy.intercept(
        {
          method: "POST",
          url: "/auth/requestPasswordReset",
        },
        {
          statusCode: 500,
          body: {
            message: "Error sending reset password email",
          },
        }
      ).as("requestPasswordReset");

      // Type user email
      cy.get("input[name=email]").type("test-user@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Error sending reset password email"
      );
    });
  });
});
