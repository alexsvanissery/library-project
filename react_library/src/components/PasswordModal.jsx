import { useState } from "react";

export default function PasswordModal({ show, onClose, onConfirm }) {
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4>Admin Access Required</h4>

        <input
          type="password"
          className="form-control mt-2"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-3 d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "320px",
};
