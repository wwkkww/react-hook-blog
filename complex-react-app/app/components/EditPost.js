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
    loading: true,
    saveIsLoading: false,
  };

  function postReducer() {}

  const [state, dispatch] = useImmerReducer(postReducer, originalState);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: fetchRequest.token,
        });
        console.log(response);

        setPost(response.data);
        setIsLoading(false);
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

  if (isLoading)
    return (
      <Page title="loading...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
            // onChange={(e) => setTitle(e.target.value)}
            value={post.title}
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
            //onChange={(e) => setBody(e.target.value)}
            value={post.body}
          />
        </div>

        <button className="btn btn-primary">Save Update</button>
      </form>
    </Page>
  );
}

export default EditPost;
