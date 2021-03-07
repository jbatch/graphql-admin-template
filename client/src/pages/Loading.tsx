import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({}));

type LoadingProps = {};
export function Loading(props: LoadingProps) {
  const classes = useStyles();

  return (
    <div>
      Loading <CircularProgress />{' '}
    </div>
  );
}
