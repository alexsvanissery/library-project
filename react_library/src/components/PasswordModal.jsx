import { useState } from "react";

export default function PasswordModal({ show, onClose, onConfirm }) {
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h4>Admin Access Required</h4>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttons}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },
  buttons: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
};
