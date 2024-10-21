import React from "react";
import { Grid2, ButtonGroup, Button, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import JoinRoom from "./JoinRoomPage";
import CreateRoom from "./CreateRoomPage";
import Room from "./Room";

const HomePage = () => {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default HomePage;
