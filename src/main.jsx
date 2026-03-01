import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Perdoruesi from "./PerdoruesiContext.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Perdoruesi.Provider>
      <App />
    </Perdoruesi.Provider>
  </StrictMode>,
);
