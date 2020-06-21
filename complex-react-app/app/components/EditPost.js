import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import Page from './Page';
import LoadingDotsIcon from './LoadingDotsIcon';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: '',
      hasErrors: false,
      message: '',
    },
    body: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  };

  function postReducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case 'titleChange':
        draft.title.value = action.value;
        return;
      case 'bodyChange':
        draft.body.value = action.value;
        return;
      case 'submitRequest':
        draft.sendCount++;
        return;
      case 'savingRequest':
        draft.isSaving = true;
        return;
      case 'requestSaved':
        draft.isSaving = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(postReducer, originalState);
  /** REPLACE with reducer */
  // const [isLoading, setIsLoading] = useState(true);
  // const [post, setPost] = useState();
  // const { id } = useParams();

  useEffect(() => {
    const fetchRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: fetchRequest.token,
        });
        console.log(response);
        /** REPLACE with reducer */
        // setPost(response.data);
        // setIsLoading(false);
        dispatch({ type: 'fetchComplete', value: response.data });
      } catch (error) {
        console.log('error', error);
      }
    }
    fetchPost();

    // clean up before unmounted
    return () => {
      fetchRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'savingRequest' });

      const fetchRequest = Axios.CancelToken.source();
      async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            { title: state.title.value, body: state.body.value, token: appState.user.token },
            {
              cancelToken: fetchRequest.token,
            }
          );
          console.log(response);
          dispatch({ type: 'requestSaved' });
          /** REPLACE with reducer */
          // setPost(response.data);
          // setIsLoading(false);

          appDispatch({ type: 'flashMessage', value: 'Post was updated successfully' });
        } catch (error) {
          console.log('error', error);
        }
      }
      fetchPost();

      // clean up before unmounted
      return () => {
        fetchRequest.cancel();
      };
    }
  }, [state.sendCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'submitRequest' });
    console.log(originalState);
    console.log(state);
  }

  if (state.isFetching)
    return (
      <Page title="loading...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={e => dispatch({ type: 'titleChange', value: e.target.value })}
            value={state.title.value}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={e => dispatch({ type: 'bodyChange', value: e.target.value })}
            value={state.body.value}
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Update
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
