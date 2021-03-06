import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

const useStyles = makeStyles((theme) => ({}));

type HomeProps = RouteComponentProps & {};
export function Home(props: HomeProps) {
  const classes = useStyles();

  return <div>Home</div>;
}
