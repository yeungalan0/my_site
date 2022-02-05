describe("Theme", () => {
  it("should be togglable", () => {
    const darkThemeColor = "rgb(18, 18, 18)";
    const lightThemeColor = "rgb(255, 255, 255)";

    // Clear theme when starting test
    cy.clearLocalStorage().should((ls) => {
      expect(ls.getItem("theme")).to.be.null;
    });

    // Initially dark theme should be checked and the default theme
    cy.visit("/").get("[data-cy=top-bar-toggle-theme]").should("be.checked");
    cy.get("body").should("have.css", "background-color", darkThemeColor);

    // Should be able to successfully change to light theme and store
    cy.get("[data-cy=top-bar-toggle-theme]")
      .click()
      .should((toggle) => {
        expect(toggle).not.be.checked;
        expect(localStorage.getItem("theme")).to.be.eq("lightTheme");
      });
    cy.get("body").should("have.css", "background-color", lightThemeColor);

    // should be able to successfully change back to dark theme and store
    cy.get("[data-cy=top-bar-toggle-theme]")
      .click()
      .should((toggle) => {
        expect(toggle).be.checked;
        expect(localStorage.getItem("theme")).to.be.eq("darkTheme");
      });
    cy.get("body").should("have.css", "background-color", darkThemeColor);
  });
});
