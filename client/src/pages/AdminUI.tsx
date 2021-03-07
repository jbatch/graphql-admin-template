import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps, useLocation, useNavigate } from '@reach/router';

import { useMeQuery } from '../generated/graphql';
import { Loading } from './Loading';
import { Error } from './Error';

const useStyles = makeStyles((theme) => ({}));

type AdminUIProps = RouteComponentProps & {};
export function AdminUI(props: AdminUIProps) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, data } = useMeQuery();

  if (loading) return <Loading />;
  const { user, errors } = data.me;

  if (errors && errors.length) {
    // if (error.message === Errors.NOT_AUTHENTICATED) {
    if (errors[0].message === 'NOT_AUTHENTICATED') {
      navigate('login', { state: { nextUrl: location.pathname } });
    }
    return <Error error={errors[0].message} />;
  }

  return <div>AdminUI - Hello {user.username}</div>;
}
