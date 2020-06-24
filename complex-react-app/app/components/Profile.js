import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import Page from './Page';
import StateContext from '../StateContext';
import ProfilePost from './ProfilePost';

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  // const [profileData, setProfileData] = useState({
  //   profileUsername: '...',
  //   profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
  //   isFollowing: false,
  //   counts: {
  //     followerCount: 0,
  //     followingCount: 0,
  //     postCount: 0,
  //   },
  // });
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: {
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
      },
    },
  });

  useEffect(() => {
    const fetchRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          { token: appState.user.token },
          { cancelToken: fetchRequest.token }
        );
        console.log(response.data);
        // setProfileData(response.data);
        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log('error', error);
      }
    }
    fetchData();
    return () => {
      fetchRequest.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      const fetchRequest = Axios.CancelToken.source();
      setState(draft => {
        draft.followActionLoading = true;
      });
      async function fetchData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: fetchRequest.token }
          );

          // setProfileData(response.data);
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('error', error);
        }
      }
      fetchData();
      return () => fetchRequest.cancel();
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      const fetchRequest = Axios.CancelToken.source();
      setState(draft => {
        draft.followActionLoading = true;
      });
      async function fetchData() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: fetchRequest.token }
          );

          // setProfileData(response.data);
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('error', error);
        }
      }
      fetchData();
      return () => fetchRequest.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Page title="Profile screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}

        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== '...' && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}

        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== '...' && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePost />
    </Page>
  );
}

export default Profile;
