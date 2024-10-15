import React, { Component } from "react";
import { useParams } from "react-router-dom";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guessCanPause: false,
      isHost: false,
    };

    this.roomCode = this.props.roomCode;
  }

  render() {
    return (
      <div>
        <h3>{this.roomCode}</h3>
        <p>Votes to Skip: {this.state.votesToSkip}</p>
        <p>Guess Can Pause: {this.state.guessCanPause}</p>
        <p>Is Host: {this.state.isHost}</p>
      </div>
    );
  }
}
function fuctionWrapper(props) {
  const { roomCode } = useParams();
}
