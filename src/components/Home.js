import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <main>
        <h1>Welcome to the Project Management Tool</h1>
        <Link to="/projects">
          <button>My Projects</button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
