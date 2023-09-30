import React, { useEffect, useState } from "react";
import "./Feed.css";
import { useParams } from "react-router-dom";
import PostCard from "../post/PostCard";
import Share from "../sharePost/Share";
import { Box, CircularProgress } from "@material-ui/core";
import useAuth from "../../../context/auth/AuthContext";
import useTheme from "../../../context/ThemeContext";
import axios from "axios";
import { BASE_URL } from "../../../context/apiCall";

const Feed = () => {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  


  const fetchPosts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/v1/post/${currentUser.userId}/posts`,
        config
      );
      setLoading(false);
      setPosts(
        res.data.result
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userId, currentUser.accessToken]);

  return (
    <div
      className="feed"
      style={{ color: theme.foreground, background: theme.background }}
    >
      <div className="feedWrapper">
        {(!params.userId || params.userId === currentUser.userId) && (
          <Share fetchPosts={fetchPosts} />
        )}
        {loading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {posts.length === 0 ? (
          <h2 style={{ marginTop: "20px" }}>No posts yet!</h2>
        ) : (
          posts.map((p) => (
            <PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
