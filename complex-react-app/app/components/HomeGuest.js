import React, { useState, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import Page from './Page';
import Axios from 'axios';

function HomeGuest() {
  /**
   * ! REPLACE with useImmerReducer
   */
  // const [username, setUsername] = useState();
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();

  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0, // +1 when axios call to verify username exist
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0, // +1 when axios call to verify email exist
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    submitCount: 0, // +1 when axios call to register user
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'usernameImmediately':
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 20) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username cannot exceed 20 characters.';
        }
        // only allow alphanumeric username
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username can only contain letters and numbers.';
        }
        return;
      case 'usernameDelay':
        // draft.username.hasErrors = false;
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username must be at least 3 characters.';
        }
        if (!draft.username.hasErrors) {
          draft.username.checkCount++;
        }
        return;
      case 'usernameUnique':
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = 'Username is already taken.';
        } else {
          draft.username.isUnique = true;
        }
        return;
      case 'emailImmediately':
        // no checking done immediately after user type
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailDelay':
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please provide a valid email address.';
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++;
        }
        return;
      case 'emailUnique':
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = 'This email is already being used.';
        } else {
          draft.email.isUnique = true;
        }
        return;
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        return;
      case 'passwordDelay':
        return;
      case 'submitForm':
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: 'usernameDelay' });
      }, 600);

      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: 'emailDelay' });
      }, 600);

      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: 'passwordDelay' });
      }, 600);

      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            '/doesUsernameExist',
            { username: state.username.value },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: 'usernameUnique', value: response.data });
        } catch (error) {
          console.log('error fetch result', error);
        }
      }
      fetchResult();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            '/doesEmailExist',
            { email: state.email.value },
            { cancelToken: ourRequest.token }
          );
          console.log(response);

          dispatch({ type: 'emailUnique', value: response.data });
        } catch (error) {
          console.log('error fetch result', error);
        }
      }
      fetchResult();
      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);

  function handleSubmit(e) {
    e.preventDefault();

    /**
     * ! REPLACE with useImmerReducer
     */
    // try {
    //   await Axios.post('/register', {
    //     username,
    //     email,
    //     password,
    //   });
    //   console.log('User is created');
    // } catch (error) {
    //   console.log('There was an error', error.response.data);
    // }
  }

  return (
    <Page title="Home" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are
            reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually
            writing is the key to enjoying the internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                // onChange={e => setUsername(e.target.value)}
                onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })}
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={500}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                // onChange={e => setEmail(e.target.value)}
                onChange={e => dispatch({ type: 'emailImmediately', value: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                // onChange={e => setPassword(e.target.value)}
                onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })}
              />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
