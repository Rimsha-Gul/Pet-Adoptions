describe("Email Verification Flow", () => {
  // Successful Email verification Case
  describe("Successful Verification", () => {
    beforeEach(() => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-unverified-user@example.com");

      cy.task("seedDB");

      cy.interceptSendVerificationCodeApi();
    });

    afterEach(() => {
      // Verify tokens are stored in localStorage
      cy.window()
        .its("localStorage")
        .invoke("getItem", "accessToken")
        .should("exist");
      cy.window()
        .its("localStorage")
        .invoke("getItem", "refreshToken")
        .should("exist");

      // Verify OTP variable to be updated in localStorage
      cy.window()
        .its("sessionStorage")
        .invoke("getItem", "isOTPSent")
        .should("equal", "true");

      // Clear the database
      cy.task("clearDB");
    });

    it("should go to homepage after successful validation", () => {
      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Type the verification code
      cy.get("input[type=text]").type("123456");

      // Click Verify button
      cy.get("button[data-cy=verify-button]").click();

      // Assert that a loading indicator is visible
      cy.get("[data-cy=loadingIcon]").should("be.visible");

      // Verify that we've been redirected to the home page
      cy.checkUrlIs("/homepage");
    });

    it("should go to homepage after successful validation after resending code", () => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("remainingTime", "0");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Click Resend button
      cy.get("button[data-cy=resend-button]").click();

      // Type the verification code
      cy.get("input[type=text]").type("123456");

      // Click Verify button
      cy.get("button[data-cy=verify-button]").click();

      // Verify that we've been redirected to the home page
      cy.checkUrlIs("/homepage");
    });
  });

  // Error Cases
  describe("Error Handling", () => {
    beforeEach(() => {
      cy.task("seedDB");

      cy.interceptSendVerificationCodeApi();
    });

    afterEach(() => {
      // Clear the database
      cy.task("clearDB");
    });

    it("should show an error message when user does not exist", () => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "nonExistentUser@example.com");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Type the verification code
      cy.get("input[type=text]").type("123456");

      // Click Verify button
      cy.get("button[data-cy=verify-button]").click();

      // Verify that we've been redirected to the not found page
      cy.checkUrlIs("/pagenotfound");
    });

    it("should show an error message when user enters expired verification code", () => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-expired-code-user@example.com");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Type the verification code
      cy.get("input[type=text]").type("123456");

      // Click Verify button
      cy.get("button[data-cy=verify-button]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Verification code expired. Please request a new code."
      );
    });

    it("should show an error message when user enters incorrect verification code", () => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-unverified-user@example.com");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Type the verification code
      cy.get("input[type=text]").type("111111");

      // Click Verify button
      cy.get("button[data-cy=verify-button]").click();

      // Verify that an error message is displayed
      cy.get("[data-cy=error-message]").should("be.visible");
      cy.get("[data-cy=error-message]").should(
        "have.text",
        "Incorrect verification code"
      );
    });
  });

  // Input Restriction Cases
  describe("Input Verification", () => {
    beforeEach(() => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-unverified-user@example.com");

      cy.interceptSendVerificationCodeApi();

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");
    });

    it("should keep 'Verify' button disabled for less than 6 digits", () => {
      cy.get("input[type=text]").type("123");
      cy.get("button[data-cy=verify-button]").should("be.disabled");
    });

    it("should enable 'Verify' button for exactly 6 digits", () => {
      cy.get("input[type=text]").type("123456");
      cy.get("button[data-cy=verify-button]").should("not.be.disabled");
    });

    it("should not allow the user to enter more than 6 digits", () => {
      cy.get("input[type=text]").type("1234567");
      cy.get("input[type=text]").should("have.value", "123456"); // Checking that the value is still 6 digits
    });
  });

  // UI Behavior Cases
  describe("UI Behavior", () => {
    beforeEach(() => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-unverified-user@example.com");

      cy.interceptSendVerificationCodeApi();

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");
    });

    it("should keep 'Verify' button disabled initially", () => {
      cy.get("button[data-cy=verify-button]").should("be.disabled");
    });

    it("should update 'Verify' button state when deleting digits", () => {
      cy.get("input[type=text]").type("123456");
      cy.get("button[data-cy=verify-button]").should("not.be.disabled");
      cy.get("input[type=text]").type("{backspace}"); // Delete one digit
      cy.get("button[data-cy=verify-button]").should("be.disabled");
    });

    it("should persist timer state across page refresh", () => {
      // Wait for the timer to appear on the page
      cy.get("[data-cy=timer]").should("be.visible");

      // The timer starts at 60 seconds
      cy.get("[data-cy=timer]").should("contain", "60");

      // Wait for 5 seconds (Cypress will wait 5000ms)
      cy.wait(5000);

      // Check that the timer has reduced (less than or equal to 55)
      cy.get("[data-cy=timer]")
        .invoke("text")
        .then((textBefore) => {
          if (textBefore.match(/\d+/) !== null) {
            const timeBefore = parseInt(textBefore.match(/\d+/)![0], 10);

            // Refresh the page
            cy.reload();

            // Wait for the timer to appear again
            cy.get("[data-cy=timer]").should("be.visible");

            // Check that the timer is less than or equal to the time captured before the refresh
            cy.get("[data-cy=timer]")
              .invoke("text")
              .then((textAfter) => {
                const timeAfter = parseInt(textAfter.match(/\d+/)![0], 10);
                expect(timeAfter).to.be.at.most(timeBefore);
              });
          }
        });
    });
  });

  // Navigation Cases
  describe("Navigation", () => {
    it("should redirect the user to the login page if they are already verified, but not logged in", () => {
      // Set user's email in sessionStorage
      cy.setSessionStorage("userEmail", "test-user@example.com");

      cy.intercept(
        {
          method: "POST",
          url: "/auth/sendVerificationCode",
        },
        {
          statusCode: 422,
          body: {
            message: "User already verified",
          },
        }
      ).as("sendVerificationCode");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Wait for the API call to be made and intercepted
      cy.wait("@sendVerificationCode");

      // Expect to be redirected to the login page
      cy.checkUrlIs("/");
    });

    it("should redirect the user to not found page if they are not allowed to access it", () => {
      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Expect to be redirected to not found page
      cy.checkUrlIs("/pagenotfound");
    });
  });
});
