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
import useAuth from '../../../context/auth/AuthContext';
import usePost from '../../../context/post/PostContext';

const Share = ({ fetchPosts }) => {
	const [location, setLocation] = useState('');
	const [content, setContent] = useState('');
	const [photos, setPhotos] = useState(null);
	const [photosUrl, setPhotosUrl] = useState();
	const [postGroupId, setPostGroupId] = useState('');
	const [picLoading, setPicLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [liveUser, setLiveUser] = useState(null);
	const { user } = useAuth();
	const { createPost, createLoading } = usePost();

	// Xử lý ảnh của bài post
	const postDetails = (e) => {
		const file = e.target.files[0];
		setPicLoading(true);
		if (file === undefined) {
			toast.error('Please Select an Image!');
			setPicLoading(false);
			return;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setPhotos(file);
			setPhotosUrl(URL.createObjectURL(file));
			setPicLoading(false);
		} else {
			toast.error('Please select an image with png/jpg type');
			setPicLoading(false);
		}
	};

	// Đăng bài post
	const postSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			const newPost = {
				location: location || '',
				content: content || '',
				photos: photos || '',
				postGroupId: postGroupId || 0,
			};

			if (!newPost.content && !newPost.photos) {
				toast.error('Vui lòng nhập nội dung hoặc chọn ảnh!');
				return;
			}
			// Gọi hàm createPost để tạo bài viết mới
			await createPost(newPost.location, newPost.content, newPost.photos, newPost.postGroupId);

			// Sau khi createPost hoàn thành, gọi fetchPosts để cập nhật danh sách bài viết
			fetchPosts();
			// Xóa nội dung và ảnh đã chọn
			setLocation('');
			setContent('');
			setPhotos(null);
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

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<Toaster />
			<div className="share">
				<form className="shareWrapper" onSubmit={postSubmitHandler}>
					<div className="shareTop">
						<img className="shareProfileImg" src={liveUser?.avatar || noAvatar} alt="..." />
						<InputEmoji
							value={content}
							onChange={setContent}
							placeholder={`Bạn đang nghĩ gì ${liveUser?.fullName} ?`}
						/>
					</div>
					<hr className="shareHr" />
					{picLoading && (
						<Box display="flex" justifyContent="center" sx={{ my: 2 }}>
							<CircularProgress color="secondary" />
						</Box>
					)}
					{photos && (
						<div className="shareImgContainer">
							<img className="shareimg" src={photosUrl} alt="..." />
							<Cancel className="shareCancelImg" onClick={() => setPhotos(null)} />
						</div>
					)}

					<div className="shareBottom">
						<div className="shareOptions">
							<label htmlFor="file" className="shareOption">
								<PermMedia htmlColor="tomato" className="shareIcon" />
								<span className="shareOptionText">Hình ảnh</span>
								<input
									style={{ display: 'none' }}
									type="file"
									id="file"
									accept=".png, .jpeg, .jpg"
									onChange={postDetails}
								/>
							</label>
							<div className="shareOption">
								<label htmlFor="loc" className="shareOption">
									<Room htmlColor="green" className="shareIcon" />
									<select id="loc" value={location} onChange={(e) => setLocation(e.target.value)}>
										<option>Vị trí</option>
										{Country.getAllCountries().map((item) => (
											<option key={item.isoCode} value={item.name} id="loc">
												{item.name}
											</option>
										))}
									</select>
								</label>
							</div>
							<div className="shareOption">
								<label htmlFor="postGroupId" className="shareOption-one">
									<select
										id="postGroupId"
										value={postGroupId}
										onChange={(e) => setPostGroupId(parseInt(e.target.value))}
									>
										<option value={-1}>Chỉ mình tôi</option>
										<option value={0}>Công khai</option>
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
						<button className="shareButton" type="submit" disabled={createLoading}>
							Đăng bài
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Share;
