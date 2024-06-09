import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useAuthContext } from "../hooks/useAuthContext";
import styles from "../index.css";

const FormateurPage = () => {
  const { user } = useAuthContext();
  const [formateurs, setFormateurs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [domain, setDomain] = useState("");
  const [cv, setCv] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFormateurs = async () => {
    try {
      const response = await fetch("/api/formateur", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setFormateurs(json);
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError("Failed to fetch formateurs");
    }
  };

  useEffect(() => {
    if (user) {
      fetchFormateurs();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(`/api/formateur/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        setFormateurs((prevFormateurs) =>
          prevFormateurs.filter((formateur) => formateur._id !== id)
        );
        alert("Formateur deleted successfully!");
      } else {
        alert("Failed to delete formateur.");
      }
    } catch (error) {
      console.error("Error deleting formateur:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("number", number);
    formData.append("domain", domain);
    formData.append("cv", cv);
    formData.append("password", password);

    try {
      const response = await fetch("/api/formateur/add", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setSuccessMessage("");
      } else {
        setError(null);
        setSuccessMessage("Formateur added successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setNumber("");
        setDomain("");
        setCv(null);
        setPassword("");
        setModalIsOpen(false);
        fetchFormateurs(); // Refresh the list of formateurs
      }
    } catch (error) {
      console.error("Failed to add formateur:", error);
      setError("Failed to add formateur");
    }
  };

  return (
    <div className={styles.formateurPage}>
      <h3 className={styles.formateursTitle}>Liste des Formateurs</h3>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formateurList}>
        {formateurs.map((formateur) => (
          <div key={formateur._id} className={styles.formateurDetails}>
            <h4>{`${formateur.firstName} ${formateur.lastName}`}</h4>
            <p>
              <strong>Email: </strong>{formateur.email}
            </p>
            <p>
              <strong>Number: </strong>{formateur.number}
            </p>
            <p>
              <strong>Domain: </strong>{formateur.domain}
            </p>
            <button className={styles.deleteButton} onClick={() => handleDelete(formateur._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <button className={styles.addButton} onClick={() => setModalIsOpen(true)}>
        Ajouter Formateur
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <form className={styles.create} onSubmit={handleSubmit}>
          <h3>Add a New Formateur</h3>

          <label>First Name:</label>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />

          <label>Last Name:</label>
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />

          <label>Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <label>Number:</label>
          <input
            type="text"
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />

          <label>Domain:</label>
          <input
            type="text"
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
          />

          <label>CV:</label>
          <input
            type="file"
            onChange={(e) => setCv(e.target.files[0])}
          />

          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button>Add Formateur</button>
          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}
        </form>
      </Modal>
    </div>
  );
};

export default FormateurPage;
