import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    API.post("admin-login/", {
      username: username,
      password: password,
    })
      .then((res) => {
        // Save authentication information
        localStorage.setItem("adminToken", res.data.token);

        localStorage.setItem("adminUsername", res.data.username);

        localStorage.setItem("isAdmin", "true");

        // Go back to library
        navigate("/");
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || "Login failed. Please try again.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">🔐</div>

        <h2>Admin Login</h2>

        <p className="admin-login-subtitle">Sign in to manage the library</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="form-label">Username</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;
