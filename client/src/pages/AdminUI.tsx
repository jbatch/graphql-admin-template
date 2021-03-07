import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps, useNavigate } from '@reach/router';
import { Errors } from '@repo/shared/Errors';
import { useMeQuery } from '../api';
import { Loading } from './Loading';
import { Error } from './Error';

const useStyles = makeStyles((theme) => ({}));

type AdminUIProps = RouteComponentProps & {};
export function AdminUI(props: AdminUIProps) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useMeQuery();

  console.log('Rendering adming', { isLoading, isError, error, data });

  if (isLoading) return <Loading />;
  if (isError) {
    if (error.message === Errors.NOT_AUTHENTICATED) {
      console.log('Navigating:', window.location.href);
      const url = `login?next=${window.location.href}`;
      navigate(url, { replace: true });
    }
    return <Error error={error.message} />;
  }
  const { username } = data.user;

  return <div>AdminUI - Hello {username}</div>;
}
