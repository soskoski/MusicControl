import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid2, Button, Typography } from "@mui/material";
import CreateRoom from "./CreateRoomPage";

const Room = ({ leaveRoomCallBack }) => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetRoomDetails();
  }, [roomCode]);

  useEffect(() => {
    if (isHost) {
      authenticateSpotify();
    }
  }, [isHost]);

  const GetRoomDetails = () => {
    console.log("Fetching room details for room code:", roomCode);
    fetch(`/api/getRoom?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Room not found, leaving room.");
          leaveRoomCallBack();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guess_can_pause);
        setIsHost(data.is_host);
      })
      .catch((error) => {
        console.error("Error fetching Room details:", error);
      });

    // if (isHost) {
    //   authenticateSpotify();
    // }
  };

  const authenticateSpotify = () => {
    console.log("Authenticating Spotify...");
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        console.log("Spotify authenticated status:", data.status);
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              console.log("Redirecting to Spotify URL:", data.url);
              window.location.replace(data.url);
            });
        }
      });
  };

  const LeaveRoomButtonPressed = () => {
    console.log("Leaving room...");
    const requestOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
    };

    fetch("/api/Leave", requestOptions).then((_response) => {
      leaveRoomCallBack();
      navigate("/");
    });
  };

  const UpdateRoomSettings = (value) => {
    setShowSettings(value);
  };

  const renderSettings = () => (
    <Grid2 container spacing={1} direction={"column"} align={"center"}>
      <Grid2 item="true" xs={12}>
        <CreateRoom
          update={true}
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallBack={GetRoomDetails}
        />
      </Grid2>
      <Grid2 item="true" xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            UpdateRoomSettings(false);
          }}
        >
          Close
        </Button>
      </Grid2>
    </Grid2>
  );

  const renderSettingsButton = () => (
    <Grid2 item="true" xs={12}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          UpdateRoomSettings(true);
        }}
      >
        Settings
      </Button>
    </Grid2>
  );

  if (showSettings) {
    return renderSettings();
  }
  return (
    <Grid2 container spacing={1} direction={"column"} alignItems={"center"}>
      <Grid2 item="true" xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid2>
      <Grid2 item="true" xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes to Skip: {votesToSkip}
        </Typography>
      </Grid2>
      <Grid2 item="true" xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest can Pause: {guestCanPause ? "YES" : "NO"}
        </Typography>
      </Grid2>
      <Grid2 item="true" xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {isHost ? "YES" : "NO"}
        </Typography>
      </Grid2>
      {isHost ? renderSettingsButton() : null}
      <Grid2 item="true" xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={LeaveRoomButtonPressed}
        >
          Leave Room
        </Button>
      </Grid2>
    </Grid2>
  );
};
export default Room;
