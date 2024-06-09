import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import "../index.css"; // Import the CSS file for styles
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import MUI icons

const Signup = () => {
  const [nom, setNom] = useState(""); // State for nom
  const [prenom, setPrenom] = useState(""); // State for prenom
  const [telephone, setTelephone] = useState(""); // State for telephone
  const [adresse, setAdresse] = useState(""); // State for adresse
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Initialize role state
  const [niveau, setNiveau] = useState("etudiant"); // Initialize niveau state
  const [showPassword, setShowPassword] = useState(false); // Define showPassword state
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await signup(nom, prenom, email, password, role, telephone, adresse, niveau); // Pass all fields to signup function
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>
        {" "}
        <span role="img" aria-label="person emoji">
          👤
        </span>
        S'inscrire
      </h3>

      <label>Nom:</label>
      <input
        type="text"
        onChange={(e) => setNom(e.target.value)}
        value={nom}
        required
      />
      <label>Prenom:</label>
      <input
        type="text"
        onChange={(e) => setPrenom(e.target.value)}
        value={prenom}
        required
      />
      <label>Telephone:</label>
      <input
        type="text"
        onChange={(e) => setTelephone(e.target.value)}
        value={telephone}
        required
      />
      <label>Adresse:</label>
      <input
        type="text"
        onChange={(e) => setAdresse(e.target.value)}
        value={adresse}
        required
      />

      <label>Niveau:</label>
      <select className="select-dropdown" value={niveau} onChange={(e) => setNiveau(e.target.value)} required>
        <option value="etudiant">Étudiant</option>
        <option value="demandeur d'emploi">Demandeur d'emploi</option>
        <option value="employé">Employé</option>
      </select>
      
      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <label>Password:</label>
      <div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
       
      </div>
      <label>Confirm Password:</label>
      <input
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        required
      />

      <div className="button-container">
        <button
          type="submit"
          disabled={isLoading}
          style={{ marginRight: "10px" }} // Add some margin between buttons
        >
          Enregistrer
        </button>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="login-link-container">
        <p>
          Vous avez un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </form>
  );
};
export default Signup;
