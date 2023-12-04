import React, { useEffect, useState } from 'react';
import './Share.css';
import { AttachFile, PermMedia, Room, Cancel, Public } from '@material-ui/icons';
import { Box, CircularProgress } from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import InputEmoji from 'react-input-emoji';
import vietnamProvinces from '../../../vietnamProvinces.json';
import noAvatar from '../../../assets/appImages/user.png';
import usePost from '../../../context/post/PostContext';
import { errorOptions } from '../../utils/toastStyle';

const Share = ({ inforUser, newPosts }) => {
	console.log('inforUserShare', inforUser);
	const [location, setLocation] = useState('');
	const [content, setContent] = useState('');
	const [photos, setPhotos] = useState(null);
	const [files, setFiles] = useState(null);
	const [photosUrl, setPhotosUrl] = useState();
	const [filesUrl, setFilesUrl] = useState();
	const [privacyLevel, setPrivacyLevel] = useState('PUBLIC');
	const [picLoading, setPicLoading] = useState(false);
	const { createPost, createLoading } = usePost();

	// Xử lý ảnh của bài post
	const postDetails = (e) => {
		const file = e.target.files[0];
		console.log('file', file);
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

	// Xử lý file của bài post
	const postFileDetails = (e) => {
		const file = e.target.files[0];
		if (file === undefined) {
			toast.error('Vui lòng chọn một tệp!');
			return;
		}

		// Bỏ đi kiểm tra định dạng tệp
		setFiles(file);
		setFilesUrl(URL.createObjectURL(file));
	};

	// Đăng bài post
	const postSubmitHandler = async (e) => {
		e.preventDefault();
		if (content.length > 250) {
			toast.error('Nội dung chỉ được tối đa 250 kí tự!', errorOptions);
			return;
		}
		try {
			const newPost = {
				location: location || '',
				content: content || '',
				photos: photos || '',
				files: files || '',
				privacyLevel: privacyLevel || 'PUBLIC',
				postGroupId: 0,
			};

			if (!newPost.content && !newPost.photos && !newPost.files) {
				toast.error('Vui lòng nhập nội dung hoặc chọn ảnh!');
				return;
			}
			// Gọi hàm createPost để tạo bài viết mới
			await createPost(
				newPost.location,
				newPost.content,
				newPost.photos,
				newPost.files,
				newPost.privacyLevel,
				newPost.postGroupId
			);

			// Sau khi createPost hoàn thành, gọi fetchPosts để cập nhật danh sách bài viết
			newPosts(newPost);
			// Xóa nội dung và ảnh đã chọn
			setLocation('');
			setContent('');
			setPhotos(null);
			setFiles(null);
		} catch (error) {
			console.error(error);
			toast.error('Có lỗi xảy ra khi tạo bài viết.');
		}
	};

	return (
		<>
			<Toaster />
			<div className="share">
				<form className="shareWrapper" onSubmit={postSubmitHandler}>
					<div className="shareTop">
						<img className="shareProfileImg" src={inforUser?.avatar || noAvatar} alt="..." />
						<InputEmoji
							value={content}
							onChange={setContent}
							placeholder={`Bạn đang nghĩ gì ${inforUser?.userName} ?`}
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
					{files && (
						<div className="postFile">
							<a href={filesUrl} target="_blank" rel="noopener noreferrer">
								{filesUrl.substr(filesUrl.lastIndexOf('/') + 1)}
							</a>
							<Cancel className="shareCancelFile" onClick={() => setFiles(null)} />
						</div>
					)}

					<div className="shareBottom">
						<div className="shareOptions">
							<label htmlFor="file" className="shareOption">
								<PermMedia htmlColor="tomato" className="shareIcon" id="image--icon" />
								<span className="shareOptionText">Hình ảnh</span>
								<input
									style={{ display: 'none' }}
									type="file"
									id="file"
									accept=".png, .jpeg, .jpg"
									onChange={postDetails}
								/>
							</label>
							<label htmlFor="files" className="shareOption">
								<AttachFile htmlColor="brown" className="shareIcon" />
								<span className="shareOptionText">Tệp</span>
								<input
									style={{ display: 'none' }}
									type="file"
									id="files"
									accept=".docx, .txt, .pdf"
									onChange={postFileDetails}
								/>
							</label>

							<div className="shareOption">
								<label htmlFor="loc" className="shareOption">
									<Room htmlColor="green" className="shareIcon" />
									<select id="loc" value={location} onChange={(e) => setLocation(e.target.value)}>
										<option>Vị trí</option>
										{vietnamProvinces.map((province) => (
											<option key={province.id} value={province.name}>
												{province.name}
											</option>
										))}
									</select>
								</label>
							</div>

							<div className="shareOption" id="sharePublic">
								<label htmlFor="privacyLevel" className="shareOption-one" style={{ display: 'flex' }}>
									<Public htmlColor="black" className="shareIcon" />
									<select
										id="privacyLevel"
										value={privacyLevel}
										onChange={(e) => setPrivacyLevel(e.target.value)}
									>
										<option value="PUBLIC">Công khai</option>
										<option value="PRIVATE">Chỉ mình tôi</option>
										<option value="FRIENDS">Bạn bè</option>
									</select>
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