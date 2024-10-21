import React, { useState } from "react";
import { TextField, Button, Grid2, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoomCode = (e) => {
    setRoomCode(e.target.value);
  };

  const JoinRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    fetch("/api/joinRoom", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setError("Room Not Found!");
          throw new Error("Room Not Found!");
        }
      })
      .then((data) => {
        const roomCode = data.code;
        navigate(`/room/${roomCode}`);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Grid2 container spacing={1} alignItems={"center"} direction={"column"}>
      <Grid2 item="true" xs={12}>
        <Typography component="h4" variant="h4">
          Join a Room
        </Typography>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <TextField
          error={!!error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleRoomCode}
        ></TextField>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={JoinRoomButtonPressed}
        >
          Join a Room
        </Button>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default JoinRoom;
