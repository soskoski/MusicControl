import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    GetRoomDetails();
  }, [roomCode]);

  const GetRoomDetails = () => {
    fetch(`/api/getRoom?code=${roomCode}`)
      .then((response) => response.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guess_can_pause);
        setIsHost(data.is_host);

        console.log("Extracted Room Code:", roomCode);
        console.log("API Response Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching Room details:", error);
      });
  };

  return (
    <div>
      <p>Room Code: {roomCode}</p>
      <p>Votes to Skip: {votesToSkip}</p>
      <p>Guess Can Pause: {guestCanPause ? "YES" : "NO".toString()}</p>
      <p>Is Host: {isHost ? "YES" : "NO".toString()}</p>
    </div>
  );
};

export default Room;
