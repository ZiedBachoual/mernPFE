// CategoriesContext.js
import React, { createContext, useReducer, useContext } from "react";

export const CategoriesContext = createContext(); // Create the context

export const useCategoriesContext = () => useContext(CategoriesContext); // Create the hook

const initialState = {
  categories: [],
  error: null,
};

export const categoriesReducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        categories: action.payload,
      };
    case "DELETE_CATEGORIES":
      return {
        categories: state.categories.filter(
          (c) => c._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const CategoriesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, initialState);

  return (
    <CategoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
};
