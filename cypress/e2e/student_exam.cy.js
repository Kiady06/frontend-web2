describe("Student flow", () => {
  beforeEach(() => {
    cy.intercept("POST", "*login*", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 2,
          name: "Jean Rakoto",
          email: "jean.rakoto@examhub.local",
          isAdmin: "student",
        },
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
    cy.contains("Available Exams").should("be.visible");
  });

  it("shows the results page", () => {
    cy.intercept("GET", "**/my/results*", {
      statusCode: 200,
      body: {
        results: [
          {
            course_name: "PROG2",
            exam_name: "Basic HTML Quiz",
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
    cy.intercept("GET", "**/my/exams", {
      statusCode: 200,
      body: [
        {
          id: 1,
          course_name: "PROG2",
          name: "Basic HTML Quiz",
          end_date: new Date(Date.now() + 3600 * 1000).toISOString(),
        },
      ],
    }).as("myExams");

    cy.intercept("GET", "**/my/exams/1", {
      statusCode: 200,
      body: {
        exam: {
          id: 1,
          name: "Basic HTML Quiz",
          course_name: "PROG2",
        },
        questions: [
          {
            id: 1,
            statement: "What does HTML stand for?",
            points: 2,
            choices: [
              { id: 1, text: "HyperText Markup Language" },
              { id: 2, text: "High Tech Modern Language" },
            ],
          },
        ],
      },
    }).as("examDetail");

    cy.intercept("POST", "**/my/exams/1/submit", {
      statusCode: 200,
      body: {
        score: 2,
        total_points: 2,
        correction: [
          {
            question_id: 1,
            statement: "What does HTML stand for?",
            points: 2,
            obtained_points: 2,
            selected_choice_id: 1,
            correct_choice_id: 1,
            choices: [
              { id: 1, text: "HyperText Markup Language" },
              { id: 2, text: "High Tech Modern Language" },
            ],
          },
        ],
      },
    }).as("submitExam");

    cy.visit("/student/exams");
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

    cy.visit("/student/exams");
    cy.wait("@noExams");
    cy.contains("No exams available at the moment.").should("be.visible");
  });
});