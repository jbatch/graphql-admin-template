import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps, useLocation, useNavigate } from '@reach/router';
import { Errors } from '@repo/shared/Errors';
import { useMeQuery } from '../api';
import { Loading } from './Loading';
import { Error } from './Error';

const useStyles = makeStyles((theme) => ({}));

type AdminUIProps = RouteComponentProps & {};
export function AdminUI(props: AdminUIProps) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isError, error, data } = useMeQuery();

  if (isLoading) return <Loading />;
  if (isError) {
    if (error.message === Errors.NOT_AUTHENTICATED) {
      navigate('login', { state: { nextUrl: location.pathname } });
    }
    return <Error error={error.message} />;
  }
  const { username } = data.user;

  return <div>AdminUI - Hello {username}</div>;
}
