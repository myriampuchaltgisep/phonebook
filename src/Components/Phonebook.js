import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Button,
  TextFieldInput,
  Spacer,
  NotesFilled,
  CallFilled,
  Flex,
  TrashOutlined,
  CallbackOutlined
} from '@aircall/tractor';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import AxiosInstance from '../helpers/axios';
import { AuthContext } from '../contexts/AuthContext';

const moment = require('moment');

// interface PhonebookProps {
//   calls: Array<any>;
// }
const Phonebook = ({ calls }) => {
  const [note, setNote] = useState({});
  const authContext = useContext(AuthContext);

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
    const handleInputChange = (event) => {
      setNote({
        [event.target.id]: event.target.value,
      });
    };


    let archiveButton = 'Archive';
    let buttonVariant = 'destructive';
    let icon = <CallbackOutlined style={{ float: 'left' }} />;
    if (call.is_archived) {
      archiveButton = 'Restore';
      buttonVariant = 'warning';
      icon = <TrashOutlined style={{ float: 'right' }} />;
    }

    let notes = call.notes.map((note) => {
      return <p>{note.content}</p>;
    });

    return (
      <>
        <Spacer fluid direction="vertical" space="m">
          <Card className="call-margin">
            <Accordion.Toggle as={Card.Header} eventKey={call.id}>
              {call.from}
              {icon}
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
                <TextFieldInput
                  id={call.id}
                  placeholder="Add a Note"
                  icon={NotesFilled}
                  size="small"
                  value={note[call.id]}
                  onChange={handleInputChange}
                />
                <Button
                  variant="instructive"
                  size="xSmall"
                  onClick={() => addNote(call.id)}
                  mode="outline"
                  className="button-margin"
                >
                  Add Note
                </Button>
                <Button
                  variant={buttonVariant}
                  size="xSmall"
                  onClick={() => archive(call.id)}
                  mode="outline"
                >
                  {archiveButton}
                  <TrashOutlined style={{ float: 'right' }} />
                </Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Spacer>
      </>
    );
  };

  const archive = async (callId) => {
    try {
      await AxiosInstance.put(
        `/calls/${callId}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authContext.token}`,
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const archiveAll = () => {
    // Make a shallow copy of the calls in the state to avoid an infinite loop of archives
    const listOfCalls = [...calls];
    listOfCalls.forEach((call) => archive(call.id));
  };

  const addNote = async (id) => {
    await AxiosInstance.post(
      `/calls/${id}/note`,
      {
        content: note[id],
      },
      {
        headers: {
          Authorization: `Bearer ${authContext.token}`,
        },
      },
    ).then(() => {
      setNote({
        [id]: '',
      });
    });
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
        <Button
          size="xSmall"
          variant="destructive"
          onClick={() => archiveAll()}
          mode="outline"
          className="button-margin"
        >
          <TrashOutlined /> Archive all calls
        </Button>
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
