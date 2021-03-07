import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';

import { App } from './App';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const theme = responsiveFontSizes(createMuiTheme());
const queryClient = new QueryClient();
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <AppContextProvider>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </AppContextProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
