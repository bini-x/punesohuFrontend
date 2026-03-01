import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (message, type = "info") => {
    setAlert({ open: true, message, type });
  };

  const hideAlert = () => {
    setAlert({ open: false, message: "", type: "info" });
  };

  const showConfirm = (message, title, onConfirm) => {
    setConfirm({
      open: true,
      title: title || "Konfirmo veprimin",
      message: message || "Jeni të sigurt që dëshironi të vazhdoni?",
      onConfirm: onConfirm,
    });
  };

  const hideConfirm = () => {
    setConfirm({
      open: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });
  };

  return (
    <AlertContext.Provider
      value={{ alert, showAlert, hideAlert, confirm, showConfirm, hideConfirm }}
    >
      {children}
    </AlertContext.Provider>
  );
};
