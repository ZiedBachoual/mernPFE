import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Profile = () => {
  const { user } = useAuthContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [domain, setDomain] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setNumber(user.number || '');
      setDomain(user.domain || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const updatedUser = { firstName, lastName, email, number, domain };

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setSuccessMessage('Profile updated successfully');
        setError(null);
      }
    } catch (err) {
      setError('Failed to update profile. Please try again later.');
    }
  };

  const handleFormationsClick = () => {
    navigate('/my-formations');
  };

  return (
    <div className="profile-page">
      <h3>Mon Profile</h3>
      
      {/* Button to navigate to user's formations */}
      <button className="formations-button" onClick={handleFormationsClick}>
        Mes Formations
      </button>
      
      {/* Displaying User Information */}
      <div className="profile-info">
        <p><strong>First Name:</strong> {firstName}</p>
        <p><strong>Last Name:</strong> {lastName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Number:</strong> {number}</p>
        <p><strong>Domain:</strong> {domain}</p>
      </div>

      {/* Form for Updating User Information */}
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />

        <label>Last Name:</label>
        <input
          type="text"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />

        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label>Number:</label>
        <input
          type="text"
          onChange={(e) => setNumber(e.target.value)}
          value={number}
        />

        <label>Domain:</label>
        <input
          type="text"
          onChange={(e) => setDomain(e.target.value)}
          value={domain}
        />

        <button type="submit">Update</button>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default Profile;
