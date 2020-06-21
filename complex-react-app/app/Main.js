import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import Axios from 'axios';
Axios.defaults.baseURL = 'http://localhost:8080';

// Component
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import FlashMessages from './components/FlashMessages';
import Profile from './components/Profile';
// import ExampleContext from './ExampleContext';
import EditPost from './components/EditPost';
import NotFound from './components/NotFound';

function Main() {
  /**
   * ! #1. REACT useReducer
   * -  useReducer accept the original state as args. Never directly mutate the state
   * -  CONS: need to reconstruct the whole state object entirely (if thousands of state object)
   */
  // const [state, dispatch] = useReducer(ourReducer, initialState);
  // function ourReducer(state, action) {
  //   switch (action.type) {
  //     case 'login':
  //       return { loggedIn: true, flashMessages: state.flashMessages };
  //     case 'logout':
  //       return { loggedIn: false, flashMessages: state.flashMessages };
  //     case 'flashMessage':
  //       return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) };
  //   }
  // }

  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar'),
    },
  };

  /**
   * ! #2. IMMER userImmerReducer
   * -  PROS: immer use "draft" as a clone copy of state. We are free to modify it
   */
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'flashMessage':
        draft.flashMessages.push(action.value); // we can modify the array now
        return;
    }
  }

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('complexappToken', state.user.token);
      localStorage.setItem('complexappUsername', state.user.username);
      localStorage.setItem('complexappAvatar', state.user.avatar);
    } else {
      localStorage.removeItem('complexappToken');
      localStorage.removeItem('complexappUsername');
      localStorage.removeItem('complexappAvatar');
    }
  }, [state.loggedIn]);

  /**
   * REPLACE WITH REDUCER
   */
  // const [loggedIn, setLoggedIn] = useState();
  // const [flashMessages, setFlashMessages] = useState([]);
  // function addFlashMessage(msg) {
  //   setFlashMessages((prev) => prev.concat(msg));
  // }

  return (
    // <ExampleContext.Provider value={{state, dispatch}}>
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
    // </ExampleContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector('#app'));

// Load js on the fly (without refresh browser)
if (module.hot) {
  module.hot.accept();
}
