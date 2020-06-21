import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import Page from './Page';
import LoadingDotsIcon from './LoadingDotsIcon';

function EditPost() {
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

  if (state.isFetching)
    return (
      <Page title="loading...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <form>
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
            onChange={(e) => console.log(e.target.value)}
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
            onChange={(e) => console.log(e.target.value)}
            value={state.body.value}
          />
        </div>

        <button className="btn btn-primary">Save Update</button>
      </form>
    </Page>
  );
}

export default EditPost;
