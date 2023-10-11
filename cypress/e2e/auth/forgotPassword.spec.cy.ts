describe("Forgot Password Flow", () => {
  beforeEach(() => {
    // Navigate to reset password page
    cy.visit("/resetPasswordRequest");
  });

  // Successful Reset Password Request Case
  describe("Successful Reset Password Request", () => {
    it("should successfully send reset password request", () => {
      // Seed the database with initial data
      cy.task("seedDB");

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

      // Clear the database
      cy.task("clearDB");
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    it("should show an error message when user does not exist", () => {
      // Seed the database with initial data
      cy.task("seedDB");

      // Type user email
      cy.get("input[name=email]").type("nonExistentUser@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "User not found.");

      // Clear the database
      cy.task("clearDB");
    });

    it("should show an error message when there is error in creating request", () => {
      cy.intercept(
        {
          method: "POST",
          url: "/auth/password/reset/request",
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

  // Input Restriction Cases
  describe("Input Verification", () => {
    it("should show an error message when email field is empty", () => {
      // Type nothing, then click outside to blur the input
      cy.get("input[name=email]").focus().blur();

      // Verify that an error message related to the email field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Email is required"
      );
    });

    it("should show an error message when email is invalid", () => {
      // Type invalid email, then click outside to blur the input
      cy.get("input[name=email]").type("test-user");
      cy.get("input[name=email]").focus().blur();

      // Verify that an error message related to the email field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Invalid email format"
      );
    });
  });

  // UI Behavior Cases
  describe("UI Behavior", () => {
    it('should show a loading indicator when "Request" button is clicked', () => {
      // Fill in valid email
      cy.get("input[name=email]").type("test-user@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");

      // Check that the button is disabled
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it('should enable email input and "Request" button 5 minutes after the request is made', () => {
      // Seed the database with initial data
      cy.task("seedDB");

      // Initialize the clock to control time behavior
      cy.clock();

      // Fill in valid email
      cy.get("input[name=email]").type("test-user@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");

      // Check that the button is disabled
      cy.get('button[type="submit"]').should("be.disabled");

      // Check that the email field is read-only
      cy.get("input[name=email]").should("have.attr", "readonly");

      // Click OK button on the success alert
      cy.get(".swal2-confirm").click();

      // Advance the clock by 5 minutes (300000 milliseconds)
      cy.tick(300000);

      // Button should be enabled again
      cy.get('button[type="submit"]').should("not.be.disabled");

      // Check that the email field is read-only
      cy.get("input[name=email]").should("not.have.attr", "readonly");

      // Clear the database
      cy.task("clearDB");
    });
  });
});
