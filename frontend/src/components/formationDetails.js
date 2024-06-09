import { useFormationsContext } from '../hooks/useFormationsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const FormationDetails = ({ formation }) => {
  const { dispatch } = useFormationsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/formation/' + formation._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_FORMATION', payload: json });
      alert('Formation deleted successfully!');
    } else {
      // Show error message
      alert('Failed to delete formation.');
    }
  };

  return (
    <div className="formation-card">
      <h4>{formation.title}</h4>
      <p><strong>Categorie: </strong>{formation.categorie}</p>
      <p><strong>Duree: </strong>{formation.duree} hours</p>
      <p><strong> Date Début : </strong>{new Date(formation.datedebut).toLocaleDateString()}</p>
      <p><strong>Date Fin: </strong>{new Date(formation.datefin).toLocaleDateString()}</p>
      <div className="actions">
        <div className="delete-button" onClick={handleClick} >Supprimer</div>
        <div className="update-button">Modifier </div>
      </div>
    </div>
  );
};


export default FormationDetails;
