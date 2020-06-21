import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfilePost() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchRequest = Axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: fetchRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log('error', error);
      }
    }
    fetchPosts();

    return () => {
      fetchRequest.cancel();
    };
  }, []);

  if (isLoading) return <LoadingDotsIcon />;
  return (
    <div className="list-group">
      {posts &&
        posts.map((post) => {
          const date = new Date(post.createdDate);
          const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={post.author.avatar} />{' '}
              <strong> {post.title} </strong>
              <span className="text-muted small">on {dateFormatted}</span>
            </Link>
          );
        })}
    </div>
  );
}

export default ProfilePost;
