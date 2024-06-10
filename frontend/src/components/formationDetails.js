import React, {useEffect, useState} from "react";
import {useFormationsContext} from '../hooks/useFormationsContext';
import {useAuthContext} from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const FormationDetails = ({formation, isRolled}) => {
    const {dispatch} = useFormationsContext();
    const {user} = useAuthContext();

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
            alert('You need to be logged in to enroll in a course.');
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
    return (
        <div className="formation-card">
            <h4>{formation.title}</h4>
            <p><strong>Categorie: </strong>{formation.categorie}</p>
            <p><strong>Duree: </strong>{formation.duree} hours</p>
            <p><strong> Date Début : </strong>{new Date(formation.datedebut).toLocaleDateString()}</p>
            <p><strong>Date Fin: </strong>{new Date(formation.datefin).toLocaleDateString()}</p>
            <div className="actions">
                <div className="delete-button" onClick={handleClick}>Supprimer</div>
                <div className="update-button">Modifier</div>
                {user.role == 'user' && (<div className="enroll-button" onClick={() => {
                    if (isRolled) {
                        unerollCourse(formation._id)
                    } else {
                        enrollCourse(formation._id)
                    }
                }}>{isRolled ? 'quitter' : 'Rejoindre'}</div>)}
            </div>
        </div>
    );
};
export default FormationDetails;
