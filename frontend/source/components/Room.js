import React, { useState, useEffect } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import { Grid2, Button, Typography } from "@mui/material";
import CreateRoom from "./CreateRoomPage";
import MusicPlayer from "./musicPlayer";

const Room = ({ leaveRoomCallBack }) => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    GetRoomDetails();
  }, [roomCode]);

  useEffect(() => {
    if (isHost) {
      authenticateSpotify();
    }
  }, [isHost]);

  useEffect(() => {
    const interval = setInterval(() => {
      GetCurrentSong();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  // const revokeSpotifyToken = () => {
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //   };

  //   fetch("http://127.0.0.1:8000/spotify/revoke-token", requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         return response.json().then((data) => {
  //           throw new Error(data.error || "Failed to revoke token");
  //         });
  //       }

  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Token revoked:", data.message);
  //       alert("Spotify token revoked successfully!");
  //     })
  //     .catch((error) => {
  //       console.error("Error revoking token:", error.message);
  //       alert("Failed to revoke Spotify token: " + error.message);
  //     });
  // };

  function logoutSpotify() {
    fetch("/spotify/get-auth-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const authUrl = data.url;
        window.location.href = authUrl;
      })
      .catch((error) => {
        console.error("Error fetching auth URl", error);
      });
  }

  // const handleSwitchAccount = () => {
  //   fetch("/spotify/reauthorize").then((response) => {
  //     if (response.redirected) {
  //       window.location.href = response.url;
  //     }
  //   });
  // };

  // fetch("/spotify/clear-tokens", {
  //   method: "DELETE",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("Response", data);
  //   })
  //   .catch((error) => {
  //     error.log("Error", error);
  //   });

  const GetCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
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
  if (Object.keys(song).length > 0) {
    console.log("The song object has properties:", song);
  } else {
    console.log("The song object is empty.");
  }

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
      <MusicPlayer {...song} />
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
      <Button onClick={logoutSpotify}>Switch account</Button>
    </Grid2>
  );
};
export default Room;
