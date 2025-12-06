import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        <div className="card">
          <div className="card-header">
            <h1>Widespread Anti-Venom for Snakebites</h1>
          </div>
          <div className="card-body">
            <p style={{ marginBottom: '1.5rem' }}><strong>Summary: </strong>Venomous snakebites are a serious medical concern throughout the world especially in sub-Saharan Africa. Of the 300,000 bites that occur every year many result in death or amputation. 
              Fortunately, scientists are currently working on an innovative new method for developing anti-venoms using nanobodies derived from camelids. 
              In the past, antibodies derived from horses that have been injected with snake venoms have been used to create anti-venom. 
              However, these anti-venoms are costly, limited in their effectiveness across snake species, and can do little to repair already damaged tissue from envenoming. 
              A new breakthrough in mitigating the cost and increasing the effectiveness of anti-venoms comes from using llamas and alpaca instead as their immune responses create nanobodies which are smaller and more stable than antibodies. 
              Camelid nanobodies can treat tissue harmed by snake venom more quickly and successfully than horse antibodies as their smaller size allows them to infiltrate deeper. 
              Nanobodies are also useful in treating a wider array of toxins such as both neurotoxins and cytotoxins. 
              Currently the anti-venoms obtained from llamas and alpaca are used to combat snakebites from the elapid species of snakes. 
              The hope and overall goal is to next test this technique using venom from viperid snakes and then someday merging the results to establish an anti-venom that covers the entire spectrum of venomous snakes.</p>

              <p style={{ marginBottom: '1.5rem' }}><strong>Sources:</strong> <a href="https://www.popularmechanics.com/science/animals/a69231265/antivenom-nanobodies/" target="_blank" rel="noopener noreferrer">Popular Mechanics</a>, <a href="https://www.nature.com/articles/s41586-025-09661-0" target="_blank" rel="noopener noreferrer">Nature</a></p>

              <p style={{ marginBottom: '1.5rem' }}><strong>Technical Aspects: </strong>The Tech Stack for this project includes React, Axios, and CSS for the Frontend.
              Node.js, Express.js, MongoDB with Mongoose, JWT, bcryptjs, CORS, and Express Validator for the Backend.
              NGINX for the Web Server that serves React build files on port 80. Nodemon, Concurrently, and dotenv for the Development Tools.
              Jest, React Testing Library, and Supertest for Testing.</p>
          </div>
        </div>
        
       
          
      
          
         
        </div>
      </div>
    
  );
};

export default Dashboard;
