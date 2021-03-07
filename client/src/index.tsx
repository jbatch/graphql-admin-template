import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';

import { App } from './App';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const theme = responsiveFontSizes(createMuiTheme());
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
