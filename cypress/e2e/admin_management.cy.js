describe("Admin flow", () => {
  beforeEach(() => {

    cy.intercept("POST", "*login*", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: { id: 1, email: "admin@exam.com", isAdmin: true },
      },
    }).as("adminLogin");

    cy.visit("/login");
    cy.get('input[type="email"]').type("admin@exam.com");
    cy.get('input[type="password"]').type("Admin123!");
    cy.get('button[type="submit"]').click();

 
    window.localStorage.setItem("isAdmin", "true");
    cy.url().should("include", "/admin/dashboard");
  });

  it("navigates to course management", () => {
    cy.contains("Cours").click();
    cy.url().should("include", "/admin/courses");
  });

  it("creates a new course", () => {
    cy.intercept("POST", "**/courses*", {
      statusCode: 201,
      body: { id: 10, name: "PROG2", description: "Programming course" },
    }).as("createCourse");

    cy.contains("Cours").click();
    cy.get('input[type="text"]').type("PROG2");
    cy.get("textarea").type("Programming course - Semester 2");
    cy.get('button[type="submit"]').click();
  });

  it("navigates to student management", () => {
    cy.contains("Étudiants").click();
    cy.url().should("include", "/admin/students");
  });
});