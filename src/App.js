import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import {
  Tractor,
  Icon,
  VoicemailOutlined,
  Typography,
} from '@aircall/tractor';
import Phonebook from './Components/Phonebook';
import Authentication from './Components/Authentication';
import AxiosInstance from './helpers/axios';
import { AuthContext } from './contexts/AuthContext';

import './App.css';

function App() {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  const authenticate = (token) => {
    setAuthToken(token);
  };

  const isAuthenticated = !!authToken;

  useEffect(() => {
    const getCalls = async () => {
      if (authToken) {
        const { data } = await AxiosInstance.get(
          `/calls?offset=${page}&limit=7`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setCalls(data.nodes);
      }
    };

    getCalls();
  }, [authToken, page]);

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
          {isAuthenticated ? (
            <>
              <Phonebook calls={calls}></Phonebook>
            </>
          ) : (
            ''
          )}
        </Container>
      </Tractor>
    </AuthContext.Provider>
  );
}

export default App;
