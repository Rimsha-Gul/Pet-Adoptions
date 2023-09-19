describe("Successfully add pet", () => {
  it("creates and login shelter", () => {
    cy.task("createUser", {
      role: "SHELTER",
      name: "Test Shelter",
      email: "test-shelter@example.com",
    });
  });

  it("login shelter and add pet", () => {
    cy.task("login", { email: "test-shelter@example.com" }).then(
      ({ accessToken, refreshToken }: any) => {
        cy.setLocalStorage("accessToken", accessToken);
        cy.setLocalStorage("refreshToken", refreshToken);
        cy.setSessionStorage("userEmail", "test-shelter@example.com");
      }
    );
    cy.visit("/homepage");
    cy.get("[data-cy=profile-photo]").click();
    cy.get("[data-cy=profile-and-settings-link]").click();
    cy.get("[data-cy=add-a-pet-button]").click();

    cy.get("#category").click();
    cy.get('[id="react-select-5-listbox"]').contains("Rabbit").click();
    cy.get("input[name=microchipID]").type("A123456789");
    cy.get("input[name=petName]").type("Snowball");
    cy.get("#gender").click();
    cy.get('[id="react-select-7-listbox"]').contains("Male").click();
    cy.get('input[placeholder="Birth date"]').click();
    cy.get(".rdtSwitch").click();
    cy.get(".rdtSwitch").click();
    cy.get(".rdtYear").contains("2020").click();
    cy.get(".rdtMonth").contains("Jan").click();
    cy.get(".rdtDay").contains("20").click();
    cy.get("input[name=breed]").type("Mini Rex");
    cy.get("input[name=color]").type("White");
    cy.get("#activityNeeds").click();
    cy.get('[id="react-select-9-listbox"]').contains("Low").click();
    cy.get("#levelOfGrooming").click();
    cy.get('[id="react-select-11-listbox"]').contains("Medium").click();
    cy.get(".react-switch-handle").click({ multiple: true });
    cy.get("input[name=traits]").type("Playful, Social");
    cy.get("input[name=adoptionFee]").type("3");
    cy.get("#currency").click();
    cy.get('[id="react-select-13-listbox"]').contains("USD").click();
    cy.get("textarea[name=bio]").type(
      "Snowball, an alluring male Mini Lop rabbit, boasts a pristine white coat that perfectly mirrors his name. Born in 2021, his vibrant curiosity and playful energy are well-balanced by a gentle, sociable nature, which is a hallmark of his breed. His dark, expressive eyes only add to his endearing charm.\n In Snowflake's world, playfulness and tranquility are two sides of the same coin. He revels in his playtime, brightening up any room with his adorable antics. However, he also finds bliss in quiet moments, relishing gentle strokes and peaceful cuddles. This harmony of traits makes him a wonderful companion, suitable for both bustling families and individuals seeking a serene pet.\n Ready to bond with a forever family, Snowflake is neutered, microchipped, and fully vaccinated. He was raised in a caring and nurturing environment, which has fostered his friendly, confident demeanor. A home filled with affection, room for exploration, and thoughtful care would be the perfect setting for this delightful bunny."
    );
    // cy.fixture("addingPet/snowball-1.jpg", "binary").then((fileContent) => {
    //   cy.get("[data-cy=image-upload]").attachFile({
    //     fileContent: fileContent.toString(),
    //     fileName: "snowball-1.jpg",
    //     mimeType: "image/jpg",
    //     encoding: "utf-8",
    //   });
    // });
    cy.get("[data-cy=image-upload] input").then((input) => {
      const inputElement = input.get(0) as HTMLInputElement;

      cy.fixture("addingPet/snowball-1.jpg", "binary").then((fileContent) => {
        const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/jpg");
        const testFile = new File([blob], "snowball-1.jpg", {
          type: "image/jpg",
        });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        inputElement.files = dataTransfer.files;
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
    cy.get('button[type="submit"]').click();
  });
});
