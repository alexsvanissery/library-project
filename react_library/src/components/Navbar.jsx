import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("library-theme") === "dark";
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");

    localStorage.setItem("library-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const adminUsername = localStorage.getItem("adminUsername");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("isAdmin");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="library-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          📚 <span>Library</span>
        </Link>

        {/* Right side */}
        <div className="navbar-actions">
          {/* Theme Button */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-link">
            🛒 <span>Cart</span>
          </Link>

          {/* Admin / Add */}
          {isAdmin && (
            <>
              <Link to="/add" className="add-item-btn">
                + Add Item
              </Link>

              <span className="admin-user">👤 {adminUsername}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* Login */}
          {!isAdmin && (
            <Link to="/admin-login" className="admin-login-btn">
              🔐 Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
