import React, { useContext, useEffect } from "react";


// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ScrollToTop from "./components/scroll-to-top";
import { StyledChart } from "./components/chart";
import  ShowAlert  from "./components/alert";


import { useSocket } from "./contexts/SocketContext";
import { SetAlertContext } from "./contexts/AlertContext";



export default function App() {
  const socket = useSocket();
  const setAlertContext = useContext(SetAlertContext);

  useEffect(() => {
    socket.on("hello", (msg) => {
      console.log("hello", msg);
      setAlertContext({
        type:'success',
        message: `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
      });
    });
  }, [socket]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
      <ShowAlert />
    </ThemeProvider>
  );
}
