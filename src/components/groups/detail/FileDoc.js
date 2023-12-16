import { Button, Table } from 'antd';
import useTheme from '../../../context/ThemeContext';
import { useEffect, useState } from 'react';
import { postDetail } from '../../../api/postGroups/postDetail';
import moment from 'moment';
import { HiEye } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

export default function FileDoc({ groupId, listPost }) {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const columns = [
		{
			title: 'Người Tạo',
			dataIndex: 'userName',
			key: 'userName',
			width: '30%',
			render: (text, record) => (
				<span
					style={{ cursor: 'pointer', color: '#1677ff' }}
					onClick={() => navigate(`/profile/${record.userId}`)}
				>
					{text}
				</span>
			),
		},
		{
			title: 'Tên File',
			dataIndex: 'files',
			key: 'files',
			render: (text) => (
				<a href={text} target="_blank" rel="noopener noreferrer">
					{text.length > 20 ? text.split('/').pop().substring(0, 20) + '...' : text}
				</a>
			),
			width: '30%',
		},
		{
			title: 'Thời Gian Cập Nhật',
			dataIndex: 'updateAt',
			key: 'updateAt',
			sorter: (a, b) => new Date(b.updateAt) - new Date(a.updateAt),
			width: '20%',
		},
		{
			title: 'Loại File',
			dataIndex: 'type',
			filters: [
				{
					text: 'PDF',
					value: 'pdf',
				},
				{
					text: 'Word',
					value: 'docx',
				},
				{
					text: 'TXT',
					value: 'txt',
				},
				{
					text: 'PowerPoint',
					value: 'ppt',
				},
				{
					text: 'Excel',
					value: 'xlsx',
				},
			],
			onFilter: (value, record) => record.type.startsWith(value),
			filterSearch: true,
			width: '10%',
		},
		{
			title: 'Xem bài viết ',
			dataIndex: 'postId',
			render: (text) => (
				<Button type="primary" onClick={() => navigate(`/post/${text}`)}>
					<HiEye />
				</Button>
			),
			width: '10%',
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			const result = await postDetail.getFileDocumentById(groupId);
			const res = result.data.map((item) => {
				const type = item.files.split('.').pop();
				const updateAt = moment(item.updateAt).format('DD/MM/YYYY');
				return { ...item, type, updateAt };
			});
			setData(res);
		};
		fetchData();
	}, [groupId, listPost]);

	const onChange = (pagination, filters, sorter, extra) => {
		console.log('params', pagination, filters, sorter, extra);
	};
	const { theme } = useTheme();
	return (
		<div className="feed--note">
			<Table
				style={{ color: theme.foreground, background: theme.background }}
				className="feed--note-feedWrapper"
				columns={columns}
				dataSource={data}
				onChange={onChange}
			/>
		</div>
	);
}
