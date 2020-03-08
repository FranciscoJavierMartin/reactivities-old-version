import React from 'react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ACTIVITIES_ROUTE } from '../../app/constants/routes';

const HomePage = () => {
  return (
    <Container
      style={{
        marginTop: '7em'
      }}
    >
      <h1>Home Page</h1>
      <h3>
        Go to <Link to={`/${ACTIVITIES_ROUTE}`}>Activities</Link>
      </h3>
    </Container>
  );
};

export default HomePage;
