import { FormationsContext } from '../context/FormationsContext'; // Modifier l'import pour utiliser FormationsContext
import { useContext } from 'react';

export const useFormationsContext = () => { // Modifier le nom du hook
  const context = useContext(FormationsContext); // Modifier l'utilisation de FormationsContext

  if (!context) {
    throw Error('useFormationsContext must be used inside a FormationsContextProvider'); // Modifier le message d'erreur
  }

  return context;
};
