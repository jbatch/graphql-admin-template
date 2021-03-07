import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useMeQuery } from '../generated/graphql';

const useStyles = makeStyles((theme) => ({}));

type HomeProps = RouteComponentProps & {};
export function Home(props: HomeProps) {
  const classes = useStyles();
  const res = useMeQuery();

  if (res.loading) return <div>Loading</div>;
  const { user, errors } = res.data.me;

  return <div>Home, welcome: {JSON.stringify(user || errors)}</div>;
}
