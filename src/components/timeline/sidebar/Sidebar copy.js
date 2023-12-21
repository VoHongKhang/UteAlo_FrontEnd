import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
import './Sidebar.css';
import { CiLogout } from 'react-icons/ci';
import { AiOutlineUserSwitch } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';
import { MdRunningWithErrors } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Box, CircularProgress } from '@material-ui/core';
import { MdOutlinePolicy } from 'react-icons/md';
import { GrSecure } from 'react-icons/gr';
import { RiChatPrivateLine } from 'react-icons/ri';
import { IoIosWarning } from 'react-icons/io';
import { SiRakuten } from 'react-icons/si';
import { useWebSocket } from '../../../context/WebSocketContext';
import useAuth from '../../../context/auth/AuthContext';
import { Modal } from 'antd';
import InputEmoji from 'react-input-emoji';
import { PermMedia, Cancel } from '@material-ui/icons';
import toast from 'react-hot-toast';
import usePost from '../../../context/post/PostContext';
import PrivacyOptionOne from '../../../assets/appImages/privacy-option-one.jpg';
import PrivacyOptionTwo from '../../../assets/appImages/privacy-option-two.jpg';
import PrivacyOptionThree from '../../../assets/appImages/privacy-option-three.jpg';
import PrivacyOptionFour from '../../../assets/appImages/privacy-option-four.jpg';
import PrivacyOptionFive from '../../../assets/appImages/privacy-option-five.jpg';
import { IoHelpCircleSharp } from 'react-icons/io5';
import { IoIosMail } from 'react-icons/io';
import { PiWarningOctagonFill } from 'react-icons/pi';
import { MdOutlineSecurity } from 'react-icons/md';
import { MdKey } from 'react-icons/md';
import { useEffect, useState } from 'react';
import AuthEmailApi from '../../../api/auth/authEmailApi';
import Api from '../../../api/Api';
import { BASE_URL } from '../../../context/apiCall';

const Sidebar = ({ inforUser }) => {
	const { theme } = useTheme();
	const { disconnectWebSocket } = useWebSocket();
	const { user: currentUser } = useAuth();
	const [modalVisible, setModalVisible] = useState(false);
	const [secondModalVisible, setSecondModalVisible] = useState(false);
	const [reportModel, setReportModal] = useState(false);
	const [content, setContent] = useState('');
	const [picLoading, setPicLoading] = useState(false);
	const [photos, setPhotos] = useState(null);
	const [photosUrl, setPhotosUrl] = useState();
	const { createReport, createLoading, loading } = usePost();
	const [titleModal, setTitleModal] = useState('Đóng góp ý kiến cho UteAlo');
	const [textContribute, setTextContribute] = useState(false);
	const [textBug, setTextBug] = useState(false);
	const [introduceModel, setIntroduceModel] = useState(false);
	const [privacy, setPrivacy] = useState(false);
	const [helpModal, setHelpModal] = useState(false);
	const [clauseModal, setClauseModal] = useState(false);
	const [securityModal, setSecurityModal] = useState(false);
	const [isActive, setIsActive] = useState();

	const openReport = () => {
		setModalVisible(true);
	};

	const openIntroduce = () => {
		setIntroduceModel(true);
	};

	const openPrivacy = () => {
		setPrivacy(true);
	};

	const openHelp = () => {
		setHelpModal(true);
	};

	const openClause = () => {
		setClauseModal(true);
	};

	const openSecurity = () => {
		setSecurityModal(true);
	};

	const handleCancel = () => {
		setSecurityModal(false);
		setClauseModal(false);
		setHelpModal(false);
		setPrivacy(false);
		setIntroduceModel(false);
		setModalVisible(false);
		setSecondModalVisible(false);
		setReportModal(false);
	};

	const openOptionOneSecondModal = () => {
		setTextContribute(true);
		setTextBug(false);
		setModalVisible(false);
		setSecondModalVisible(true);
	};

	const openOptionTwoSecondModal = () => {
		setTextBug(true);
		setTextContribute(false);
		setModalVisible(false);
		setSecondModalVisible(true);
	};

	const handleBack = () => {
		setSecondModalVisible(false);
		setModalVisible(true);
	};

	const handleBackSeconModal = () => {
		setReportModal(false);
		setSecondModalVisible(true);
	};

	const handleReport = () => {
		if (textContribute) {
			setTitleModal('Chung tay cải thiện UteAlo');
		} else if (textBug) {
			setTitleModal('Đã xảy ra lỗi');
		}
		setSecondModalVisible(false);
		setReportModal(true);
	};

	useEffect(() => {
		if (inforUser) {
			//Fetch thông tin người dùng
			const feacthData = async () => {
				try {
					const config = {
						headers: {
							Authorization: `Bearer ${currentUser.accessToken}`,
						},
					};
					const res = await Api.get(`${BASE_URL}/v1/user/getIsActive`, config);
					setIsActive(res.data);
					console.log('feacthData', res);
				} catch (error) {
					console.log(error);
				}
			};
			feacthData();
		}
	}, []);

	// Xử lý ảnh của bài đóng góp
	const postDetails = (e) => {
		const file = e.target.files[0];
		console.log('file', file);
		setPicLoading(true);
		if (file === undefined) {
			toast.error('Vui lòng chọn ảnh!');
			setPicLoading(false);
			return;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setPhotos(file);
			setPhotosUrl(URL.createObjectURL(file));
			setPicLoading(false);
		} else {
			toast.error('Vui lòng chọn kiểu ảnh phù hợp');
			setPicLoading(false);
		}
	};

	console.log('introduceModel', introduceModel);

	//Đăng xuất
	const logoutHandler = async () => {
		const toastId = toast.loading('Đăng xuất...');
		await disconnectWebSocket(currentUser);
		const { refreshToken } = JSON.parse(localStorage.getItem('userInfo'));

		try {
			const res = await AuthEmailApi.logout(currentUser, refreshToken);
			console.log('res', res);
			if (res.data.success === true) {
				toast.success('Đăng xuất thành công!', { id: toastId });
			}
		} catch (error) {
			console.log(error);
			toast.dismiss(toastId);
		}
		localStorage.removeItem('userInfo');
		window.location.href = '/login';
	};

	const listAccountAction = [
		{
			title: 'Chuyển tài khoản',
			icon: AiOutlineUserSwitch,
		},
		{
			title: 'Đăng xuất',
			icon: CiLogout,
			onClick: logoutHandler,
		},
	];

	const listShortCutAction = [
		{
			title: 'Cài đặt',
			icon: IoSettingsOutline,
			onClick: openPrivacy,
		},
		{
			title: 'Trợ giúp và hỗ trợ',
			icon: BiSupport,
			onClick: openHelp,
		},
		{
			title: 'Đóng góp ý kiến',
			icon: MdRunningWithErrors,
			onClick: openReport,
		},
		{
			title: 'Giới thiệu',
			icon: IoMdInformationCircleOutline,
			onClick: openIntroduce,
		},
		{
			title: 'Điều khoản',
			icon: MdOutlinePolicy,
			onClick: openClause,
		},
		{
			title: 'Quyền riêng tư',
			icon: RiChatPrivateLine,
			onClick: openPrivacy,
		},
		{
			title: 'Bảo mật',
			icon: GrSecure,
			onClick: openSecurity,
		},
	];

	const lists = [
		{
			title: 'Tài khoản',
			data: listAccountAction,
		},
		{
			title: 'Lối tắt',
			data: listShortCutAction,
		},
	];
	const { stompClient } = useWebSocket();
	// Đăng bài đóng góp
	const postSubmitHandler = async (e) => {
		e.preventDefault();
		if (content.length > 250) {
			toast.error('Nội dung bài viết không được vượt quá 250 ký tự!');
			return;
		}
		try {
			const newPost = {
				content: content || '',
				photos: photos || '',
			};

			if (!newPost.content && !newPost.photos && !newPost.files) {
				toast.error('Vui lòng nhập nội dung hoặc chọn ảnh!');
				return;
			}
			// Gọi hàm createPost để tạo bài viết mới
			let privacyLevel;
			if (textContribute) {
				privacyLevel = 'CONTRIBUTE';
			} else if (textBug) {
				privacyLevel = 'BUG';
			}
			const res = await createReport('', newPost.content, newPost.photos, '', privacyLevel, 0);

			if (res.success === true) {
				const data = {
					content: `${inforUser?.userName} đã gửi một báo cáo đến bạn!!!`,
					isAdmin: true,
					photo: inforUser?.avatar,
					link: `/report/${res.result.reportId}`,
					isRead: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				stompClient.send('/app/userNotify/' + inforUser?.userId, {}, JSON.stringify(data));

				setReportModal(false);
			}

			// Xóa nội dung và ảnh đã chọn
			setContent('');
			setPhotos(null);
		} catch (error) {
			console.error(error);
			toast.error('Có lỗi xảy ra khi gửi đóng góp.');
		}
	};

	return (
		<Space
			className="sidebar"
			direction="vertical"
			style={{ color: theme.foreground, background: theme.background }}
		>
			{lists.map((list, index) => (
				<List
					key={index}
					header={
						<Divider orientation="left" style={{ margin: 0 }}>
							<Typography.Title
								level={4}
								style={{ color: theme.foreground, background: theme.background, margin: 0 }}
							>
								{list.title}
							</Typography.Title>
						</Divider>
					}
					split={false}
					dataSource={list.data}
					renderItem={(item) => (
						<List.Item style={{ padding: '4px 0' }}>
							{item.href ? (
								<Link to={item.href} draggable style={{ width: '100%' }}>
									<Button
										type="text"
										block
										style={{
											color: theme.foreground,
											background: theme.background,
											height: 'auto',
											padding: '8px',
										}}
										onClick={item.onClick}
									>
										<Space
											align="center"
											style={{
												color: theme.foreground,
												background: theme.background,
												width: '100%',
											}}
											className="slider--bar--item"
										>
											<item.icon size={20} />

											<Typography.Text
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												strong
											>
												{item.title}
											</Typography.Text>
										</Space>
									</Button>
								</Link>
							) : (
								<Button
									type="text"
									block
									style={{
										color: theme.foreground,
										background: theme.background,
										height: 'auto',
										padding: '8px',
									}}
									onClick={item.onClick}
								>
									<Space
										align="center"
										style={{ color: theme.foreground, background: theme.background, width: '100%' }}
										className="slider--bar--item"
									>
										<item.icon size={20} />

										<Typography.Text
											style={{
												color: theme.foreground,
												background: theme.background,
											}}
											strong
										>
											{item.title}
										</Typography.Text>
									</Space>
								</Button>
							)}
						</List.Item>
					)}
				/>
			))}
			{/* Mở modal thứ 1 */}
			<Modal
				title="Đóng góp ý kiến cho UteAlo"
				open={modalVisible}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal"
			>
				<div>
					<div className="contribute-line--top"></div>
					<div className="contribute-option option-one" onClick={openOptionOneSecondModal}>
						<div className="contribute-option-icon">
							<SiRakuten />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Chung tay cải thiện UteAlo</span>
							<span className="contribute-option-text-2">
								Đóng góp ý kiến về trải nghiệm sử dụng UteAlo của bạn.
							</span>
						</div>
					</div>
					<div
						className="contribute-option option-two"
						style={{ marginTop: '0' }}
						onClick={openOptionTwoSecondModal}
					>
						<div className="contribute-option-icon">
							<IoIosWarning />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Đã xảy ra lỗi</span>
							<span className="contribute-option-text-2">Hãy cho chúng tôi biết tính năng bị lỗi.</span>
						</div>
					</div>
				</div>
			</Modal>
			{/* Mở modal thứ 2 */}
			<Modal
				title="Đóng góp ý kiến cho UteAlo"
				open={secondModalVisible}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleBack}>
						Quay lại
					</Button>,
					<Button key="report" type="primary" onClick={handleReport}>
						Tiếp tục
					</Button>,
				]}
				className="contribute-modal-second"
			>
				<div className="contribute-line--top"></div>
				<div className="contribute-content-second">
					<span className="contribute-content-span-1">
						Thêm toàn bộ nhật ký và dữ liệu chẩn đoán vào báo cáo?
					</span>
					<span className="contribute-content-span-2">
						Để giúp chúng tôi hiểu rõ và giải quyết vấn đề, báo cáo này sẽ tự động bao gồm thông tin về
						thiết bị, tài khoản của bạn và ứng dụng này, liên quan đến vấn đề mà bạn đang báo cáo. Bạn có
						thể hỗ trợ thêm để chúng tôi khắc phục sự cố này bằng cách gửi toàn bộ nhật ký và thông tin chẩn
						đoán lỗi. Đây có thể là những thông tin như nhật ký hoạt động của người dùng, nhật ký mạng, nhật
						ký sự cố và phần kết xuất bộ nhớ liên kết với ứng dụng UteAlo. Chúng tôi sẽ không dùng thông tin
						trong báo cáo này cho mục đích nào khác.
					</span>
				</div>
			</Modal>
			{/* Mở modal thứ 3 */}
			<Modal
				title={titleModal}
				open={reportModel}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleBackSeconModal}>
						Quay lại
					</Button>,
					<Button
						key="report"
						type="primary"
						onClick={postSubmitHandler}
						loading={loading}
						disabled={createLoading}
					>
						Gửi đóng góp
					</Button>,
				]}
				className="contribute-modal-second"
			>
				<div className="contribute-line--top"></div>
				<InputEmoji
					value={content}
					onChange={setContent}
					placeholder={`Vui lòng chia sẻ chi tiết nhất có thể...`}
				/>
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
				<label
					htmlFor="contributeFile"
					className="shareOption contributeFile"
					style={{ marginTop: '15px', marginLeft: '15px' }}
				>
					<PermMedia htmlColor="tomato" className="shareIcon" id="image--icon" />
					<span className="shareOptionText">Thêm hình ảnh chụp màn hình (đề xuất)</span>
					<input
						style={{ display: 'none' }}
						type="file"
						id="contributeFile"
						accept=".png, .jpeg, .jpg"
						onChange={postDetails}
					/>
				</label>
			</Modal>
			{/* Mở modal giới thiệu trang UteAlo */}
			<Modal
				title="Giới thiệu về trang UteAlo"
				open={introduceModel}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal-second"
			>
				<div className="contribute-line--top"></div>
				<div className="contribute-content-second">
					<span className="contribute-content-span-1">
						UteAlo, một nền tảng mạng xã hội đặc biệt dành cho sinh viên trường Đại học Sư phạm Kỹ thuật
						Thành phố Hồ Chí Minh, không chỉ là một cổng thông tin kết nối sinh viên mà còn là một không
						gian tuyệt vời để chia sẻ, học hỏi và tạo ra những kết nối ý nghĩa.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						UteAlo, một nền tảng mạng xã hội đặc biệt dành cho sinh viên trường Đại học Sư phạm Kỹ thuật
						Thành phố Hồ Chí Minh, không chỉ là một cổng thông tin kết nối sinh viên mà còn là một không
						gian tuyệt vời để chia sẻ, học hỏi và tạo ra những kết nối ý nghĩa. Với mục tiêu tạo ra một cộng
						đồng hỗ trợ, UteAlo cung cấp một nền tảng cho các sinh viên chia sẻ kiến thức, kinh nghiệm học
						tập và cuộc sống sinh viên. Từ việc chia sẻ thông tin về các hoạt động ngoại khóa, sự kiện, đến
						việc thảo luận về các chủ đề học thuật, UteAlo tạo điều kiện để mọi người có thể kết nối và hỗ
						trợ lẫn nhau trong hành trình học tập và phát triển cá nhân.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						Ngoài ra, UteAlo không chỉ giới hạn ở việc chia sẻ thông tin mà còn tạo điều kiện cho việc xây
						dựng mối quan hệ xã hội. Đây là nơi mà sinh viên có thể kết nối với nhau, tạo ra mạng lưới quen
						thuộc và hỗ trợ nhau trong mọi khía cạnh của cuộc sống sinh viên.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						UteAlo cũng cam kết bảo vệ thông tin cá nhân và tạo ra môi trường an toàn, nơi mọi người có thể
						tự do diễn đạt ý kiến và chia sẻ mà không lo ngại về sự xâm phạm quyền riêng tư.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						Với sứ mệnh xây dựng cộng đồng mạng xã hội mang tính cộng đồng, UteAlo không chỉ là nền tảng
						trực tuyến mà còn là ngôi nhà thứ hai cho sinh viên Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí
						Minh, nơi mọi người có thể học hỏi, chia sẻ và tạo dựng những kỷ niệm đáng nhớ.
					</span>
				</div>
			</Modal>
			{/* Mở modal cài đặt quyền riêng tư */}
			<Modal
				title="Cài đặt và quyền riêng tư"
				open={privacy}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal-second"
			>
				<div className="contribute-line--top"></div>
				<div className="contribute-content-second">
					<span className="privacy-content-span-1">Kiểm tra quyền riêng tư</span>
					<span className="privacy-content-span-2">
						Chúng tôi sẽ hướng dẫn cách cài đặt để bạn đưa ra lựa chọn phù hợp với tài khoản của mình. Bạn
						muốn bắt đầu với chủ đề nào?
					</span>
				</div>
				<div className="privacy-option">
					<div className="privacy-option-top">
						<div className="privacy-option-one">
							<img src={PrivacyOptionOne} alt="..." />
							<div className="privacy-option-text">
								<span>Ai có thể nhìn thấy nội dung bạn chia sẻ</span>
							</div>
						</div>
						<div className="privacy-option-two">
							<img src={PrivacyOptionTwo} alt="..." />
							<div className="privacy-option-text">
								<span>Cách mọi người có thể tìm thấy bạn trên UteAlo</span>
							</div>
						</div>
					</div>
					<div className="privacy-option-bottom">
						<div className="privacy-option-three">
							<img src={PrivacyOptionThree} alt="..." />
							<div className="privacy-option-text">
								<span>Cách bảo vệ tài khoản của bạn</span>
							</div>
						</div>
						<div className="privacy-option-four">
							<img src={PrivacyOptionFour} alt="..." />
							<div className="privacy-option-text">
								<span>Cài đặt dữ liệu của bạn trên UteAlo</span>
							</div>
						</div>
						<div className="privacy-option-five">
							<img src={PrivacyOptionFive} alt="..." />
							<div className="privacy-option-text">Tùy chọn quảng cáo trên UteAlo</div>
						</div>
					</div>
				</div>
			</Modal>
			{/* Mở modal trợ giúp và hỗ trợ */}
			<Modal
				title="Trợ giúp & hỗ trợ"
				open={helpModal}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal help-modal"
			>
				<div>
					<div className="contribute-line--top"></div>
					<div className="contribute-option option-one" onClick={openOptionOneSecondModal}>
						<div className="contribute-option-icon help-icon">
							<IoHelpCircleSharp />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Trung tâm trợ giúp</span>
							<span className="contribute-option-text-2">Trung tâm trợ giúp.</span>
						</div>
					</div>
					<div
						className="contribute-option option-two"
						style={{ marginTop: '0' }}
						onClick={openOptionTwoSecondModal}
					>
						<div className="contribute-option-icon help-icon">
							<IoIosMail />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Hộp thư hỗ trợ</span>
							<span className="contribute-option-text-2">Hộp thư hỗ trợ.</span>
						</div>
					</div>
					<div
						className="contribute-option option-two"
						style={{ marginTop: '0' }}
						onClick={openOptionTwoSecondModal}
					>
						<div className="contribute-option-icon help-icon">
							<PiWarningOctagonFill />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Báo cáo sự cố</span>
							<span className="contribute-option-text-2">Báo cáo sự cố.</span>
						</div>
					</div>
				</div>
			</Modal>
			{/* Mở modal điều khoản sử dụng trang UteAlo */}
			<Modal
				title="Điều khoản sử dụng UteAlo"
				open={clauseModal}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal-second"
			>
				<div className="contribute-line--top"></div>
				<div className="contribute-content-second">
					<span className="contribute-content-span-1">
						Điều khoản Sử dụng của UteAlo đối với sinh viên trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí
						Minh nhấn mạnh vào việc xây dựng một môi trường mạng xã hội an toàn, hỗ trợ và phát triển cho
						cộng đồng sinh viên.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						<p>Quyền riêng tư và An ninh thông tin:</p> UteAlo cam kết bảo vệ thông tin cá nhân của người
						dùng. Mọi thông tin cá nhân được thu thập và sử dụng đều tuân theo chính sách quyền riêng tư,
						không được chia sẻ với bên thứ ba mà không có sự đồng ý rõ ràng.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						<p>Nội quy và Bản quyền:</p> Sinh viên được khuyến khích tuân thủ các quy định và nội quy của
						UteAlo, đồng thời tôn trọng quyền sở hữu trí tuệ của người khác. Việc chia sẻ thông tin phải
						tuân thủ luật pháp và không vi phạm quyền riêng tư hoặc bản quyền của bất kỳ cá nhân hoặc tổ
						chức nào khác.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						<p>Tôn trọng và An toàn:</p> UteAlo khuyến khích mọi thành viên trong cộng đồng trường Đại học
						Sư phạm Kỹ thuật Thành phố Hồ Chí Minh tôn trọng ý kiến của người khác và không chia sẻ thông
						tin độc hại hoặc gây phiền toái. Hành vi quấy rối, kỳ thị hoặc xúc phạm người khác không được
						chấp nhận.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						<p>Bảo mật thông tin cá nhân: </p>Mọi người dùng đều có trách nhiệm bảo mật thông tin cá nhân
						của mình. Việc bảo vệ mật khẩu và không chia sẻ thông tin đăng nhập là quan trọng để đảm bảo an
						toàn cho tài khoản cá nhân.
					</span>
					<span className="contribute-content-span-2" style={{ display: 'block', marginTop: '20px' }}>
						<p>Trách nhiệm và Thực hiện:</p> UteAlo khuyến khích mọi người dùng thực hiện trách nhiệm của
						mình khi sử dụng nền tảng này. Bằng cách tôn trọng điều khoản sử dụng, người dùng đóng góp vào
						việc duy trì một môi trường mạng xã hội tích cực và an toàn.
					</span>
				</div>
			</Modal>
			{/* Mở modal trợ giúp và hỗ trợ */}
			<Modal
				title="Bảo mật"
				open={securityModal}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal help-modal"
			>
				<div>
					<div className="contribute-line--top"></div>
					<div className="contribute-option option-one" onClick={openOptionOneSecondModal}>
						<div className="contribute-option-icon help-icon">
							<MdKey />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Khóa tài khoản</span>
							<span className="contribute-option-text-2">Khóa tài khoản.</span>
						</div>
					</div>
					<div
						className="contribute-option option-two"
						style={{ marginTop: '0' }}
						onClick={openOptionTwoSecondModal}
					>
						<div className="contribute-option-icon help-icon">
							<MdOutlineSecurity />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Cài đặt bảo mật 2 lớp</span>
							<span className="contribute-option-text-2">Cài đặt bảo mật 2 lớp.</span>
						</div>
					</div>
				</div>
			</Modal>
		</Space>
	);
};
export default Sidebar;
