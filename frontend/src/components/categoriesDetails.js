import React, { useState } from "react";
import { useCategoriesContext } from "../hooks/useCategoriesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const CategoriesDetails = ({ categories }) => {
  const { dispatch } = useCategoriesContext();
  const { user } = useAuthContext();
  const [updatedTitle, setUpdatedTitle] = useState(categories.title);
  const [updatedDescription, setUpdatedDescription] = useState(categories.description);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", updatedTitle);
      formData.append("description", updatedDescription);

      const response = await fetch(`/api/categorie/${categories._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update category:", errorText);
        alert("Failed to update category.");
        return;
      }

      const json = await response.json();
      dispatch({ type: "UPDATE_CATEGORIES", payload: json });
      setIsEditing(false);
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while updating the category.");
    }
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(`/api/categorie/${categories._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete category:", errorText);
        alert("Failed to delete category.");
        return;
      }

      const json = await response.json();
      dispatch({ type: "DELETE_CATEGORIES", payload: json });
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  return (
    <div className="category-details">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <input
            type="text"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <button onClick={handleUpdate} className="update-button">Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{categories.title}</h4>
          <p>
            <strong>Description: </strong>
            {categories.description}
          </p>
          <p>
            {formatDistanceToNow(new Date(categories.createdAt), {
              addSuffix: true,
            })}
          </p>
          <button className="delete-button" onClick={handleClick}>
            Delete
          </button>
          <button onClick={() => setIsEditing(true)}  className="update-button">Mettre à jour</button>
        </div>
      )}
    </div>
  );
};

export default CategoriesDetails;
