import React, { useState, useEffect } from "react";
import { Grid2, ButtonGroup, Button, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import JoinRoom from "./JoinRoomPage";
import CreateRoom from "./CreateRoomPage";
import Room from "./Room";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/UserInRoom");
        const data = await response.json();
        setRoomCode(data.code);
      } catch (error) {
        console.error("Erro fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderHomePage = () => (
    <Grid2 container spacing={3} direction={"column"}>
      <Grid2 item="true" xs={12}>
        <Typography variant="h3" component="h3">
          House Party
        </Typography>
      </Grid2>
      <Grid2 item="true" xs={12}>
        <ButtonGroup
          disableElevation
          variant="contained"
          color="primary"
          sx={{ gap: 1 }}
        >
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid2>
    </Grid2>
  );

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()
          }
        />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route
          path="/room/:roomCode"
          element={<Room leaveRoomCallBack={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
};

export default HomePage;
