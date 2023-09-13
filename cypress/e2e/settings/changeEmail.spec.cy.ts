describe("Change Email", () => {
  before(() => {});
  beforeEach(() => {});

  it("creates user", () => {
    cy.task("createUser", {
      name: "Test User",
      email: "test-user@example.com",
    });
  });

  it("login and get access token", () => {
    cy.task("login").then(({ accessToken, refreshToken }: any) => {
      cy.setLocalStorage("accessToken", accessToken);
      cy.setLocalStorage("refreshToken", refreshToken);
      cy.setSessionStorage("userEmail", "test-user@example.com");
    });

    cy.visit("/homepage");

    cy.get("[data-cy=profile-photo]").click();

    cy.get("[data-cy=profile-and-settings-link]").click();

    cy.checkUrlIs("/userProfile");
    cy.get("[data-cy=user-email]").should("have.text", "test-user@example.com");

    cy.get("[data-cy=settings-button]").click();
    cy.get("[data-cy=change-email-option]").click();

    cy.interceptSendVerificationCodeApi();
  });

  it("should successfully change user's email", () => {
    cy.get("[data-cy=verify-current-email-button]").click();
    cy.checkUrlIs("/verifyemail");

    cy.get("input[type=text]").type("123456");

    cy.get("button[data-cy=verify-button]").click();

    cy.get("input[name=email]").type("test-user-new@example.com");

    cy.get("[data-cy=verify-new-email-button]").click();
    cy.checkUrlIs("/verifyemail");

    cy.get("input[type=text]").type("123456");

    cy.get("button[data-cy=verify-button]").click();

    cy.get(".swal2-confirm").click();

    cy.checkUrlIs("/userProfile");

    cy.get("[data-cy=user-email]").should(
      "have.text",
      "test-user-new@example.com"
    );
  });
});
