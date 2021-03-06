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
import { Link, RouteComponentProps } from '@reach/router';
import { useForm, Controller } from 'react-hook-form';

import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

async function createUser({ userName, password }: { userName: string; password: string }) {
  return {
    loggedIn: true,
    user: {
      userName,
      displayName: userName,
      id: '1',
      isAdmin: true,
    },
  };
}

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
  unknown?: string;
};

const defaultErrors: FormErrors = {
  username: '',
  password: '',
  unknown: '',
};

export type SignUpProps = RouteComponentProps;
export function SignUp(props: SignUpProps) {
  const { navigate } = props;
  const appContext = useContext(AppContext);
  const [, setUser] = useContext(UserContext);
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });
  const [errors, setErrors] = useState<FormErrors>(defaultErrors);
  const classes = useStyles();

  const onSubmit = (data: FormValues) => {
    const { username, password } = data;
    if (!username || !password) {
      setErrors({
        username: !username ? 'Username is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }
    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }
    createUser({ userName: username, password: password })
      .then((res) => {
        if (res.loggedIn) {
          setUser({ ...res.user, loggedIn: true });
          return navigate(`/`);
        }
        throw new Error('Unable to login');
      })
      .catch(() => {
        setErrors({ unknown: 'Error creating new user account, please try again later' });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="h2" align="center">
          Graphql Admin Template
        </Typography>
        <Avatar className={classes.avatar} src={`${appContext.basePathPrefix}/logo_512x512.png`} />
        <Typography component="h1" variant="h5">
          Create new account
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

          <FormHelperText error>{errors.unknown}</FormHelperText>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Create account
          </Button>
          <Box mt={2} />
          <Typography align="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
