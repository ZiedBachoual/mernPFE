import React, {useEffect, useState} from "react";
import {useFormationsContext} from '../hooks/useFormationsContext';
import {useAuthContext} from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useParams, useNavigate } from 'react-router-dom';

const FormationDetails = ({formation, isRolled, formateurs, formateur}) => {
    const {dispatch} = useFormationsContext();
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const handleUserClick = (formationId) => {
        navigate(`/usersformations/${formationId}`);
    };
    const handleSeancesClick =(formationId)=>{
        navigate(`/listseances/${formationId}`);
    }
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
            dispatch({type: 'DELETE_FORMATION', payload: json});
            alert('Formation deleted successfully!');
        } else {
            // Show error message
            alert('Failed to delete formation.');
        }
    };

    const enrollCourse = async (formationId) => {
        if (!user) {
            alert('You need to be logged in to enroll in a course.');
            return;
        }

        console.log("formationId", formationId);
        const response = await fetch('http://localhost:3000/api/user/enroll', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user?.user?._id,
                formationId: formationId
            })
        });

        if (response.ok) {
            alert('You have been enrolled successfully!');
        } else {
            alert('Failed to enroll in the course.');
        }
    };
    const unerollCourse = async (formationId) => {
        if (!user) {
            alert('You need to be logged in to unenroll in a course.');
            return;
        }

        console.log("formationId", formationId);
        const response = await fetch('http://localhost:3000/api/user/unenroll', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user?.user?._id,
                formationId: formationId
            })
        });
        if (response.ok) {
            alert('You have been unenrolled successfully!');
        } else {
            alert('Failed to unenroll in the course.');
        }
    };

    const addFormateur = async (formateurId, formationId) => {
        if (!user) {
            alert('You need to be logged in to add in a formateur.');
            return;
        }

        const response = await fetch('http://localhost:3000/api/formateur/addFormateurToFormation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formateurId: formateurId,
                formationId: formationId
            })
        });
        if (response.ok) {
            alert('You have been add a formateur!');
        } else {
            alert('Failed to add formateur.');
        }
    };

    const deleteFormateur = async (formateurId, formationId) => {
        if (!user) {
            alert('You need to be logged in to delete a formateur.');
            return;
        }
        const response = await fetch('http://localhost:3000/api/formateur/removeFormateur', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formateurId: formateurId,
                formationId: formationId
            })
        });
        if (response.ok) {
            alert('You have been deleted a formateur!');
        } else {
            alert('Failed to delete formateur.');
        }
    };
    return (
        <div className="formation-card">
            <h4>{formation.title}</h4>
            <p><strong>Categorie: </strong>{formation.categorie}</p>
            <p><strong>Duree: </strong>{formation.duree} hours</p>
            <p><strong> Date Début : </strong>{new Date(formation.datedebut).toLocaleDateString()}</p>
            <p><strong>Date Fin: </strong>{new Date(formation.datefin).toLocaleDateString()}</p>
            <div>
                <div className="delete-button" onClick={handleClick}>Supprimer</div>
                <div className="update-button">Modifier</div>
                {user.role == 'user' && (<div className="enroll-button" onClick={() => {
                    if (isRolled) {
                        unerollCourse(formation._id)
                    } else {
                        enrollCourse(formation._id)
                    }
                }}>{isRolled ? 'quitter' : 'Rejoindre'}</div>)}
                {user.role == 'admin' && (<div className="enroll-button" onClick={() => handleSeancesClick(formation._id)}>Afficher les seances</div>)}
                {user.role == 'admin' && (<div className="enroll-button" onClick={() => handleUserClick(formation._id)}>Afficher les etudiants</div>)}
                {user.role == 'admin' && !formateur && (<select style={{width:'95%'}} value={formation.formateurs[0]}
                                                                onChange={(e) => addFormateur(e.target.value, formation._id)}>
                    <option value="">Choisir un formateur</option>
                    {formateurs.map((formateur) => (
                        <option key={formateur._id} value={formateur._id}>
                            {`${formateur.firstName} ${formateur.lastName}`}
                        </option>
                    ))}
                </select>)}
                {user.role == 'admin' && formateur && (<div className="enroll-button" onClick={() => {
                    deleteFormateur(formateur, formation._id)
                }}>quitter</div>)}
            </div>
        </div>
    );
};
export default FormationDetails;
