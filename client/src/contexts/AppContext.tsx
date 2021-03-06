import React, { useState } from 'react';

export type AppContextType = {
  basePathPrefix: string;
};

const defaultAppContext: AppContextType = {
  basePathPrefix: process.env.APP_BASE_PATH,
};
const AppContext = React.createContext<AppContextType>(defaultAppContext);

type Props = {
  children: React.ReactNode;
};
const AppContextProvider = (props: Props) => {
  const [appContext] = useState<AppContextType>(defaultAppContext);

  return <AppContext.Provider value={appContext}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
