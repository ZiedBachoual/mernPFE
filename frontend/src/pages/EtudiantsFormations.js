import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../hooks/useAuthContext";
import FormationDetails from '../components/formationDetails';
import FormationForm from '../components/formationForm';
import {useParams, useNavigate} from 'react-router-dom';

const EtudiantsFormations = () => {
    const [users, setUsers] = useState([]);
    const {id} = useParams();
    const {user} = useAuthContext();
    const unerollCourse = async (formationId,userId) => {
        if (!user) {
            alert('You need to be logged in to unenroll in a course.');
            return;
        }
        const response = await fetch('http://localhost:3000/api/user/unenroll', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                formationId: formationId
            })
        });
        if (response.ok) {
            alert('You have been unenroll the student successfully!');
        } else {
            alert('Failed to unenroll in the course.');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/user/getallusers", {
                headers: {Authorization: `Bearer ${user.token}`},
            });
            const json = await response.json();
            if (response.ok) {
                setUsers(json)
            } else {
                console.log(json.error);
            }
        } catch (error) {
            console.log("Failed to fetch formateurs");
        }
    };
    useEffect(() => {
        console.log("---id", id)
        fetchUsers()
    }, [id]);
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '20px',
            borderRadius: '10px'
        }}>
            {users
                .filter(etudiant => etudiant.formations.includes(id))
                .map((etudiant, index) => (
                    <div key={etudiant._id} style={{
                        width: 'calc(25% - 20px)',
                        padding: '15px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}>
                        <h4 style={{
                            margin: '10px 0',
                            fontSize: '1.2em',
                            color: '#333'
                        }}>{`${etudiant.nom} ${etudiant.prenom}`}</h4>
                        <p style={{margin: '5px 0', color: '#666'}}>
                            <strong>Email: </strong>{etudiant.email}
                        </p>
                        <p style={{margin: '5px 0', color: '#666'}}>
                            <strong>Adresse: </strong>{etudiant.adresse}
                        </p>
                        <p style={{margin: '5px 0', color: '#666'}}>
                            <strong>Niveau: </strong>{etudiant.niveau}
                        </p>

                        <div className="enroll-button" onClick={() => {
                            unerollCourse(id,etudiant._id)
                        }}>quitter
                        </div>
                    </div>
                ))}
            {users
                .filter(etudiant => etudiant.formations.includes(id))
                .length === 0 && (
                <div style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                }}>
                    Aucune etudiant liée à cette formation.
                </div>
            )}
        </div>
    );
};

export default EtudiantsFormations;
