import React, { useState, useEffect } from "react";

import {
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ScrollToTop from "./components/scroll-to-top";
import { StyledChart } from "./components/chart";

import { useSocket } from "./contexts/SocketContext";

export default function App() {
  const socket = useSocket();
  const [wsResponse, setWsResponse] = useState(null);

  useEffect(() => {
    socket.on("hello", (msg) => {
      console.log("hello", msg);
      setWsResponse(
        `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
      );
    });
  }, [socket]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
      <Stack>
        <Snackbar
          open={wsResponse}
          autoHideDuration={5000}
          onClose={() => {
            setWsResponse(null);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setWsResponse(null);
            }}
            severity={"success"}
          >
            {wsResponse}
          </Alert>
        </Snackbar>
      </Stack>
    </ThemeProvider>
  );
}
