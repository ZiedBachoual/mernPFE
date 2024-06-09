import { CategoriesContext } from '../context/CategoriesContext'; // Modifier l'import pour utiliser CategoriesContext
import { useContext } from 'react';

export const useCategoriesContext = () => { // Modifier le nom du hook
  const context = useContext(CategoriesContext); // Modifier l'utilisation de CategoriesContext

  if (!context) {
    throw Error('useCategoriesContext must be used inside a CategoriesContextProvider'); // Modifier le message d'erreur
  }

  return context;
};
