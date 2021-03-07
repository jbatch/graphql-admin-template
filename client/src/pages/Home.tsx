import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useLoginMutation } from '../api';
import request, { gql } from 'graphql-request';
import { useMeQuery } from '../generated/graphql';

const useStyles = makeStyles((theme) => ({}));

type HomeProps = RouteComponentProps & {};
export function Home(props: HomeProps) {
  const classes = useStyles();
  const { data: me } = useMeQuery();

  return <div>Home, welcome: {JSON.stringify(me)}</div>;
}
