describe("Signup Flow", () => {
  // Successful Login Case
  describe("Successful Login", () => {
    it("should go to verify email page with valid credentials", () => {
      cy.intercept("POST", "/auth/signup", {
        body: {
          name: "Rimsha Gul",
          email: "rimshagulc@gmail.com",
        },
        statusCode: 200,
      }).as("apiSignup");

      // Navigate to signup page
      cy.visit("/signup");

      // Type email, username, password and confirm password
      cy.get("input[name=name]").type("Rimsha Gul");
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click signup button
      cy.get("button[type=submit]").click();

      // Wait for the stubbed request to resolve
      cy.wait("@apiSignup");

      // Verify that we've been redirected to the verify email page
      cy.url().should("include", "/verifyemail");
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    it("should show an error message when user already exists", () => {
      // Stub the API call to simulate an error
      cy.intercept("POST", "/auth/signup", {
        statusCode: 409,
        body: { message: "User already exists" },
      });

      // Navigate to signup page
      cy.visit("/signup");

      // Type existing user email, username, password and confirm password
      cy.get("input[name=name]").type("Rimsha Gul");
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "User already exists."
      );
    });

    it("should show an error message when user signs up as shelter but was not invited", () => {
      // Stub the API call to simulate an error
      cy.intercept("POST", "/auth/signup", (req) => {
        // Set role to 'SHELTER'
        req.body.role = "SHELTER";

        req.reply({
          statusCode: 400,
          body: { message: "Invalid invitation" },
        });
      });

      // Navigate to signup page
      cy.visit("/signup");

      // Type existing user email, username, password and confirm password
      cy.get("input[name=name]").type("Rimsha Gul");
      cy.get("input[name=email]").type("uninvitedUser@test.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=credentials-error]").should("be.visible");
      cy.get("[data-cy=credentials-error]").should(
        "have.text",
        "Invalid invitation"
      );
    });
  });

  // Form Validation Cases
  describe("Form Validations", () => {
    it("should show an error message when name field is empty", () => {
      // Navigate to login page
      cy.visit("/signup");

      // Type nothing, then click outside to blur the input
      cy.get("input[name=name]").focus().blur();

      // Verify that an error message related to the name field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "Name is required");
    });

    it("should show an error message when name is less than 3 characters long", () => {
      // Navigate to signup page
      cy.visit("/signup");

      // Type invalid email, then click outside to blur the input
      cy.get("input[name=name]").type("Te");
      cy.get("input[name=name]").focus().blur();

      // Verify that an error message related to the name field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Name should be at least 3 characters long"
      );
    });

    it("should show an error message when email field is empty", () => {
      // Navigate to signup page
      cy.visit("/signup");

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
      // Navigate to signup page
      cy.visit("/signup");

      // Type invalid email, then click outside to blur the input
      cy.get("input[name=email]").type("rimshagul");
      cy.get("input[name=email]").focus().blur();

      // Verify that an error message related to the email field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Invalid email format"
      );
    });

    it("should show an error message when password field is empty", () => {
      // Navigate to signup page
      cy.visit("/signup");

      // Type nothing, then click outside to blur the input
      cy.get("input[name=password]").focus().blur();

      // Verify that an error message related to the password field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Password is required"
      );
    });

    it("should show an error message when password is less than 6 characters long", () => {
      // Navigate to signup page
      cy.visit("/signup");

      // Type invalid email, then click outside to blur the input
      cy.get("input[name=password]").type("12345");
      cy.get("input[name=password]").focus().blur();

      // Verify that an error message related to the password field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Password should be at least 6 characters long"
      );
    });

    it("should show an error message when confirm password field is empty", () => {
      // Navigate to signup page
      cy.visit("/signup");

      // Type nothing, then click outside to blur the input
      cy.get("input[name=confirmPassword]").focus().blur();

      // Verify that an error message related to the confirmPassword field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Confirm password is required"
      );
    });

    it("should show an error message when confirm password is less than 6 characters long", () => {
      // Navigate to signup page
      cy.visit("/signup");

      // Type invalid email, then click outside to blur the input
      cy.get("input[name=confirmPassword]").type("12345");
      cy.get("input[name=confirmPassword]").focus().blur();

      // Verify that an error message related to the confirmPassword field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Password should be at least 6 characters long"
      );
    });
  });
});
