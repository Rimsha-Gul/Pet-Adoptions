describe("Login Flow", () => {
  // Successful Login Case
  describe("Successful Login", () => {
    it("should login with valid credentials", () => {
      // Navigate to login page
      cy.visit("/");

      // Type username and password
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that we've been redirected to the homepage
      cy.url().should("include", "/homepage");
    });
  });

  describe("Unverified Email", () => {
    it("should go to verify email page when user exists but is not verified yet", () => {
      // Navigate to login page
      cy.visit("/");

      // Type username and password
      cy.get("input[name=email]").type("rimshagul@gmail.com");
      cy.get("input[name=password]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that we've been redirected to the verify email page
      cy.url().should("include", "/verifyemail");
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    it("should show an error message for invalid credentials", () => {
      // Navigate to login page
      cy.visit("/");

      // Type correct username and incorrect password
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("wrongPassword");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=credentials-error]").should("be.visible");
      cy.get("[data-cy=credentials-error]").should(
        "have.text",
        "Invalid credentials!"
      );
    });

    it("should show an error message when user does not exist", () => {
      // Navigate to login page
      cy.visit("/");

      // Type incorrect username and password
      cy.get("input[name=email]").type("nonExistentUser@gmail.com");
      cy.get("input[name=password]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "User not found.");
    });
  });

  // Form Validation Cases
  describe("Form Validations", () => {
    it("should show an error message when email field is empty", () => {
      // Navigate to login page
      cy.visit("/");

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
      // Navigate to login page
      cy.visit("/");

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
      // Navigate to login page
      cy.visit("/");

      // Type nothing, then click outside to blur the input
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").focus().blur();

      // Verify that an error message related to the email field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Password is required"
      );
    });

    it("should show an error message when password is less than 6 characters long", () => {
      // Navigate to login page
      cy.visit("/");

      // Type invalid email, then click outside to blur the input
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("12345");
      cy.get("input[name=password]").focus().blur();

      // Verify that an error message related to the email field is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Password should be at least 6 characters long"
      );
    });
  });

  // UI Behavior Cases
  describe("UI Behavior", () => {
    it('should show a loading indicator when "Login" button is clicked', () => {
      // Stub the API call to delay it, to test the loading state
      cy.intercept("POST", "/auth/login", {
        delayMs: 1000, // adding a delay
        body: {
          tokens: {
            accessToken: "fakeAccessToken",
            refreshToken: "fakeRefreshToken",
          },
        },
      });

      // Navigate to login page
      cy.visit("/");

      // Fill in valid email and password
      cy.get("input[name=email]").type("rimshagulc@gmail.com");
      cy.get("input[name=password]").type("123456");

      // Click login button
      cy.get("button[type=submit]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");
      // Check that the button is disabled
      cy.get('button[type="submit"]').should("be.disabled");

      // Check if the loading indicator disappears
      cy.get("[data-cy=loadingIcon]").should("not.exist");
    });

    it('should disable the "Login" button when the form is invalid', () => {
      // Navigate to login page
      cy.visit("/");

      // Empty form should disable button
      cy.get('button[type="submit"]').should("be.disabled");

      // Filling only one field should still disable button
      cy.get('input[name="email"]').type("rimshagulc@gmail.com");
      cy.get('button[type="submit"]').should("be.disabled");

      // Invalid email format should still disable button
      cy.get('input[name="email"]').clear().type("invalid-email");
      cy.get('button[type="submit"]').should("be.disabled");

      // Filling both fields correctly should enable button
      cy.get('input[name="email"]').clear().type("rimshagulc@gmail.com");
      cy.get('input[name="password"]').type("123456");
      cy.get('button[type="submit"]').should("not.be.disabled");
    });

    it('should toggle password visibility when clicking "Show password"', () => {
      // Navigate to the login page
      cy.visit("/");

      // Type a password into the password field
      cy.get('input[type="password"]').type("secretPassword");

      // Assert that the password is masked
      cy.get('input[name="password"]').should("have.attr", "type", "password");

      // Click the "Show password" checkbox
      cy.get('input[type="checkbox"]').click();

      // Assert that the password is visible
      cy.get('input[name="password"]').should("have.attr", "type", "text");
    });
  });

  // Navigation Cases
  describe("Navigation", () => {
    it("should navigate to the Signup page when clicking the Signup link", () => {
      // Visit the login page
      cy.visit("/");

      // Click the Signup link
      cy.contains("Signup").click();

      // Verify that the URL changes to /signup
      cy.url().should("include", "/signup");
    });

    it("should navigate to the Reset Password Request page when clicking the Forgot Password link", () => {
      // Visit the login page
      cy.visit("/");

      // Click the Signup link
      cy.contains("Forgot password?").click();

      // Verify that the URL changes to /resetPasswordRequest
      cy.url().should("include", "/resetPasswordRequest");
    });
  });
});
