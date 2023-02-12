import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    socket.on("hello", (msg, time) => {
      console.log("hello", msg, time);
    });
  }, [socket]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
