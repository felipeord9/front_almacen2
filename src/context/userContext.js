import { useState, createContext } from "react";

const Context = createContext({});

export function UserContextProvider({ children }) {
  const [colaborator, setColaborator] = useState(null);

  return (
    <Context.Provider value={{ colaborator, setColaborator }}>{children}</Context.Provider>
  );
}

export default Context;
