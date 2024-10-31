import React, { useState, useEffect } from "react";
import {
  Button,
  Grid2,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Input,
  responsiveFontSizes,
  Collapse,
  Alert,
} from "@mui/material";
import {
  json,
  Link,
  Navigate,
  renderMatches,
  useNavigate,
} from "react-router-dom";

const CreateRoom = ({
  votesToSkip: defaultVotesToSkip = 2,
  guestCanPause: defaultGuestCanPause = true,
  update = false,
  roomCode = null,
  updateCallBack,
}) => {
  const [votesToSkip, setVotesToSkip] = useState(defaultVotesToSkip);
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setGuestCanPause(defaultGuestCanPause);
    setVotesToSkip(defaultVotesToSkip);
  }, [defaultGuestCanPause, defaultVotesToSkip]);

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleCreateRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guess_can_pause: guestCanPause,
      }),
    };

    fetch("/api/createRoom", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const roomCode = data.code;
        navigate(`/room/${roomCode}`);
      });
  };

  const handleUpdateRoomButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guess_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/UpdateRoom", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMessage("Room Updated Successfully");
        updateCallBack();
      } else {
        setErrorMessage("Error Updating Room");
      }
    });
  };

  const renderCreateButtons = () => (
    <Grid2 container spacing={1} direction={"column"} alignItems={"center"}>
      <Grid2 item="true" xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateRoomButtonPressed}
        >
          Create a Room
        </Button>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid2>
    </Grid2>
  );

  const renderUpdateButton = () => (
    <Grid2 item="true" xs={12}>
      <Button
        color="primary"
        variant="contained"
        onClick={handleUpdateRoomButtonPressed}
      >
        Update Room
      </Button>
    </Grid2>
  );

  const title = update ? "Update Room" : "Create Room ";

  return (
    <Grid2 container spacing={1} direction={"column"} alignItems={"center"}>
      <Grid2 item="true" xs={12} alignItems={"center"}>
        <Collapse in={errorMessage != "" || successMessage != ""}>
          {successMessage != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMessage("");
              }}
            >
              {successMessage}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMessage("");
              }}
            >
              {errorMessage}
            </Alert>
          )}
        </Collapse>
      </Grid2>
      <Grid2 item="true" xs={12} alignItems={"center"}>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid2>
      <Grid2 alignItems={"center"}>
        <FormControl>
          <FormHelperText>Guess Control of Playback State</FormHelperText>
          <RadioGroup
            row
            onChange={handleGuestCanPauseChange}
            value={guestCanPause}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <FormControl>
          <TextField
            required={true}
            type="number"
            value={votesToSkip}
            onChange={handleVotesChange}
            slotProps={{
              htmlInput: {
                min: 1,
                style: { textAlign: "center" },
              },
            }}
          />
          <FormHelperText sx={{ textAlign: "center" }}>
            Votes required to Skip
          </FormHelperText>
        </FormControl>
      </Grid2>
      {update ? renderUpdateButton() : renderCreateButtons()}
    </Grid2>
  );
};

export default CreateRoom;
