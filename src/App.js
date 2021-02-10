import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import {
  Tractor,
  Icon,
  VoicemailOutlined,
  Typography,
  Button,
  Flex,
} from '@aircall/tractor';
import Phonebook from './Components/Phonebook';
import Authentication from './Components/Authentication';
import AxiosInstance from './helpers/axios';
import { AuthContext } from './contexts/AuthContext';

import './App.css';

function App() {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(0);
  const [nextPage, setNextPage] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  const authenticate = (token) => {
    setAuthToken(token);
  };

  const isAuthenticated = !!authToken;

  const getPreviousCalls = () => {
    setPage(page - 1);
  };

  const getNextCalls = () => {
    setPage(page + 1);
  };

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
        setNextPage(data.hasNextPage);
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
              <Flex size="200px" m="auto" display="block">
                <Button
                  disabled={page === 0}
                  onClick={() => getPreviousCalls()}
                >
                  PREV
                </Button>
                {/* <Typography variant="displayS">{page}</Typography> */}
                <Button disabled={!nextPage} onClick={() => getNextCalls()}>
                  NEXT
                </Button>
              </Flex>
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
