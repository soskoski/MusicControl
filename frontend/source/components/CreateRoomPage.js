import React, { Component } from "react";
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
} from "@mui/material";
import { json, Link } from "react-router-dom";

export default class CreateRoom extends Component {
  defaultVotes = 2;

  constructor(props) {
    super(props);

    this.state = {
      GuessCanpause: true,
      VotesToSkip: this.defaultVotes,
    };

    this.handleCreateRoomButtonPressed =
      this.handleCreateRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuessCanPauseChange = this.handleGuessCanPauseChange.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      VotesToSkip: e.target.value,
    });
  }
  handleGuessCanPauseChange(e) {
    this.setState({
      GuessCanpause: e.target.value === "true" ? true : false,
    });
  }

  handleCreateRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.VotesToSkip,
        guess_can_pause: this.state.GuessCanpause,
      }),
    };

    fetch("/api/createRoom", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  render() {
    return (
      <Grid2
        container
        spacing={1}
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        style={{ height: "100vh" }}
      >
        <Grid2 item="true" xs={12} alignItems={"center"}>
          <Typography component="h4" variant="h4">
            Create a Room
          </Typography>
        </Grid2>
        <Grid2 alignItems={"center"}>
          <FormControl>
            <FormHelperText>Guess Controll of Playback State</FormHelperText>
            <RadioGroup
              row
              defaultValue="true"
              onChange={this.handleGuessCanPauseChange}
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
              defaultValue={this.defaultVotes}
              onChange={this.handleVotesChange}
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
        <Grid2 item="true" xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleCreateRoomButtonPressed}
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
  }
}
