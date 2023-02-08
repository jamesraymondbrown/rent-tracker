import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DataBaseContext = createContext();

export const DataBaseProvider = ({ children }) => {

  const [state, setState] = useState({
    users: null,
    properties: null,
    prices: null,
  });

  useEffect(() => {
    const usersURL = `http://localhost:8001/users`;
    const propertiesURL = `http://localhost:8001/properties`;
    const pricesURL = `http://localhost:8001/prices`;
    Promise.all([
      axios.get(usersURL),
      axios.get(propertiesURL),
      axios.get(pricesURL),
    ]).then((all) => {
      let dbUsers = all[0].data;
      let dbProperties = all[1].data;
      let dbPrices = all[2].data;
      setState((prev) => ({
        ...prev,
        users: dbUsers,
        properties: dbProperties,
        prices: dbPrices,
      }));
    });
  }, [setState]);

  return (
    <DataBaseContext.Provider
      value={{
        state
      }}
    >
      {children}
    </DataBaseContext.Provider>
  );
};
