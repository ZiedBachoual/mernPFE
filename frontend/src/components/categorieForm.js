import React, { useState, useRef } from "react";
import { useCategoriesContext } from "../hooks/useCategoriesContext"; // Import the context hook for categories
import { useAuthContext } from "../hooks/useAuthContext";

const CategorieForm = () => {
  const { dispatch } = useCategoriesContext(); // Get the dispatch function from the categories context
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // State to store the selected image
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input element

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!user) {
      setError("You must be logged in");
      return;
    }
  
    if (!title || !description || !image) {
      setError("Please fill in all fields");
      return;
    }
  
    const formData = new FormData(); // Create a FormData object to send form data including files
  
    formData.append("title", title); // Append the title to the FormData object
    formData.append("description", description); // Append the description to the FormData object
    formData.append("image", image); // Append the image file to the FormData object
  
    fetch("/api/categorie/add", {
      method: "POST",
      body: formData, // Pass the FormData object as the body of the request
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => Promise.reject(error));
      }
      return response.json();
    })
    .then(json => {
      console.log("Success:", json); // Log the success response
      setTitle("");
      setDescription("");
      setImage(null); // Reset the image state
      setError(null);
      dispatch({ type: "CREATE_CATEGORIE", payload: json }); // Dispatch the action to create a new category
    })
    .catch(error => {
      console.error("Error adding category:", error); // Log the error response
      setError("Failed to add category. Please try again later.");
    });
  };
  

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Ajouter une nouvelle Catégorie</h3>

      <label>Titre de Catégorie</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label>Description:</label>
      <textarea
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      <label>Image:</label>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        ref={fileInputRef}
      />
      <input type="submit" value="Add Category" />
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CategorieForm;
