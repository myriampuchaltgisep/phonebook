import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AxiosInstance from '../helpers/axios';
import { Button, CallFilled } from '@aircall/tractor';

const Authentication = () => {
  const authContext = useContext(AuthContext);

  const getAuthToken = async () => {
    try {
      await AxiosInstance.post(`/auth/login`, {
        username: 'String!',
        password: 'String!',
      }).then(({ data }) => {
        authContext.token = data.access_token;
        authContext.isAuthenticated = true;
        authContext.authenticate(data.access_token);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!authContext.isAuthenticated && (
        <Button size="xSmall" onClick={() => getAuthToken()}>
          <CallFilled />
          Get List of Calls
        </Button>
      )}
    </>
  );
};

export default Authentication;
