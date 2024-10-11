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
} from "@mui/material";
import { link } from "react-router-dom";

export default class CreateRoom extends Component {
  defaultVotes = 2;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid2 container spacing={1}>
        <Grid2 alignContent={"center"}>
          <Typography component="h4" variant="h4">
            Create a Room
          </Typography>
        </Grid2>
        <Grid2 alignContent={"center"}>
          <FormControl>
            <FormHelperText>Guess Controll of Playback State</FormHelperText>
            <RadioGroup row defaultValue="true">
              <FormControlLabel value="true"></FormControlLabel>
            </RadioGroup>
          </FormControl>
        </Grid2>
      </Grid2>
    );
  }
}
