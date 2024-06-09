import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../index.css"; // Import the CSS file for styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Perform login
      await login(email, password, role);
    } catch (error) {
      console.error("Login error:", error);
    }

    setIsLoading(false);
  };

  const handleResetPassword = () => {
    navigate("/request-password-reset");
  };

  return (
      <div className="login-container">
        <div className="login-form">
          <div className="photo">
            <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Profile" />
          </div>
          <form onSubmit={handleSubmit}>
            <h3>
              <span role="img" aria-label="person emoji">
                👤
              </span>
              Se Connecter
            </h3> 
            <label>Role:</label>
      <select onChange={(e) => setRole(e.target.value)} required>
        <option>choisir role</option>
        <option>admin</option>
        <option>user</option>
        <option>formateur</option>
      </select>

  
            <label>Address Email :</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label>Mot de passe:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              
            </div>
  
            <button type="submit" disabled={isLoading}>
              Se connecter
            </button>
  
            {error && <div className="error">{error}</div>}
  
            <button type="button" onClick={handleResetPassword}>
              Mot de passe oublié?
            </button>
            <div>
            <p>Vous n'avez pas un compte ?</p>
            <Link to="/signup">
              <button>S'inscrire</button>
            </Link>
          </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;
