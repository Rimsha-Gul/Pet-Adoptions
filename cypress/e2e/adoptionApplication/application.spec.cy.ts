import { petData } from "../../fixtures/addingPet/petData";

describe("Adoption Application Approval", () => {
  after(() => {
    cy.task("deleteMany", {
      collection: "users",
      params: {
        email: {
          $in: [
            "admin-user@example.com",
            "test-shelter@example.com",
            "test-user@example.com",
          ],
        },
      },
    });
    cy.task("deleteMany", {
      collection: "pets",
      params: { microchipID: "A123456789" },
    });
    cy.task("deleteMany", {
      collection: "applications",
      params: {
        microchipID: "A123456789",
        applicantEmail: "test-user@example.com",
      },
    });
  });

  it("creates shelter", () => {
    cy.task("createUser", {
      role: "SHELTER",
      name: "Test Shelter",
      email: "test-shelter@example.com",
    });
  });

  it("login shelter and add pet", () => {
    cy.task("login", { email: "test-shelter@example.com" });
    cy.task("getAccessToken", { email: "test-shelter@example.com" }).then(
      (accessToken) => {
        cy.task("addPet", {
          accessToken: accessToken,
          petData: petData,
        });
      }
    );
  });

  it("creates user", () => {
    cy.task("createUser", {
      role: "USER",
      name: "Test User",
      email: "test-user@example.com",
    });
  });

  it("login user and apply for a pet", () => {
    cy.task("login", { email: "test-user@example.com" }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage("accessToken", accessToken);
        cy.setLocalStorage("refreshToken", refreshToken);
        cy.setSessionStorage("userEmail", "test-user@example.com");
      }
    );
    cy.visit("/homepage");

    cy.get("[data-cy=pet-grid]").find("[data-cy=pet-card]").click();
    cy.get("[data-cy=application-button]").click();

    cy.get("#residenceType").click();
    cy.get('[id="react-select-5-listbox"]').contains("Own a house").click();
    cy.get("input[name=petAloneTime]").type("1");
    cy.contains("Do you have a fenced yard or nearby parks for playtime?")
      .parent()
      .find(".react-switch")
      .click();
    cy.get("textarea[name=petActivities]").type("Walk, Play");
    cy.get("textarea[name=handlePetIssues]").type("Will buy new things");

    cy.get("textarea[name=moveWithPet]").type("Will take him with me");
    cy.get("textarea[name=petTravelPlans]").type("Will take him wherever i go");
    cy.get("textarea[name=petOutlivePlans]").type(
      "Will have my friend take care of him"
    );
    cy.get("button[type=submit]").click();
    cy.get(".swal2-footer").click();
  });
});
