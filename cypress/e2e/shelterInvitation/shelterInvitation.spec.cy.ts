describe("Invitation Acceptance", () => {
  after(() => {
    cy.task("deleteMany", {
      collection: "users",
      params: {
        email: {
          $in: ["admin-user@example.com", "test-shelter@example.com"],
        },
      },
    });
    cy.task("deleteMany", {
      collection: "invitations",
      params: {
        shelterEmail: "test-shelter@example.com",
      },
    });
  });

  it("login admin and send invitation to shelter", () => {
    cy.task("login", { email: "admin-user@example.com" }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage("accessToken", accessToken);
        cy.setLocalStorage("refreshToken", refreshToken);
        cy.setSessionStorage("userEmail", "admin-user@example.com");
      }
    );
    cy.visit("/homepage");

    cy.get("[data-cy=profile-photo]").click();
    cy.get("[data-cy=profile-and-settings-link]").click();
    cy.get("[data-cy=invite-a-shelter-button]").click();
    cy.get('input[type="email"]').type("test-shelter@example.com");
    cy.get('button[type="submit"]').click();
    cy.get(".swal2-confirm").click();
  });

  it("verifies the invitation token and takes shelter to signup page", () => {
    cy.intercept("POST", "/auth/sendVerificationCode").as("codeApiCall");
    cy.task("getInvitationToken", { email: "test-shelter@example.com" }).then(
      ({ invitationToken }: any) => {
        cy.log("inv tokennnnnnnnnnnnnnnn:", invitationToken);
        cy.visit(`/shelter/invitation/${invitationToken}/`);
      }
    );

    cy.get("input[name=name]").type("Test Shelter");
    cy.get("input[name=password]").type("123456");
    cy.get("input[name=confirmPassword]").type("123456");
    cy.get("button[type=submit]").click();

    cy.window()
      .its("localStorage")
      .invoke("getItem", "userEmail")
      .should("eq", "test-shelter@example.com");

    cy.checkUrlIs("/verifyemail");
    cy.wait("@codeApiCall");
    cy.task("getVerificationCode", { email: "test-shelter@example.com" }).then(
      ({ verificationCode }: any) => {
        cy.get("input[type=text]").type(`${verificationCode}`);
        cy.get("button[data-cy=verify-button]").click();
        cy.checkUrlIs("/homepage");
      }
    );
  });
});
