import React, { useEffect, useRef, useState } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "../assets/PauseIcon.svg";
import RemoveIcon from "@mui/icons-material/Remove";
import "./timer.scss";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const Timer = () => {
  //States
  const [progress, setProgress] = useState(15 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isPaused, setIsPaused] = useState(true);
  const [initialTime, setInitialTime] = useState(15 * 60);
  const [isRest, setIsRest] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(progress / 60));
  const [seconds, setSeconds] = useState(progress % 60);
  const [sessionLength, setSessionLength] = useState(0);
  const [breakLength, setBreakLength] = useState(0);
  //Ref
  const intervalRef = useRef<number | null>(null);

  //Methods
  const handlePlay = () => {
    if (!isPaused) return;
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsPaused(true);
    setIsRest(false);
    setSessionLength(0)
    setBreakLength(0)
    setProgress(initialTime);
  };
  const handlePause = () => {
    setIsPaused(true);
  };

  const handlePlus = (value: string) => {
    setIsPaused(true);
    if (value === "break") {
      if (isRest) setProgress((prev) => prev + 60);
      setBreakTime((prev) => prev + 60);
    } else {
      setInitialTime((prev) => prev + 60);
      if (!isRest) setProgress((prev) => prev + 60);
    }
  };

  const handleMinus = (value: string) => {
    setIsPaused(true);
    if (value === "break" && breakTime !== 60) {
      if (isRest) setProgress((prev) => prev - 60);
      setBreakTime((prev) => prev - 60);
    } else if (value === "session" && initialTime !== 60) {
      if (!isRest) setProgress((prev) => prev - 60);
      setInitialTime((prev) => prev - 60);
    }
  };

  useEffect(() => {
    if (!isPaused && progress > 0) {
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 1000);
    } else if (progress === 0) {
      if (isRest) {
        setBreakLength((prev) => prev + 1);
      } else {
        setSessionLength((prev) => prev + 1);
      }
      setIsRest(!isRest);
    }
    setMinutes(Math.floor(progress / 60));
    setSeconds(progress % 60);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [progress, isPaused]);

  useEffect(() => {
    if (isRest) {
      setProgress(breakTime);
    } else {
      setProgress(initialTime);
    }
  }, [isRest]);

  return (
    <div className="timer">
      <Box
        bottom={60}
        position="relative"
        justifyContent={"center"}
        display="inline-flex"
      >
        <div
          style={{
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: "grey",
            width:200,
            height: 200,
          }}
        >
          <CircularProgress
            thickness={5}
            // color="primary"
            variant="determinate"
            style={{
              borderRadius: "50%",
              color: !isRest ? "#B30000" : "#B0E0E6",
              strokeLinecap: "round",
              boxShadow: !isRest
                ? "0 0 20px 0px #B30000"
                : "0 0 20px 0px #B0E0E6",
            }}
            value={
              !isRest
                ? (progress / initialTime) * 100
                : (progress / breakTime) * 100
            }
            size={200}
          />
        </div>

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
          <div
            style={{
              aspectRatio: 1,
              borderRadius: "50%",
              backgroundColor: "white",
              height: 155,
              width: 155,
              boxShadow: !isRest
              ? "inset 0 0 20px 0px #B30000"
              : "inset 0 0 20px 0px #B0E0E6",
              alignContent: "center",
              marginTop:10
            }}
          >
            <Typography variant="h4" component="div" color="textSecondary">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Typography>
          </div>
        </Box>
      </Box>
      
      <Box
       position="relative"
      bottom={40}
       className="timer__text">
        <Button onClick={handlePlay}>
          <PlayCircleIcon color="info" fontSize="large" />
        </Button>
        <Button onClick={handlePause}>
          <PauseIcon />
        </Button>
        <Button onClick={handleStop}>
          <ReplayCircleFilledIcon color="error" fontSize="large" />
        </Button>
      </Box>
      <Box display="flex">
        <div className="settingstime">
          <Typography variant="h6" >Break Time</Typography>
          <div className="timer__settings flex align_center justify_center">
            <Button onClick={() => handlePlus("break")}>
              <AddIcon color="info" fontSize="large" />
            </Button>
            <p>
              {String(Math.floor(breakTime / 60)).padStart(2, "0")}:
              {String(breakTime % 60).padStart(2, "0")}
            </p>
            <Button onClick={() => handleMinus("break")}>
              <RemoveIcon color="info" fontSize="large" />
            </Button>
          </div>
        </div>
        <div className="settingstime">
          <Typography variant="h6">Session Time</Typography>
          <div className="timer__settings flex align_center justify_center">
            <Button onClick={() => handlePlus("session")}>
              <AddIcon color="info" fontSize="large" />
            </Button>
            <p>
              {String(Math.floor(initialTime / 60)).padStart(2, "0")}:
              {String(initialTime % 60).padStart(2, "0")}
            </p>
            <Button onClick={() => handleMinus("session")}>
              <RemoveIcon color="info" fontSize="large" />
            </Button>
          </div>
        </div>
      </Box>

      

      <Box className="timer__lengths">
        <Typography>Sessions:{sessionLength}</Typography>
        <Typography>Breaks:{breakLength}</Typography>
      </Box>
    </div>
  );
};

export default Timer;
