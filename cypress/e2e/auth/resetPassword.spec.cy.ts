describe("Reset Password Flow", () => {
  // Successful Reset Password Case
  describe("Successful Reset Password", () => {
    it("should successfully reset password", () => {
      // Navigate to reset password page
      cy.visit("/resetPasswordRequest");

      // Seed the database with initial data
      cy.task("db:seed");

      // Type user email
      cy.get("input[name=email]").type("test-user@example.com");

      // Click Request button
      cy.get("button[type=submit]").click();

      // Click OK button on the success alert
      cy.get(".swal2-confirm").click();

      cy.task("db:getResetToken").then((resetToken) => {
        // Navigate to the reset password page and use the token
        cy.visit(`/resetPassword/${resetToken}/`);

        // Fill in valid password and confirm password
        cy.get("input[name=password]").type("123456");
        cy.get("input[name=confirmPassword]").type("123456");

        // Click Reset Password button
        cy.get("button[type=submit]").click();

        // Verify success message using SweetAlert's classes
        cy.get(".swal2-title").should("have.text", "Success!");
        cy.get(".swal2-html-container").should(
          "have.text",
          "Password reset successfully"
        );

        // Click OK button on the success alert
        cy.get(".swal2-confirm").click();

        // Verify that we've been redirected to the login page
        cy.checkUrlIs("/");

        // Clear the database
        cy.task("db:clear");
      });
    });
  });

  // Error Cases
  describe("Error Handling in Verifying Reset Password Token", () => {
    it("should show an error message when user does not exist", () => {
      cy.intercept(
        {
          method: "GET",
          url: "/auth/verifyResetToken*",
        },
        {
          statusCode: 404,
          body: {
            message: "User not found",
          },
        }
      ).as("verifyResetToken");

      cy.visit("/resetPassword/invalidResetToken/");

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "User not found");
    });

    it("should show an error message when token is invalid or expired", () => {
      cy.intercept(
        {
          method: "GET",
          url: "/auth/verifyResetToken",
        },
        {
          statusCode: 400,
          body: {
            message: "Invalid or expired reset token",
          },
        }
      ).as("verifyResetToken");

      cy.visit("/resetPassword/invalidResetToken/");

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Your password reset token is invalid or has expired. Please request a new one."
      );
    });

    it("should show an error message when there is an error verifying the token", () => {
      cy.intercept(
        {
          method: "GET",
          url: "/auth/verifyResetToken*",
        },
        {
          statusCode: 500,
          body: {
            message: "Internal server error",
          },
        }
      ).as("verifyResetToken");

      cy.visit("/resetPassword/invalidResetToken/");

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Internal server error"
      );
    });
  });

  // Form Validation Cases
  describe("Form Validations", () => {
    beforeEach(() => {
      cy.interceptVerifyResetTokenApi();

      // Navigate to reset password page
      cy.visit("/resetPassword/resetToken");
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

    it("should keep 'Reset Password' button disabled till form is valid", () => {
      cy.get('button[type="submit"]').should("be.disabled");

      cy.get("input[name=password]").type("123456");
      cy.get('button[type="submit"]').should("be.disabled");

      cy.get("input[name=confirmPassword]").type("123456");
      cy.get('button[type="submit"]').should("not.be.disabled");
    });
  });

  // UI Behavior Cases
  describe("UI Behavior", () => {
    beforeEach(() => {
      cy.interceptVerifyResetTokenApi();

      // Navigate to reset password page
      cy.visit("/resetPassword/resetToken");
    });

    it('should show a loading indicator when "Reset Password" button is clicked', () => {
      // Stub the API call to delay it, to test the loading state
      cy.intercept("PUT", "/auth/resetPassword", {
        delayMs: 1000, // adding a delay,
        statusCode: 200,
        body: {
          message: "Password reset successfully",
        },
      });

      // Fill in valid password and confirm password
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Reset Password button
      cy.get("button[type=submit]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");
      // Check that the button is disabled
      cy.get('button[type="submit"]').should("be.disabled");

      // Check if the loading indicator disappears
      cy.get("[data-cy=loadingIcon]").should("not.exist");

      // Click OK button on the success alert
      cy.get(".swal2-confirm").click();

      // Verify that we've been redirected to the login page
      cy.checkUrlIs("/");
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
  });

  // Error Cases
  describe("Error Handling in Reset Password", () => {
    beforeEach(() => {
      cy.interceptVerifyResetTokenApi();

      // Navigate to reset password page
      cy.visit("/resetPassword/resetToken");
    });

    it("should show an error message when user does not exist", () => {
      cy.intercept(
        {
          method: "PUT",
          url: "/auth/resetPassword*",
        },
        (req) => {
          req.body.email = "nonExistentUser@example.com";
        }
      ).as("resetPassword");

      // Fill in valid password and confirm password
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Reset Password button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should("have.text", "User not found");
    });

    it("should show an error message when user has not requested password reset", () => {
      // Seed the database with initial data
      cy.task("db:seed");

      cy.intercept(
        {
          method: "PUT",
          url: "/auth/resetPassword*",
        },
        (req) => {
          req.body.email = "test-user@example.com";
        }
      ).as("resetPassword");

      // Fill in valid password and confirm password
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Reset Password button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "No password reset token found"
      );

      // Clear the database
      cy.task("db:clear");
    });

    it("should show an error message when reset token expires before user resets the password", () => {
      cy.intercept(
        {
          method: "PUT",
          url: "/auth/resetPassword*",
        },
        {
          statusCode: 400,
          body: "Invalid or expired reset token.",
        }
      ).as("resetPassword");

      // Fill in valid password and confirm password
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Reset Password button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Invalid or expired reset token."
      );
    });

    it("should show an error message when there is an error resetting the password", () => {
      cy.intercept(
        {
          method: "PUT",
          url: "/auth/resetPassword*",
        },
        {
          statusCode: 500,
          body: "Internal server error",
        }
      ).as("resetPassword");

      // Fill in valid password and confirm password
      cy.get("input[name=password]").type("123456");
      cy.get("input[name=confirmPassword]").type("123456");

      // Click Reset Password button
      cy.get("button[type=submit]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Internal server error"
      );
    });
  });
});
