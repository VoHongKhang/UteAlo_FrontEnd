import React, { useEffect, useState } from 'react';
import './Share.css';
import noAvatar from '../../../assets/appImages/user.png';
import { PermMedia, Room, Cancel } from '@material-ui/icons';
import useAuth from '../../../context/auth/AuthContext';
import usePost from '../../../context/post/PostContext';
import { Box, CircularProgress } from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import InputEmoji from 'react-input-emoji';
import { Country } from 'country-state-city';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import { Select } from 'antd';

const Share = ({ fetchPosts }) => {
	const [location, setLocation] = useState('');
	const [content, setContent] = useState('');
	const [photos, setPhotos] = useState('');
	const [postGroupId, setPostGroupId] = useState('');
	const [url, setUrl] = useState('');
	const [picLoading, setPicLoading] = useState(false);
	const [liveUser, setLiveUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { user } = useAuth();
	const { createPost, createLoading } = usePost();

	// upload post picture to cloudinary
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
					console.log(err);
					setPicLoading(false);
				});
		} else {
			toast.error('Please select an image with png/jpg type');
			setPicLoading(false);
			return;
		}
	};

	// đăng bài viết
	const postSubmitHandler = (e) => {
		e.preventDefault();
		if (true) {
			const newPost = {
				location: location ? location : '',
				content: content ? content : '',
				photos: photos ? photos : '',
				postGroupId: postGroupId ? postGroupId : 0,
			};

			if (newPost.content === '') {
				toast.error('Vui lòng nhập nội dung!');
				return;
			}
			createPost(newPost.location, newPost.content, newPost.photos, newPost.postGroupId);
			setLocation('');
			setContent('');
			setPhotos('');
			setPostGroupId('');
			fetchPosts();
		}
	};

	const fetchUsers = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};

		try {
			const res = await axios.get(`${BASE_URL}/v1/user/profile/${user.userId}`, config);
			setLiveUser(res.data.result);
			setIsLoading(false); // Khi dữ liệu đã tải xong, đánh dấu isLoading là false
		} catch (error) {
			console.error(error);
			setIsLoading(false); // Đảm bảo rằng isLoading được đánh dấu là false trong trường hợp lỗi
		}
	};
	// lấy thông tin người dùng
	useEffect(() => {
		fetchUsers();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>; // Hiển thị thông báo loading hoặc hiệu ứng loading
	}

	console.log(liveUser);

	console.log(liveUser?.postGroup);

	return (
		<>
			<Toaster />
			<div className="share">
				<form className="shareWrapper" onSubmit={postSubmitHandler}>
					<div className="shareTop">
						<img
							className="shareProfileImg"
							src={liveUser?.avatar ? liveUser?.avatar : noAvatar}
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
									<select id="loc" value={location} onChange={(e) => setLocation(e.target.value)}>
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
						<button className="shareButton" type="submit" disabled={createLoading ? true : false}>
							Share
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Share;
