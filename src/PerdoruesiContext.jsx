import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const PerdoruesiContext = createContext();

const PerdoruesiProvider = ({ children }) => {
  const [perdoruesiData, setPerdoruesiData] = useState(null);

  useEffect(() => {
    const fetchPerdoruesiData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/kycja/perdoruesi",
          { withCredentials: true },
        );

        if (response.data.success) {
          setPerdoruesiData(response.data.perdoruesiObj);
        }
      } catch (error) {
        console.error(error);
        setPerdoruesiData(null);
      }
    };

    fetchPerdoruesiData();
  }, []);

  return (
    <PerdoruesiContext.Provider
      value={{
        perdoruesiData,
        setPerdoruesiData,
      }}
    >
      {children}
    </PerdoruesiContext.Provider>
  );
};

const usePerdoruesi = () => {
  const context = useContext(PerdoruesiContext);

  if (context === undefined) {
    throw new Error("usePerdoruesi must be used within a PerdoruesiProvider");
  }

  return context;
};

const Perdoruesi = {
  Provider: PerdoruesiProvider,
  usePerdoruesi: usePerdoruesi,
  Context: PerdoruesiContext,
};

export default Perdoruesi;
