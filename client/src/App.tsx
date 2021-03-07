import React, { useContext, useEffect } from 'react';
import { CircularProgress, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { navigate, Router, useLocation, useMatch } from '@reach/router';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { UserResponse } from '@repo/shared/User';

import { AdminUI } from './pages/AdminUI';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { useMeQuery } from './api';

const theme = responsiveFontSizes(createMuiTheme());

type AppProps = {
  children?: React.ReactNode;
};
export function App(props: AppProps) {
  console.log('rendering app');
  return (
    <Router basepath={'/'}>
      <Login path="/login" />
      <SignUp path="/sign-up" />
      <AdminUI path="/admin" />
      <Home default path="/" />
    </Router>
  );
}
