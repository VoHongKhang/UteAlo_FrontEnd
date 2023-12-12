import { Button, Image, List, Modal, Space, Spin, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
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
function MessageItem({ isOwner, message, stompClient, currentUser, onRetry }) {
	const { theme } = useTheme();
	const classes = ['message'];
	const classParent = [isOwner ? 'sent--item' : 'received--item'];
	classes.push(isOwner ? 'sent' : 'received');
	const [iconMessage, setIconMessage] = useState(null);
	const [media, setMedia] = useState(null);
	const [isRemove, setIsRemove] = useState(false);
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
	const handleReactIcon = (icon) => {
		handleClose();
		const data = {
			react: icon,
			messageId: message?.messageId,
			content: message?.content,
			groupId: message?.groupId,
			createdAt: message?.createdAt,
			senderId: message?.senderId,
			reactUserName: currentUser?.userName,
			receiverId: message?.receiverId,
			reactUser: currentUser?.userId,
			isReact: true,
		};
		if (message.groupId === null || message.groupId === 'null' || message.groupId === undefined) {
			if (message.react !== undefined && message.react !== null) {
				const index = message.react.findIndex((item) => item.reactUser === currentUser?.userId);
				if (index !== -1) {
					if (message.react[index].react === icon) {
						message.react.splice(index, 1);
					} else {
						message.react[index].react = icon;
					}
				} else {
					message.react.push(data);
				}
			} else {
				message.react = [data];
			}
		}
		stompClient.send('/app/react-message', {}, JSON.stringify(data));
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

	//openModal react
	const [open, setOpen] = useState(false);
	return (
		<Space className={classnames(classParent)} align={isOwner ? 'end' : 'start'}>
			{!isOwner && (
				<img
					src={message?.senderAvatar || message?.avatar || sampleProPic}
					alt="avatar"
					className="sender-avatar"
				/>
			)}
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
					{message?.isDeleted ? (
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
								{message.react !== undefined && message.react !== null && (
									<div className="react--icon" onClick={() => setOpen(true)}>
										{message.react.slice(0, 5).map((item) => (
											<span>
												<img
													className="icon--react--message"
													src={
														item.react === 'Heart'
															? HeartIcon
															: item.react === 'Like'
															? LikeIcon
															: item.react === 'Wow'
															? WowIcon
															: item.react === 'Sad'
															? SadIcon
															: item.react === 'Angry'
															? AngryIcon
															: item.react === 'Haha'
															? HahaIcon
															: ''
													}
													alt="Heart Icon"
												/>
											</span>
										))}
									</div>
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
								onClick={() => handleReactIcon('Heart')}
							/>
							<img
								src={HahaIcon}
								alt="Haha Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Haha')}
							/>
							<img
								src={LikeIcon}
								alt="Like Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Like')}
							/>
							<img
								src={SadIcon}
								alt="Sad Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Sad')}
							/>
							<img
								src={WowIcon}
								alt="Wow Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Wow')}
							/>
							<img
								src={AngryIcon}
								alt="Angry Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Angry')}
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
			{open && (
				<Modal
					title="Danh sách người đã tương tác "
					open={open}
					onCancel={() => setOpen(false)}
					footer={null}
					width={300}
				>
					{message.react !== undefined && message.react !== null ? (
						message.react.map((item) => (
							<div className="react--item">
								<img
									className="icon--react--message"
									src={
										item.react === 'Heart'
											? HeartIcon
											: item.react === 'Like'
											? LikeIcon
											: item.react === 'Wow'
											? WowIcon
											: item.react === 'Sad'
											? SadIcon
											: item.react === 'Angry'
											? AngryIcon
											: item.react === 'Haha'
											? HahaIcon
											: ''
									}
									alt="Heart Icon"
								/>
								<Typography.Text className="react--name"> {item.reactUserName}</Typography.Text>
							</div>
						))
					) : (
						<Typography.Text>Chưa có tương tác nào</Typography.Text>
					)}
				</Modal>
			)}
		</Space>
	);
}
export default MessageItem;
