import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import '../profile/Profile.css';
import noCover from '../../assets/appImages/noCover.jpg';
import sampleProPic from '../../assets/appImages/user.png';
import Topbar from '../timeline/topbar/Topbar';
import Sidebar from '../timeline/sidebar/Sidebar';
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
	const [fullName, setFullName] = useState(user.fullName);
	const [about, setAbout] = useState(user.about);
	const [address, setAddress] = useState(user.address);
	const [phone, setPhone] = useState(user.phone);
	const [gender, setGender] = useState(user.gender);
	const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
	const [avatar, setAvatar] = useState(user.avatar);
	const [background, setBackground] = useState(user.background);
  

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
			console.log(res);
		};
		fetchUsers();
	}, [currentUser.accessToken]);

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
	};

	return (
		<>
			<Helmet title="Edit profile | UTEALO" />
			<Toaster />
			<Topbar />
			<div className="profile" style={{ color: theme.foreground, background: theme.background }}>
				<Sidebar />
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">

							<form onSubmit={updateBackgroundHandler} className="formAvatar">
								<label htmlFor="background" className="profileImageLabel">
									<img className="profileCoverImg" src={user.background || noCover} alt="..." />
									<input
										type="file"
										accept=".png, .jpeg, .jpg"
										id="background" // Đặt id để liên kết với htmlFor
										onChange={handleFileBackgroundInputChange}
										style={{ display: 'none' }} // Ẩn input
									/>
								</label>
								<div className="editBackground-btnBox">
									<button type="submit" className="editProfile-btn">
										Update Background
									</button>
								</div>
							</form>

							<form onSubmit={updateAvatarHandler} className="formAvatar">
								<label htmlFor="avatar" className="profileImageLabel">
									<img className="profileUserImg" src={user.avatar || sampleProPic} alt="..." />
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
										Update Avatar
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
												placeholder={user?.fullName ? user?.fullName : 'Your full name....'}
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
												className="editProfile-input"gender
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
													required
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
