// react
import  {  useContext } from "react";

// @mui
import {
    Stack,
    Alert,
    Snackbar,
  } from "@mui/material";

// Context
import { AlertContext, SetAlertContext } from "../../contexts/AlertContext";


// ----------------------------------------------------------------------
  
    
export default function ShowAlert() {

  const alertContext = useContext(AlertContext);
  const setAlertContext = useContext(SetAlertContext);

  return (
      <Stack>
        <Snackbar
          open={alertContext.message}
          autoHideDuration={4000}
          onClose={() => {
            setAlertContext({
              type: '',
              message: null
            });
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setAlertContext({
                type: '',
                message: null
              });
            }}
            severity={alertContext.type}
          >
            {alertContext.message}
          </Alert>
        </Snackbar>
      </Stack>
  );
}
  