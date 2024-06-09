import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const FormationForm = () => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [title, setTitle] = useState("");
  const [categorie, setCategorie] = useState("");
  const [formateur, setFormateur] = useState("");
  const [duree, setDuree] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [datefin, setDatefin] = useState("");
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/categorie", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setCategories(json);
      } else {
        console.error("Failed to fetch categories:", json.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFormateurs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/formateur", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setFormateurs(json);
      } else {
        console.error("Failed to fetch formateurs:", json.error);
      }
    } catch (error) {
      console.error("Error fetching formateurs:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFormateurs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (new Date(datedebut) >= new Date(datefin)) {
      setError("The start date must be before the end date.");
      return;
    }

    const formation = { title, categorie, formateur, duree, datedebut, datefin };

    const response = await fetch("/api/formation/add", {
      method: "POST",
      body: JSON.stringify(formation),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      window.location.reload();
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Ajouter    une    nouvelle    Formation</h3>

      <label>Titre de formation:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label>Categorie:</label>
      <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
        <option value="">Choisir une categorie</option>
        {categories.map((categorie) => (
          <option key={categorie._id} value={categorie._id}>
            {categorie.title}
          </option>
        ))}
      </select>

      <label>Formateur:</label>
      <select value={formateur} onChange={(e) => setFormateur(e.target.value)}>
        <option value="">Choisir un formateur</option>
        {formateurs.map((formateur) => (
          <option key={formateur._id} value={formateur._id}>
            {`${formateur.firstName} ${formateur.lastName}`}
          </option>
        ))}
      </select>

      <label>Duree (en heures):</label>
      <input
        type="number"
        onChange={(e) => setDuree(e.target.value)}
        value={duree}
      />

      <label> Date debut :</label>
      <input
        type="date"
        onChange={(e) => setDatedebut(e.target.value)}
        value={datedebut}
      />

      <label>Date fin :</label>
      <input
        type="date"
        onChange={(e) => setDatefin(e.target.value)}
        value={datefin}
      />

      <button>Ajouter</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default FormationForm;
