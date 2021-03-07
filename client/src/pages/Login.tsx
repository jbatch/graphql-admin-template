import React, { useState, useContext } from 'react';

import {
  makeStyles,
  Container,
  CssBaseline,
  FormHelperText,
  Button,
  Avatar,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, RouteComponentProps } from '@reach/router';
import { useForm, Controller } from 'react-hook-form';
import { useLoginMutation } from '../generated/graphql';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    height: theme.spacing(30),
    width: theme.spacing(30),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type FormValues = {
  username: string;
  password: string;
};

const defaultValues: FormValues = {
  username: '',
  password: '',
};

type FormErrors = {
  username?: string;
  password?: string;
  login?: string;
};

const defaultErrors: FormErrors = {
  username: '',
  password: '',
  login: '',
};

async function attemptLogin(username: string, password: string) {
  return { loggedIn: true, user: { username } };
}

type RouteState = { location?: { state: { nextUrl: string } } };
export type LoginProps = RouteComponentProps & RouteState;
export function Login(props: LoginProps) {
  const { navigate } = props;
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });
  const [errors, setErrors] = useState<FormErrors>(defaultErrors);
  const classes = useStyles();
  const [loginMutation, loginRes] = useLoginMutation();

  const onSubmit = async (data: FormValues) => {
    const { username, password } = data;
    if (!username || !password) {
      setErrors({
        username: !username ? 'Username is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }
    const res = await loginMutation({ variables: { username, password } });
    const { errors, user } = res.data.login;
    console.log('Logged in as', { user });
    if (errors && errors.length) {
      return setErrors({ login: errors[0].message });
    }
    if (props.location.state?.nextUrl) return navigate(props.location.state.nextUrl);
    else navigate('/');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="h2" align="center">
          Graphql Admin Template
        </Typography>
        <Avatar className={classes.avatar} src={`/logo_512x512.png`}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="username"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                error={!!errors.username}
                helperText={errors.username}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <FormHelperText error>{errors.login}</FormHelperText>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Box mt={2} />
          <Typography align="center">
            Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
