import React, { useState, useEffect } from "react";
import {
  Grid2,
  IconButton,
  Typography,
  Card,
  LinearProgress,
  duration,
  CardMedia,
  Box,
  CardContent,
  responsiveFontSizes,
} from "@mui/material";
import { PlayArrow, SkipNext, Pause, SkipPrevious } from "@mui/icons-material";

const MusicPlayer = ({
  image_url,
  title,
  artist,
  is_playing,
  duration,
  time,
}) => {
  const [isPlaying, setIsPlaying] = useState(is_playing);

  useEffect(() => {
    console.log("Is playing: ", isPlaying);
  }, [isPlaying]);

  const playSong = () => {
    console.log("playing song");
    const requestOptions = {
      method: "PUT",
      headers: { "content-type": "application/json" },
    };
    fetch("/spotify/play", requestOptions)
      .then((response) => {
        if (response.status === 204) {
          setIsPlaying(true);
        }
        console.log("Play API response: ", response.status);
      })
      .catch((error) => {
        console.error("Error playing song: ", error);
      });
  };

  const pauseSong = () => {
    console.log("pausing song");
    const requestOptions = {
      method: "PUT",
      headers: { "content-type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions)
      .then((response) => {
        if (response.status === 204) {
          setIsPlaying(false);
        }
        console.log("Pause API response: ", response.status);
        // console.log("Is playing: ", isPlaying);
      })
      .catch((error) => {
        console.error("Error pausing song: ", error);
      });
  };

  const songProgress = duration && duration > 0 ? (time / duration) * 100 : 0;

  return (
    // <Card sx={{ display: "flex" }}>
    //   <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
    //     <CardContent sx={{ flex: "1 0 auto" }}>
    //       <Typography component="h5" variant="h5">
    //         {title}
    //       </Typography>
    //       <Typography color="textSecondary" variant="subtitle1">
    //         {artist}
    //       </Typography>
    //     </CardContent>
    //     <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
    //       <IconButton>{<SkipPrevious />}</IconButton>
    //       <IconButton
    //         onClick={() => {
    //           is_playing ? pauseSong() : playSong();
    //           console.log("is playing: ", is_playing);
    //         }}
    //       >
    //         {is_playing ? <Pause /> : <PlayArrow />}
    //       </IconButton>
    //       <IconButton>{<SkipNext />}</IconButton>
    //     </Box>
    //   </Box>
    //   <CardMedia
    //     component="img"
    //     src={image_url}
    //     sx={{
    //       height: "100%",
    //       width: "auto",
    //       maxWidth: "150px",
    //       objectFit: "cover",
    //     }}
    //   />
    //   <LinearProgress variant="determinate" value={songProgress} />
    // </Card>
    <Card style={{ maxWidth: "400px" }}>
      <Grid2 container alignItems="center">
        <Grid2 item="true" align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <IconButton
              onClick={() => {
                console.log("Button pressed, is_playing: ", is_playing);

                is_playing ? pauseSong() : playSong();
              }}
            >
              {is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton>
              <SkipNext />
            </IconButton>
          </div>
        </Grid2>
        <Grid2 item="true" align="center" xs={4}>
          <img
            src={image_url}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "150px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        </Grid2>
      </Grid2>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
