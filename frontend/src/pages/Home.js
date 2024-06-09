import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Make sure to import the CSS file

const Home = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/formations');
  };

  return (
    <div id="home">
      
      <h1 className="special-text">Se former tout au long de la vie</h1>
      <div className="image-container">
        <img src="https://img.freepik.com/vecteurs-libre/etudiants-marketing-creent-identite-entreprise_335657-3061.jpg" alt="Students creating company identity" className="home-image" />
      </div>
      {/* Description Paragraph */}
      <p className="description-text">
        Notre école de formation offre une variété de cours adaptés à tous les niveaux, 
        permettant à chacun de développer ses compétences et de réussir dans sa carrière.
      </p>
      
      {/* Explore Button */}
      <button className="explore-button" onClick={handleExploreClick}>Explorez</button>
    </div>
  );
};

export default Home;
