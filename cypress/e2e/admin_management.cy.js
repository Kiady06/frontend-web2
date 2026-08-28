describe("Admin flow", () => {
  beforeEach(() => {
    cy.intercept("POST", "*login*", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          name: "Admin",
          email: "admin@examhub.local",
          isAdmin: "admin",
        },
      },
    }).as("adminLogin");

    cy.intercept("GET", "**/students*", { statusCode: 200, body: [] }).as("getStudents");
    cy.intercept("GET", "**/courses*", { statusCode: 200, body: [] }).as("getCourses");
    cy.intercept("GET", "**/exams*", { statusCode: 200, body: [] }).as("getExams");

    cy.visit("/login");
    cy.get('input[type="email"]').type("admin@examhub.local");
    cy.get('input[type="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.wait("@adminLogin");
    cy.url().should("include", "/admin/dashboard");
  });

  it("navigates to course management", () => {
    cy.contains("Cours").click();
    cy.url().should("include", "/admin/courses");
  });

  it("creates a new course", () => {
    cy.intercept("POST", "**/courses*", {
      statusCode: 201,
      body: {
        id: 10,
        code: "PROG2",
        name: "Programmation web",
        description: "Programming course - Semester 2",
      },
    }).as("createCourse");

    cy.contains("Cours").click();

    cy.get('form input[type="text"]').eq(0).type("PROG2");
    cy.get('form input[type="text"]').eq(1).type("Programmation web");
    cy.get("form textarea").type("Programming course - Semester 2");
    cy.get('button[type="submit"]').click();

    cy.wait("@createCourse").its("request.body").should("deep.equal", {
      code: "PROG2",
      name: "Programmation web",
      description: "Programming course - Semester 2",
    });
  });

  it("navigates to student management", () => {
    cy.contains("Étudiants").click();
    cy.url().should("include", "/admin/students");
  });

  it("creates a new student account", () => {
    cy.intercept("POST", "**/students*", {
      statusCode: 201,
      body: {
        id: 5,
        name: "Jean Rakoto",
        email: "jean.rakoto@examhub.local",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    }).as("createStudent");

    cy.contains("Étudiants").click();

    cy.get('form input[type="text"]').eq(0).type("Jean Rakoto");
    cy.get('form input[type="email"]').type("jean.rakoto@examhub.local");
    cy.get('form input[type="password"]').type("initialPass123");
    cy.get('button[type="submit"]').click();

    cy.wait("@createStudent").its("request.body").should("deep.equal", {
      name: "Jean Rakoto",
      email: "jean.rakoto@examhub.local",
      password: "initialPass123",
    });
  });

  it("navigates to exam management", () => {
    cy.contains("Examens").click();
    cy.url().should("include", "/admin/exams");
  });
});