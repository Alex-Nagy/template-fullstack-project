import { useContext, createContext, useState } from "react";
const CounterContext = createContext();

const CounterProvider = ({ children }) => {
  const [value, setValue] = useState(0);

  const inc = () => {
    setValue(value + 1);
  };

  const dec = () => {
    setValue(value - 1);
  };

  const contextValue = { value, inc, dec }
  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  );
};

const useCounter = () => {
  return useContext(CounterContext);
};

export { CounterProvider, useCounter };
