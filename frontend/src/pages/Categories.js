import React, { useEffect } from "react";
import { useCategoriesContext } from "../hooks/useCategoriesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CategoriesDetails from "../components/categoriesDetails";
import CategorieForm from "../components/categorieForm";

const Categories = () => {
  const {
    state: { categories },
    dispatch,
  } = useCategoriesContext();
  const { user } = useAuthContext();

  const fetchCategories = async () => {
    console.log(user.token);
    try {
      const response = await fetch("http://localhost:3000/api/categorie", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      console.log(response);

      if (response.ok) {
        console.log("Fetched categories:", json); // Log fetched categories
        dispatch({ type: "SET_CATEGORIES", payload: json });
      } else {
        console.error("Failed to fetch categories:", json.error); // Log error message if fetching fails
      }
    } catch (error) {
      console.error("Error fetching categories:", error); // Log error message if an exception occurs
    }
  };

  useEffect(() => {
    fetchCategories()

    if (user) {
      fetchCategories();
    } else {
      console.error("User not authenticated"); // Log error message if user is not authenticated
    }
  }, [dispatch, user]);

  console.log("dispatch", categories);

  return (
    <div className="categories-page">
      <div className="categories">
        {categories ? (
          categories.map((categories) => {
            console.log("Mapping category:", categories); // Log each category being mapped
            return (
              <CategoriesDetails key={categories._id} categories={categories} />
            );
          })
        ) : (
          <p>No categories found</p> // Display message if categories array is empty
        )}
      </div>
      <CategorieForm />
    </div>
  );
};

export default Categories;
