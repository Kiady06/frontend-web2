import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("isAdmin", data.user.isAdmin === "admin");
      localStorage.setItem("email", data.user.email);

      if (data.user.isAdmin === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/exams");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <span className="login-panel-eyebrow">Portail Examens</span>
        <h1 className="login-panel-title">Bienvenue</h1>
        <p className="login-panel-text">
          Suivez vos cours, passez vos évaluations et retrouvez vos résultats
          au même endroit.
        </p>
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <h2 className="login-card-title">Connexion</h2>
          <p className="login-card-subtitle">
            Entrez vos identifiants pour continuer.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && <p className="error">{error}</p>}

            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;