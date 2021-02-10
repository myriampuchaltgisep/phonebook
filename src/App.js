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

import Pusher from 'pusher-js';

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

  useEffect(() => {
    const subscribeToPusher = () => {
      if (authToken) {
        const pusher = new Pusher('d44e3d910d38a928e0be', {
          cluster: 'eu',
          // authEndpoint: 'http://localhost:5000/pusher/auth',
          authEndpoint: 'https://frontend-test-api.aircall.io/pusher/auth',
          auth: {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        // pusher.connection.bind('connected', () => console.log('connected'));

        let channel = pusher.subscribe('private-aircall');

        // channel.bind('pusher:subscription_succeeded', () => {
        //   console.log('subscription_succeeded');
        // });

        channel.bind('pusher:subscription_error', (err) => {
          console.log(err);
        });

        channel.bind('update-call', (data) => {
          // 1. Make a shallow copy of the calls in the state
          let listOfCalls = [...calls];
          // 2. Find the Index of the call we want to update
          const indexToUpdate = listOfCalls.findIndex(
            (call) => call.id === data.id,
          );
          // 3. Update the call with the new data
          listOfCalls[indexToUpdate] = data;
          // 4. Update the state with the updated call
          setCalls(listOfCalls);
        });
      }
    };

    subscribeToPusher();
  }, [calls, authToken]);

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
