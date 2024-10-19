// import React, { Component } from "react";
// import { useParams } from "react-router-dom";

// export default class Room extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       guessCanPause: false,
//       isHost: false,
//     };
//   }

//   render() {
//     const pars = this.props.params;
//     console.log(pars);
//     return (
//       <div>
//         {/* <p>Room Code: {roomCode}</p> */}
//         <p>Votes to Skip: {this.state.votesToSkip}</p>
//         <p>Guess Can Pause: {this.state.guessCanPause}</p>
//         <p>Is Host: {this.state.isHost}</p>
//       </div>
//     );
//   }
// }

// function RoomWrapper(props) {
//   const { roomCode } = useParams();
//   return <Room {...props} roomCode={roomCode} />;
// }

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
