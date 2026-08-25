import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const email = localStorage.getItem("email");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("email");
    navigate("/login");
  }

  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <nav>
      <div className="navbar-left">
        <span className="navbar-brand">
          <span className="navbar-brand-dot" />
          Portail Examens
        </span>
        <div className="navbar-links">
          {token && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>
                Tableau de bord
              </NavLink>
              <NavLink to="/admin/students" className={linkClass}>
                Étudiants
              </NavLink>
              <NavLink to="/admin/courses" className={linkClass}>
                Cours
              </NavLink>
              <NavLink to="/admin/exams" className={linkClass}>
                Examens
              </NavLink>
            </>
          )}
          {token && !isAdmin && (
            <>
              <NavLink to="/student/exams" className={linkClass}>
                Examens disponibles
              </NavLink>
              <NavLink to="/student/results" className={linkClass}>
                Mes résultats
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className="navbar-right">
        {token && (
          <>
            <span className="navbar-email">{email}</span>
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;