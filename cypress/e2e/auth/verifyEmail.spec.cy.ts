describe("Email Verification Flow", () => {
  // Successful Signup Case
  describe("Successful Verification", () => {
    it("should go to homepage after successful validation", () => {
      // Set user's email in sessionStorage
      cy.window().then((win) => {
        win.sessionStorage.setItem("userEmail", "test-user@example.com");
      });

      cy.task("db:seed");

      cy.intercept(
        {
          method: "POST",
          url: "/auth/sendVerificationCode",
        },
        {
          body: {
            code: 200,
            message: "Signup email sent successfully",
          },
        }
      ).as("sendVerificationCode");

      // Navigate to verifyEmail page
      cy.visit("/verifyemail");

      // Type the verification code
      cy.get("input[type=text]").type("123456");

      // Click verify button
      cy.get("button[data-cy=verify-button]").click();

      // Verify that we've been redirected to the home page
      cy.checkUrlIs("/homepage");
    });
  });
});
