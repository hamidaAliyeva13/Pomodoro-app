import React, { useEffect, useRef, useState } from "react";
import PlayIcon from "../assets/PlayIcon.svg";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PauseIcon from '../assets/PauseIcon.svg'
import "./timer.scss";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
const Timer = () => {
  //States
  const [progress, setProgress] = useState(15 * 60);
  const [isPaused, setIsPaused] = useState(true);
  const [initialTime, setInitialTime] = useState(15 * 60);
  const [isRest, setIsRest] = useState(false);
  //Ref
  const intervalRef = useRef<number | null>(null);

  //Methods
  const handlePlay = () => {
    if (!isPaused) return;
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsPaused(true);
    setProgress(initialTime);
  };
  const handlePause = () => {
    setIsPaused(true);
  };
  
  const handlePlus = () => {
    setIsPaused(true);

    setProgress(initialTime + 60)
    setInitialTime((prev)=>prev + 60)
  }
  
  const handleMinus = () => {
    setIsPaused(true);

    setProgress(initialTime - 60)
    setInitialTime((prev)=>prev - 60)
  }

  useEffect(() => {
    if (!isPaused && progress > 0) {
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 1000);
    } else if (progress === 0) {
      setIsRest(!isRest);
      console.log(isRest);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [progress, isPaused]);

  useEffect(() => {
    if (isRest) {
      setProgress(5 * 60);
      setInitialTime(5 * 60);
    }else{
      setProgress(15 * 60);
      setInitialTime(15 * 60);
      setIsPaused(true)
    }
  },[isRest]);

  const minutes = Math.floor(progress / 60);
  const seconds = progress % 60;

  return (
    <div className="timer">
      <Box position="relative" display="inline-flex">
        <CircularProgress
          thickness={5}
          variant="determinate"
          style={{
            color: !isRest ? "#B30000" : "#B0E0E6",
            strokeLinecap: "round",
          }}
          value={(progress / initialTime) * 100}
          size={200}
        />

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" component="div" color="textSecondary">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>
      <div className="timer__settings flex align_center justify_center">
          <Button onClick={handlePlus}>
            +
          </Button>
          <p>
            {String(Math.floor(initialTime / 60)).padStart(2, "0")}:
            {String(initialTime % 60).padStart(2, "0")}
          </p>
          <Button onClick={handleMinus}>
            -
          </Button>
      </div>
      <div className="timer__text">
        <Button onClick={handlePlay}>
          <PlayIcon />
        </Button>
        <Button onClick={handlePause}>
          <PauseIcon />
        </Button>
        <Button onClick={handleStop}>
          <RestartAltIcon color="error" fontSize="large" />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
