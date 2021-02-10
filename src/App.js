import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Tractor, Icon, VoicemailOutlined, Typography } from '@aircall/tractor';
import Authentication from './Components/Authentication';
import { AuthContext } from './contexts/AuthContext';
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(null);

  const authenticate = (token) => {
    setAuthToken(token);
  };

  const isAuthenticated = !!authToken;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        authenticate: authenticate,
        token: authToken,
      }}
    >
      <Tractor injectStyle>
        <Container fluid className="App">
          <header className="App-header">
            <Typography variant="displayM">
              <Icon
                component={VoicemailOutlined}
                color="primary.base"
                size={64}
                marginRight={0}
              />
              Phonebook
            </Typography>
          </header>
          <Authentication />
        </Container>
      </Tractor>
    </AuthContext.Provider>
  );
}

export default App;
