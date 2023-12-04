import { Table } from 'antd';
import useTheme from '../../../context/ThemeContext';

export default function FileDoc(params) {
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
		},
		{
			title: 'Lần sửa đổi gần nhất',
			dataIndex: 'updateAt',
			sorter: (a, b) => new Date(b.updateAt) - new Date(a.updateAt),
		},
		{
			title: 'Loại',
			dataIndex: 'category',
			filters: [
				{
					text: 'PDF',
					value: 'PDF',
				},
				{
					text: 'Word',
					value: 'docx',
				},
			],
			onFilter: (value, record) => record.category.startsWith(value),
			filterSearch: true,
			width: '40%',
		},
	];

	const data = [
		{
			key: '1',
			name: 'Thức ăn cho chó',
			updateAt: '2021/09/19',
			category: 'PDF',
		},
		{
			key: '2',
			name: 'Thức ăn cho mèo',
			updateAt: '2021/09/17',
			category: 'docx',
		},
		{
			key: '3',
			name: 'Thức ăn cho chim',
			updateAt: '2021/09/14',
			category: 'PDF',
		},
		{
			key: '4',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/18',
			category: 'docx',
		},
		{
			key: '5',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/17',
			category: 'docx',
		},
		{
			key: '6',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/16',
			category: 'docx',
		},
		{
			key: '7',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/14',
			category: 'docx',
		},
		{
			key: '8',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/15',
			category: 'docx',
		},
		{
			key: '9',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/11',
			category: 'docx',
		},
		{
			key: '10',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/13',
			category: 'docx',
		},
		{
			key: '11',
			name: 'Thức ăn cho cá',
			updateAt: '2021/09/12',
			category: 'docx',
		},
	];

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
