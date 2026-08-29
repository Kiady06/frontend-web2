# Frontend — Exam WEB2

React application (Vite, JavaScript) consuming the backend API via `fetch`.

## Structure

```
src/
├── api/           -> functions calling the backend API (fetch)
├── components/    -> reusable components (Navbar, PrivateRoute, ...)
├── pages/
│   ├── admin/     -> admin area pages
│   └── student/   -> student area pages
├── App.jsx        -> route declarations (react-router-dom)
├── main.jsx       -> React entry point
└── index.css      -> simple global styling

cypress/
└── e2e/           -> end-to-end tests
```

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

The application is available at http://localhost:5173
(the backend must be running on http://localhost:3000).

## Cypress Tests

```bash
npm cypress run
```
