// react
import React, { createContext, useState } from "react";

// ----------------------------------------------------------------------


export const AlertContext = createContext(null);
export const SetAlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({type: null, message: null});

  return (
    <AlertContext.Provider value={alert}>
      <SetAlertContext.Provider value={setAlert}>
        {children}
      </SetAlertContext.Provider>
    </AlertContext.Provider>
  );
};
