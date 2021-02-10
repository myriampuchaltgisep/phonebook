import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Spacer,
  CallFilled,
  Flex,
} from '@aircall/tractor';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const moment = require('moment');

// interface PhonebookProps {
//   calls: Array<any>;
// }
const Phonebook = ({ calls }) => {
  const listedCallsByDate = () => {
    return Object.entries(groupCallsByDate()).map((entry) => {
      const date = entry[0];
      const calls = entry[1];

      const listedCalls = calls.map((call) => {
        return renderCallAccordion(call);
      });

      return (
        <>
          <Typography variant="heading2" margin="2">
            {date}
          </Typography>
          {listedCalls}
        </>
      );
    });
  };

  const renderCallAccordion = (call) => {
    let notes = call.notes.map((note) => {
      return <p>{note.content}</p>;
    });

    return (
      <>
        <Spacer fluid direction="vertical" space="m">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={call.id}>
              <CallFilled />
              {call.from}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={call.id}>
              <Card.Body>
                <p>
                  <strong>To:</strong> {call.to}
                </p>
                {/* <p><strong>Duration:</strong> {callDuration}</p> */}
                <p>
                  <strong>Type:</strong> {call.call_type}
                </p>
                <p>
                  <strong>Direction:</strong> {call.direction}
                </p>
                <p>
                  <strong>Notes:</strong> {notes}
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Spacer>
      </>
    );
  };

  const groupCallsByDate = () => {
    const callsByDate = {};
    if (Object.keys(calls).length > 0) {
      calls.forEach((call) => {
        const callDate = moment(call.created_at).format('L');

        if (callsByDate[callDate]) {
          callsByDate[callDate].push(call);
        } else {
          callsByDate[callDate] = [call];
        }
      });
    }
    return callsByDate;
  };

  return (
    <>
      <Flex size="300px" m="auto" display="inline-block">
        <Accordion>{listedCallsByDate()}</Accordion>
      </Flex>
    </>
  );
};

Phonebook.propTypes = {
  calls: PropTypes.array,
  authToken: PropTypes.string,
};
Phonebook.defaultProps = {
  calls: [],
  authToken: '',
};

export default Phonebook;
