describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("shows the login form", () => {
    cy.get("h1").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
  });

  it("shows an error when credentials are incorrect", () => {
    cy.intercept("POST", "*login* ", {
      statusCode: 401,
      body: { message: "Identifiants invalides" },
    }).as("loginFailure");

    cy.get('input[type="email"]').type("unknown@exam.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.get(".error").should("be.visible");
  });

  it("logs in the admin and redirects to the dashboard", () => {
    cy.intercept("POST", "**/login*", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          email: "admin@examhub.local",
          isAdmin: "admin",
          role: "admin",
        },
        isAdmin: true,
      },
    }).as("adminLogin");

    cy.visit("/login");
    cy.get('input[type="email"]').type("admin@examhub.local");
    cy.get('input[type="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.wait("@adminLogin");
    cy.url().should("include", "/admin/dashboard");
  });
});