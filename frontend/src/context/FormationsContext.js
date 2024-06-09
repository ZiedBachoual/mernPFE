import { createContext, useReducer } from 'react';

export const FormationsContext = createContext(); // Modifier le nom du contexte

export const formationsReducer = (state, action) => { // Modifier le nom du reducer
  switch (action.type) {
    case 'SET_FORMATIONS': // Modifier les types d'action
      return {
        formations: action.payload // Modifier les propriétés de l'état
      };
    case 'CREATE_FORMATION':
      return {
        formations: [action.payload, ...state.formations] // Modifier les propriétés de l'état
      };
    case 'DELETE_FORMATION':
      return {
        formations: state.formations.filter((f) => f._id !== action.payload._id) // Modifier les propriétés de l'état
      };
    default:
      return state;
  }
};

export const FormationsContextProvider = ({ children }) => { // Modifier le nom du provider
  const [state, dispatch] = useReducer(formationsReducer, { // Modifier le nom du reducer
    formations: null // Modifier les propriétés de l'état initial
  });

  return (
    <FormationsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </FormationsContext.Provider>
  );
};
