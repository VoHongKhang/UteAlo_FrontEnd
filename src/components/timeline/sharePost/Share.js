import React, { useEffect, useState } from 'react';
import './Share.css';
import { PermMedia, Room, Cancel } from '@material-ui/icons';
import { Box, CircularProgress } from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import InputEmoji from 'react-input-emoji';
import { Country } from 'country-state-city';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import noAvatar from '../../../assets/appImages/user.png';


// Extract only the required functions from 'useAuth' and 'usePost'
import useAuth from '../../../context/auth/AuthContext';
import usePost from '../../../context/post/PostContext';

const Share = ({ fetchPosts }) => {
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState('');
  const [postGroupId, setPostGroupId] = useState('');
  const [url, setUrl] = useState('');
  const [picLoading, setPicLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveUser, setLiveUser] = useState(null);

  const { user } = useAuth();
  const { createPost, createLoading } = usePost();



  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error('Please Select an Image!');
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'splash-social_media');
      data.append('cloud_name', 'splashcloud');
      fetch('https://api.cloudinary.com/v1_1/splashcloud/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.secure_url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicLoading(false);
        });
    } else {
      toast.error('Please select an image with png/jpg type');
      setPicLoading(false);
      return;
    }
  };

  const postSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const newPost = {
        location: location || '',
        content: content || '',
        photos: photos || '',
        postGroupId: postGroupId || 0,
      };

      if (!newPost.content) {
        toast.error('Vui lòng nhập nội dung!');
        return;
      }

      // Gọi hàm createPost để tạo bài viết mới
      await createPost(newPost.location, newPost.content, newPost.photos, newPost.postGroupId);

      // Sau khi createPost hoàn thành, gọi fetchPosts để cập nhật danh sách bài viết
      fetchPosts();

      // Xóa nội dung và ảnh đã chọn
      setLocation('');
      setContent('');
      setPhotos('');
      setPostGroupId('');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi tạo bài viết.');
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };

      try {
        const res = await axios.get(`${BASE_URL}/v1/user/profile/${user.userId}`, config);
        const userData = res.data.result;
        setLiveUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user.userId, user.accessToken]);

  if(isLoading) return <div>Loading...</div>;

  return (
    <>
      <Toaster />
      <div className="share">
        <form className="shareWrapper" onSubmit={postSubmitHandler}>
          <div className="shareTop">
            <img
              className="shareProfileImg"
              src={liveUser?.avatar || noAvatar}
              alt="..."
            />
            <InputEmoji
              value={content}
              onChange={setContent}
              placeholder={`What's on your mind ${liveUser?.fullName}?`}
            />
          </div>
          <hr className="shareHr" />
          {picLoading && (
            <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress color="secondary" />
            </Box>
          )}
          {url && (
            <div className="shareImgContainer">
              <img className="shareimg" src={url} alt="..." />
              <Cancel className="shareCancelImg" onClick={() => setUrl(null)} />
            </div>
          )}
          <div className="shareBottom">
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo</span>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </label>
              <div className="shareOption">
                <label htmlFor="loc" className="shareOption">
                  <Room htmlColor="green" className="shareIcon" />
                  <select
                    id="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option>Location</option>
                    {Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.name} id="loc">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="shareOption">
                <label htmlFor="postGroupId" className="shareOption">
                  <select
                    id="postGroupId"
                    value={postGroupId}
                    onChange={(e) => setPostGroupId(parseInt(e.target.value))}
                  >
                    <option value={-1}>Only Me</option>
                    <option value={0}>Public</option>
                    {liveUser?.postGroup?.map((item) => (
                      <option key={item.postGroupId} value={item.postGroupId}>
                        {item.postGroupName}
                      </option>
                    ))}
                  </select>
                  <span style={{ marginRight: '5px' }}>&#9660;</span>
                </label>
              </div>
            </div>
            <button
              className="shareButton"
              type="submit"
              disabled={createLoading}
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Share;
