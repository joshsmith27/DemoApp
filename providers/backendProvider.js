import React from 'react';

export const Context = React.createContext({});

export const Provider = (props) => {
  return <Context.Provider value={{}}>{props.children}</Context.Provider>;
};
