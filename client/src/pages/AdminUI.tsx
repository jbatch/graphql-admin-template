import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

const useStyles = makeStyles((theme) => ({}));

type AdminUIProps = RouteComponentProps & {};
export function AdminUI(props: AdminUIProps) {
  const classes = useStyles();

  return <div>AdminUI</div>;
}
