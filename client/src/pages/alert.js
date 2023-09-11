import {
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";


// theme
import ThemeProvider from "../theme";
// components
import ScrollToTop from "../components/scroll-to-top";
import { StyledChart } from "../components/chart";


// ----------------------------------------------------------------------



export default function ShowAlert(data={}) {

  const {alertType, alertMessage, setAlertMessage}=data.data

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      {/* <Router /> */}
      <Stack>
        <Snackbar
          open={alertMessage}
          autoHideDuration={5000}
          onClose={() => {
            setAlertMessage(null);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setAlertMessage(null);
            }}
            severity={alertType}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </ThemeProvider>
  );
}
