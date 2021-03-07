import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({}));

type ErrorProps = { error: string };
export function Error(props: ErrorProps) {
  const { error } = props;
  const classes = useStyles();

  return (
    <div>
      <div>Error Page</div>
      <div>{error}</div>
    </div>
  );
}
