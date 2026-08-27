describe("Student flow", () => {
  beforeEach(() => {
    cy.intercept("POST", "*login*", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: { id: 2, name: "Jean Rakoto", role: "student" },
      },
    }).as("studentLogin");

    cy.visit("/login");
    cy.get('input[type="email"]').type("jean.rakoto@examhub.local");
    cy.get('input[type="password"]').type("student123");
    cy.get('button[type="submit"]').click();

    cy.wait("@studentLogin");
    cy.url().should("include", "/student/exams");
  });

  it("shows the list of available exams", () => {
    cy.contains("Examens disponibles").should("be.visible");
  });

  it("shows the results page", () => {
    cy.intercept("GET", "**/my/results*", {
  statusCode: 200,
  body: {
    results: [
      {
        course_name: "PROG2",
        exam_name: "Quiz HTML de base",
        score: 4,
        total_points: 5,
        percentage: 80,
        submitted_at: new Date().toISOString(),
      },
    ],
    average: 80,
  },
}).as("myResults");

    cy.contains("Mes résultats").click();
    cy.url().should("include", "/student/results");
    cy.wait("@myResults");
    cy.contains("PROG2").should("be.visible");
  });

  it("takes an exam and submits partial answers", () => {
    cy.intercept("GET", "**/my/exams/1", {
  statusCode: 200,
  body: {
    exam: {
      id: 1,
      name: "Quiz HTML de base",
      course_name: "PROG2",
    },
    questions: [
      {
        id: 1,
        statement: "Que signifie HTML ?",
        points: 2,
        choices: [
          { id: 1, choice_text: "HyperText Markup Language" },
          { id: 2, choice_text: "High Tech Modern Language" },
        ],
      },
    ],
  },
}).as("examDetail");

    cy.intercept("GET", "**/my/exams/1", {
      statusCode: 200,
      body: {
        id: 1,
        title: "Quiz HTML de base",
        course: { code: "PROG2", name: "Programmation web" },
        description: null,
        ends_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        question_count: 1,
        total_points: 2,
        questions: [
          {
            id: 1,
            statement: "Que signifie HTML ?",
            points: 2,
            position: 1,
            choices: [
              { id: 1, text: "HyperText Markup Language" },
              { id: 2, text: "High Tech Modern Language" },
            ],
          },
        ],
      },
    }).as("examDetail");

    cy.intercept("POST", "**/my/exams/1/submit", {
      statusCode: 201,
      body: {
        score: 2,
        total_points: 2,
        correction: [
          {
            question_id: 1,
            statement: "Que signifie HTML ?",
            points: 2,
            student_choice_id: 1,
            correct_choice_id: 1,
            is_correct: true,
          },
        ],
      },
    }).as("submitExam");

    cy.contains("Examens disponibles").click();
    cy.wait("@myExams");
    cy.contains("Take exam").click();
    cy.wait("@examDetail");

    cy.contains("HyperText Markup Language").click();
    cy.contains("Submit my answers").click();
    cy.contains("Do you confirm submission?").should("be.visible");
    cy.contains("button", "Confirm").click();

    cy.wait("@submitExam").its("request.body").should("deep.equal", {
      answers: [{ question_id: 1, choice_id: 1 }],
    });

    cy.url().should("include", "/student/exams/1/result");
    cy.contains("Score: 2 / 2").should("be.visible");
  });

  it("prevents retaking an exam already submitted (no available exams)", () => {
    cy.intercept("GET", "**/my/exams", {
      statusCode: 200,
      body: [],
    }).as("noExams");

    cy.contains("Examens disponibles").click();
    cy.wait("@noExams");
    cy.contains("No exams available at the moment.").should("be.visible");
  });
});