describe("Signup Flow", () => {
  beforeEach(() => {
    // Navigate to signup page
    cy.visit("/signup");
  });

  // Successful Signup Case
  describe("Successful Signup", () => {
    it("should go to verify email page with valid credentials", () => {
      cy.task("db:clear");

      // Type email, username, password and confirm password
      cy.get("input[name=name]").type("Test User");
      cy.get("input[name=email]").type("test-user@example.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click signup button
      cy.get("button[type=submit]").click();

      // Verify email is stored in sessionStorage
      cy.window()
        .its("sessionStorage")
        .invoke("getItem", "userEmail")
        .should("eq", "test-user@example.com");

      // Verify that we've been redirected to the verify email page
      cy.checkUrlIs("/verifyemail");
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    it("should show an error message when user already exists", () => {
      cy.task("db:seed");
      // Stub the API call to simulate an error
      cy.intercept("POST", "/auth/signup", {
        statusCode: 409,
        body: { message: "User already exists" },
      });

      // Type existing user email, username, password and confirm password
      cy.get("input[name=name]").type("Test User");
      cy.get("input[name=email]").type("test-user@example.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Signup button
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

      // Type existing user email, username, password and confirm password
      cy.get("input[name=name]").type("Test User");
      cy.get("input[name=email]").type("uninvitedUser@example.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Signup button
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
      // Type nothing, then click outside to blur the input
      cy.get("input[name=name]").focus().blur();

      // Verify that an error message related to the name field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "Name is required");
    });

    it("should show an error message when name is less than 3 characters long", () => {
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

    it("should show an error message when password field is empty", () => {
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

    it("should show an error message when confirm password does not match with password", () => {
      // Type invalid email, then click outside to blur the input
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123457");
      cy.get("input[name=confirmPassword]").focus().blur();

      // Verify that an error message related to the confirmPassword field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Passwords do not match"
      );
    });
  });

  // UI Behavior Cases
  describe("UI Behavior", () => {
    it('should show a loading indicator when "Signup" button is clicked', () => {
      // Stub the API call to delay it, to test the loading state
      cy.intercept("POST", "/auth/signup", {
        delayMs: 1000, // adding a delay,
        statusCode: 200,
        body: {
          name: "Test User",
          email: "test-user@example.com",
        },
      });

      // Fill in valid email, username, password and confirm password
      cy.get("input[name=name]").type("Test User");
      cy.get("input[name=email]").type("test-user@example.com");
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click signup button
      cy.get("button[type=submit]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");
      // Check that the button is disabled
      cy.get('button[type="submit"]').should("be.disabled");

      // Check if the loading indicator disappears
      cy.get("[data-cy=loadingIcon]").should("not.exist");

      // Verify that we've been redirected to the verify email page
      cy.checkUrlIs("/verifyemail");
    });

    it('should toggle password visibility when clicking "Show password"', () => {
      // Type a password into the password field
      cy.get('input[name="password"]').type("secretPassword");
      cy.get('input[name="confirmPassword"]').type("secretPassword");

      // Assert that the password is masked
      cy.get('input[name="password"]').should("have.attr", "type", "password");
      cy.get('input[name="confirmPassword"]').should(
        "have.attr",
        "type",
        "password"
      );

      // Click the "Show password" checkbox
      cy.get('input[type="checkbox"]').click({ multiple: true });

      // Assert that the password is visible
      cy.get('input[name="password"]').should("have.attr", "type", "text");
      cy.get('input[name="confirmPassword"]').should(
        "have.attr",
        "type",
        "text"
      );
    });

    it('should disable the "Signup" button when the form is invalid', () => {
      // Empty form should disable button
      cy.get('button[type="submit"]').should("be.disabled");

      // Filling only one or two fields should still disable button
      cy.get('input[name="name"]').type("Test User");

      cy.get('input[name="email"]').type("test-user@example.com");
      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="password"]').type("123456");
      cy.get('button[type="submit"]').should("be.disabled");

      // Invalid email format should still disable button
      cy.get('input[name="email"]').clear().type("invalid-email");
      cy.get('button[type="submit"]').should("be.disabled");

      // Filling three fields correctly but mismatching passwords should still disable button
      cy.get('input[name="email"]').clear().type("test-user@example.com");
      cy.get('input[name="password"]').clear().type("123456");
      cy.get('input[name="confirmPassword"]').type("1234567"); // Mismatching password
      cy.get('button[type="submit"]').should("be.disabled");

      // Filling all four fields correctly should enable button
      cy.get('input[name="name"]').type("Test User");
      cy.get('input[name="email"]').clear().type("test-user@example.com");
      cy.get('input[name="password"]').clear().type("123456");
      cy.get('input[name="confirmPassword"]').clear().type("123456"); // Matching password
      cy.get('button[type="submit"]').should("not.be.disabled");
    });
  });

  // Navigation Cases
  describe("Navigation", () => {
    it("should navigate to the Login page when clicking the Login link", () => {
      // Click the Signup link
      cy.contains("Login").click();

      // Verify that the URL is exactly the login URL
      cy.checkUrlIs("/");
    });
  });
});
