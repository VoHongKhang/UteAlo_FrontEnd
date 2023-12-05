import { Button, Image, List, Space, Spin, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import { HiDownload } from 'react-icons/hi';
import { HiArrowPath, HiEye } from 'react-icons/hi2';
import HeartIcon from '../../assets/icons/heart.png';
import HahaIcon from '../../assets/icons/haha.png';
import LikeIcon from '../../assets/icons/like.png';
import SadIcon from '../../assets/icons/sad.png';
import WowIcon from '../../assets/icons/wow.png';
import AngryIcon from '../../assets/icons/angry.png';
import { Link } from 'react-router-dom';
import { InsertEmoticon, MoreHoriz, Reply } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover } from '@material-ui/core';
import { fileUtil } from './utils/fileUtil';
import sampleProPic from '../../assets/appImages/user.png';
import useTheme from '../../context/ThemeContext';
function MessageItem({ isOwner, message, stompClient, nextCombine, onRetry }) {
	const { theme } = useTheme();
	const classes = ['message'];
	const classParent = [isOwner ? 'sent--item' : 'received--item'];
	classes.push(isOwner ? 'sent' : 'received');
	const [iconMessage, setIconMessage] = useState(null);
	const [media, setMedia] = useState(null);
	const [isRemove, setIsRemove] = useState(false);
	const [reactIcon, setReactIcon] = useState({
		userId: message?.senderId,
		react: message?.react,
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setAnchorEl(null);
		setIsRemove(false);
	};
	const handleOpenModal = (open, confirmation) => {
		setOpenConfirmation(open);
		setIsRemove(confirmation);
	};
	useEffect(() => {
		console.log(isRemove);
	}, [isRemove]);
	const handleClose = () => {
		setIconMessage(null);
		setAnchorEl(null);
		setIsRemove(false);
	};
	const handleReactIcon = (react) => {
		handleClose();
		if (reactIcon.react === react) {
			setReactIcon({ userId: message?.senderId, react: null });
		} else setReactIcon({ userId: message?.senderId, react: react });
		if (message.receiverId) {
			const data = {
				react: react,
				content: message.content,
				groupId: message.groupId,
				//xử lý thêm file
				createAt: message.createAt,
				senderId: message.senderId,
				receiverId: message.receiverId,
			};
			// gửi lên server
			stompClient.send('/app/react-message', {}, JSON.stringify(data));
		}
	};
	const handleClick = (event, item) => {
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--more--message') {
			setIconMessage('More');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--reply--message') {
			setIconMessage('Reply');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--emoticon--message') {
			setIconMessage('Emoticon');
		}

		setAnchorEl(event.currentTarget);
	};
	const handleConfirmAction = async () => {
		setOpenConfirmation(false);
		if (isRemove) {
			const data = {
				content: message?.content,
				senderId: message.senderId,
				receiverId: message?.receiverId,
				senderAvatar: message?.avatar,
				senderName: message?.userName,
				groupId: message?.groupId,
				createdAt: message?.createdAt,
				updatedAt: message?.updatedAt,
				isDeleted: true,
			};
			// gửi lên server

			if (message?.groupId && message?.groupId !== 'null') {
				stompClient.send('/app/sendMessage/' + data?.groupId, {}, JSON.stringify(data));
			} else {
				stompClient.send('/app/private-message', {}, JSON.stringify(data));
			}

			message.isDeleted = true;
		}
		handleClose();
	};

	useEffect(() => {
		if (message.files?.path) {
			setMedia(URL.createObjectURL(message.files));
		}
	}, [message]);
	return (
		<Space className={classnames(classParent)} align={isOwner ? 'end' : 'start'}>
			{!isOwner && <img src={message?.senderAvatar || sampleProPic} alt="avatar" className="sender-avatar" />}
			<div className={isOwner ? 'senderMessage' : 'receivedMessage'}>
				{!isOwner && (
					<Typography.Text
						style={{ color: theme.foreground, background: theme.background }}
						className="sender-name"
					>
						{message?.senderName}
					</Typography.Text>
				)}
				<Space
					direction="vertical"
					style={{ color: theme.foreground, background: theme.background }}
					className={classnames(classes)}
				>
					{message.isDeleted ? (
						<Typography.Text className="text removeMessage">Tin nhắn đã bị thu hồi</Typography.Text>
					) : (
						<>
							<div className="icon--message">
								{isOwner && (
									<MoreHoriz
										className="icon--more--message"
										onClick={(e) => handleClick(e, message)}
									/>
								)}
								<Reply className="icon--reply--message" onClick={(e) => handleClick(e, message)} />

								<InsertEmoticon
									className="icon--emoticon--message"
									onClick={(e) => handleClick(e, message)}
								/>
							</div>
							{message.files && (
								<List.Item
									className="file_item"
									extra={
										<Link href={media} target="_blank">
											<Button shape="circle" key="download" icon={<HiEye />} size="small" />
										</Link>
									}
								>
									{!!fileUtil.isImage(message.files?.name) && (
										<Image
											className="file_icon"
											preview={{
												maskClassName: 'file_icon',
												mask: <HiEye />,
											}}
											src={media}
											alt={message.files?.name}
										/>
									)}
									<Typography.Text strong className="file_name">
										{message.files?.name}
									</Typography.Text>
								</List.Item>
							)}
							<Typography.Text
								className="text"
								style={{ color: theme.foreground }}
								title={message.createAt}
							>
								{message.content}
								{reactIcon?.react && (
									<span className="react--icon">
										<img
											src={
												reactIcon.react === 'HeartIcon'
													? HeartIcon
													: reactIcon.react === 'LikeIcon'
													? LikeIcon
													: reactIcon.react === 'WowIcon'
													? WowIcon
													: reactIcon.react === 'SadIcon'
													? SadIcon
													: reactIcon.react === 'AngryIcon'
													? AngryIcon
													: reactIcon.react === 'HahaIcon'
													? HahaIcon
													: ''
											}
											alt="Heart Icon"
											className="icon--react--message"
										/>
									</span>
								)}
							</Typography.Text>
						</>
					)}
				</Space>
			</div>
			{message.sending && <Spin size="small" style={{ alignSelf: 'center' }} />}

			{message.error && (
				<Tooltip title="Thử lại">
					<Button size="small" type="text" shape="circle" icon={<HiArrowPath />} onClick={onRetry} danger />
				</Tooltip>
			)}

			{message.error && <Typography.Text type="danger">{message.error}</Typography.Text>}
			<Popover
				id="simple-popover"
				open={Boolean(anchorEl)}
				className="popper--member"
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<div>
					{iconMessage === 'More' && (
						<Typography className="poper--member--item" onClick={() => handleOpenModal(true, true)}>
							Thu hồi tin nhắn
						</Typography>
					)}
					{iconMessage === 'Reply' && (
						<Typography className="poper--member--item" onClick={() => handleOpenModal(true, false)}>
							Trả lời tin nhắn
						</Typography>
					)}
					{iconMessage === 'Emoticon' && (
						<div className="emotion--container">
							<img
								src={HeartIcon}
								alt="Heart Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('HeartIcon')}
							/>
							<img
								src={HahaIcon}
								alt="Haha Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('HahaIcon')}
							/>
							<img
								src={LikeIcon}
								alt="Like Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('LikeIcon')}
							/>
							<img
								src={SadIcon}
								alt="Sad Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('SadIcon')}
							/>
							<img
								src={WowIcon}
								alt="Wow Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('WowIcon')}
							/>
							<img
								src={AngryIcon}
								alt="Angry Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('AngryIcon')}
							/>
						</div>
					)}
				</div>
			</Popover>

			<Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
				<DialogTitle>Xác nhận thay đổi</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{isRemove
							? 'Bạn có chắc chắn muốn xóa tin nhắn này ?'
							: 'Chức năng này hiện đang trong quá trình phát triển'}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirmation} color="primary" variant="outlined">
						Hủy
					</Button>
					<Button onClick={handleConfirmAction} color="primary" variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</Space>
	);
}
export default MessageItem;
