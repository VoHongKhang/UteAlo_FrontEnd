import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import '../profile/Profile.css';
import noCover from '../../assets/appImages/noCover.jpg';
import sampleProPic from '../../assets/appImages/user.png';
import Topbar from '../timeline/topbar/Topbar';
import useAuth from '../../context/auth/AuthContext';
import { BASE_URL } from '../../context/apiCall';
import axios from 'axios';
import useProfile from '../../context/profile/ProfileContext';
import { Box, CircularProgress } from '@material-ui/core';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import useTheme from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { errorOptions } from '../../components/utils/toastStyle';

const EditProfile = () => {
	const [user, setUser] = useState({});

	// from context
	const { user: currentUser } = useAuth();
	const { editUser, loading, updateUserAvatar, updateUserBackground } = useProfile();
	const { theme } = useTheme();

	// all states for user update fields
	const [fullName, setFullName] = useState();
	const [about, setAbout] = useState();
	const [address, setAddress] = useState();
	const [phone, setPhone] = useState();
	const [gender, setGender] = useState();
	const [dateOfBirth, setDateOfBirth] = useState();
	const [avatar, setAvatar] = useState();
	const [background, setBackground] = useState();

	// get user details
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile`, config);
			setUser(res.data.result);
		};
		fetchUsers();
	}, [currentUser.accessToken]);

	useEffect(() => {
		setFullName(user.fullName);
		setAbout(user.about);
		setAddress(user.address);
		setPhone(user.phone);
		setGender(user.gender);
		setDateOfBirth(user.dateOfBirth);
	}, [user.fullName, user.about, user.address, user.phone, user.gender, user.dateOfBirth]);



	
	useEffect(() => {
		// Chuyển đổi chuỗi ngày giờ thành đối tượng Date và kiểm tra nếu không hợp lệ
		const dateOfBirthString = user.dateOfBirth; // Mặc định nếu user.dateOfBirth là null hoặc undefined
		const dateObject = new Date(dateOfBirthString);
		if (!isNaN(dateObject.getTime())) {
		  const formattedDate = dateObject.toISOString().split('T')[0];
		  setDateOfBirth(formattedDate);
		} 
	  }, [user.dateOfBirth]);
	

	const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user.avatar ? user.avatar : sampleProPic);
	const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState(user.background ? user.background : noCover);

	useEffect(() => {
		// Kiểm tra nếu user.avatar có giá trị, thì cập nhật selectedAvatarUrl
		if (user.avatar) {
			setSelectedAvatarUrl(user.avatar);
		}
		// Kiểm tra nếu user.background có giá trị, thì cập nhật selectedAvatarUrl
		if (user.background) {
			setSelectedBackgroundUrl(user.background);
		}
	}, [user.avatar, user.background]);

	// update user profile
	const updateProfileHandler = (e) => {
		e.preventDefault();
		editUser(fullName, about, address, phone, gender, dateOfBirth);
	};

	// update user avatar
	const updateAvatarHandler = async (e) => {
		e.preventDefault();
		if (!avatar) {
			toast.error('Please Select an Image!', errorOptions);
			return; // Ngăn việc tiếp tục xử lý nếu không có tệp ảnh
		}
		// Kiểm tra kích thước tệp ảnh
		if (avatar.size > 1024 * 1024) {
			// 1MB = 1024 * 1024 bytes
			toast.error('Image must not exceed 1MB!', errorOptions);
			return; // Ngăn việc tiếp tục xử lý nếu kích thước vượt quá 1MB
		}
		if (avatar) {
			await updateUserAvatar(avatar);
		}
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		setAvatar(file);
		setSelectedAvatarUrl(URL.createObjectURL(file)); // Đặt URL hình ảnh avatar đã chọn
	};

	// update user background
	const updateBackgroundHandler = async (e) => {
		e.preventDefault();
		if (!background) {
			toast.error('Please Select an Image!', errorOptions);
			return; // Ngăn việc tiếp tục xử lý nếu không có tệp ảnh
		}
		// Kiểm tra kích thước tệp ảnh
		if (background.size > 1024 * 1024) {
			// 1MB = 1024 * 1024 bytes
			toast.error('Image must not exceed 1MB!', errorOptions);
			return; // Ngăn việc tiếp tục xử lý nếu kích thước vượt quá 1MB
		}
		if (background) {
			await updateUserBackground(background);
		}
	};

	const handleFileBackgroundInputChange = (e) => {
		const file = e.target.files[0];
		setBackground(file);
		setSelectedBackgroundUrl(URL.createObjectURL(file)); // Đặt URL hình nền đã chọn
	};



	return (
		<>
			<Helmet title="Edit profile | UTEALO" />
			<Toaster />
			<Topbar />
			<div className="profile" style={{ color: theme.foreground, background: theme.background }}>
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<form onSubmit={updateBackgroundHandler} className="formAvatar">
								<label htmlFor="background" className="profileImageLabel">
									<img className="profileCoverImg" src={selectedBackgroundUrl} alt="..." />
									<input
										type="file"
										accept=".png, .jpeg, .jpg"
										id="background" // Đặt id để liên kết với htmlFor
										onChange={handleFileBackgroundInputChange}
										style={{ display: 'none' }} // Ẩn input
									/>
								</label>
								<div className="editBackground-btnBox">
									<button type="submit" className="editProfileBackground-btn">
										Update Background
									</button>
								</div>
							</form>

							<form onSubmit={updateAvatarHandler} className="formAvatar">
								<label htmlFor="avatar" className="profileImageLabel">
									<img className="profileUserImg" src={selectedAvatarUrl} alt="..." />
									<input
										type="file"
										accept=".png, .jpeg, .jpg"
										id="avatar" // Đặt id để liên kết với htmlFor
										onChange={handleFileInputChange}
										style={{ display: 'none' }} // Ẩn input
									/>
								</label>
								<div className="editAvatar-btnBox">
									<button type="submit" className="editProfile-btn">
										Cập nhật Avatar
									</button>
								</div>
							</form>
						</div>
						{loading && (
							<Box display="flex" justifyContent="center" sx={{ my: 2 }}>
								<CircularProgress color="secondary" />
							</Box>
						)}
						<section className="editProfile-container">
							<div className="editProfile-box">
								<h3 className="editProfile-heading">Update Profile</h3>
								<form onSubmit={updateProfileHandler}>
									<div className="editProfile-container-main">
										<div className="editProfile-container-left">
											<label htmlFor="about">Full Name</label>
											<input
												className="editProfile-input"
												type="text"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												required
											/>
											<label htmlFor="about">Bio</label>
											<input
												className="editProfile-input"
												type="text"
												placeholder={user?.about ? user?.about : 'Describe yourself....'}
												value={about}
												onChange={(e) => setAbout(e.target.value)}
												required
											/>
											<label htmlFor="about">Address</label>
											<input
												className="editProfile-input"
												gender
												type="text"
												placeholder={user?.address ? user?.address : 'Which address....'}
												value={address}
												onChange={(e) => setAddress(e.target.value)}
												required
											/>
										</div>

										<div className="editProfile-container-right">
											<label htmlFor="about">Phone</label>
											<input
												className="editProfile-input"
												type="text"
												placeholder={user?.phone ? user?.phone : 'Which phone....'}
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												required
											/>
											<label htmlFor="about">Gender</label>
											<div className="editProfile-input">
												<label className="radio-label">
													<input
														type="radio"
														value="MALE"
														name="gender"
														checked={gender === 'MALE'}
														onChange={(e) => setGender(e.target.value)}
													/>
													MALE
												</label>
												<label className="radio-label">
													<input
														type="radio"
														value="FEMALE"
														name="gender"
														checked={gender === 'FEMALE'}
														onChange={(e) => setGender(e.target.value)}
													/>
													FEMALE
												</label>
												<label className="radio-label">
													<input
														type="radio"
														value="OTHER"
														name="gender"
														checked={gender === 'OTHER'}
														onChange={(e) => setGender(e.target.value)}
													/>
													OTHER
												</label>
											</div>
											<div className="editProfile-input">
												<label htmlFor="dateOfBirth">Date of Birth</label>
												<input
													id="dateOfBirth"
													className="custom-datepicker"
													type="date"
													placeholder="Date of birth...."
													value={dateOfBirth}
													onChange={(e) => setDateOfBirth(e.target.value)}
												/>
											</div>
										</div>
									</div>
									<div className="editProfile-btnBox">
										<button type="submit" className="editProfile-btn">
											Update Profile
										</button>
									</div>
								</form>
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditProfile;
