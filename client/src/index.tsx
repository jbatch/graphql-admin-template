import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';

import { App } from './App';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

const theme = responsiveFontSizes(createMuiTheme());

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
