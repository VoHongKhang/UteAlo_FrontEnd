import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import adverSymbol from "../../../assets/appImages/adverSym.jpg";
import adImg from "../../../assets/appImages/adver.jpg";
import adImg2 from "../../../assets/appImages/adver4.jpg";
import useTheme from "../../../context/ThemeContext";
const QuickContact = ({ user }) => {
	// const { data: friends, isLoading: friendsLoading } = useSWR<IPaginationResponse<UserType>>(
	// 	`users/searchUser/friends`,
	// 	swrFetcher
	// );
	// const { data: suggests, isLoading: suggestsLoading } = useSWR<IPaginationResponse<UserType>>(
	// 	`users/searchUser/suggests`,
	// 	swrFetcher
	// );
    const { theme } = useTheme();
	const friends = {
		items: [],
		totalItems: 'number',
		currentPage: 'number',
		totalPages: 'number',
		offset: 'number',
	};

	const friendsLoading = () => {
		return true;
	};
	const suggests = {
		items: [],
		totalItems: 'number',
		currentPage: 'number',
		totalPages: 'number',
		offset: 'number',
	};

	const suggestsLoading = () => {
		return true;
	};

	const lists = [
		{
			title: 'Liên hệ',
			data: friends?.items,
			loading: friendsLoading,
		},
		{
			title: 'Đề xuất',
			data: suggests?.items,
			loading: suggestsLoading,
		},
	];
    const ProfileRightbar = () => {
        return (
            <>
            {lists.map((list, index) => (
				<List
					key={index}
					header={
						<Divider orientation="left" style={{ margin: 0 }}>
							<Typography.Title level={4} style={{ margin: 0 }}>
								{list.title}
							</Typography.Title>
						</Divider>
					}
					split={false}
					loading={list.loading}
					dataSource={list.data}
					renderItem={(item) => (
						<List.Item style={{ padding: '4px 0' }}>
							<Link to={`/profile?id=${item._id}`} draggable style={{ width: '100%' }}>
								<Button type="text" block style={{ height: 'auto', padding: '8px' }}>
									<Space align="center" style={{ width: '100%' }}>
										{/* <UserAvatar user={item} avtSize={36} /> */}

										<Typography.Text strong>{item.fullname}</Typography.Text>
									</Space>
								</Button>
							</Link>
						</List.Item>
					)}
				/>
			))}
            </>
        );
    };

    const HomeRightbar = () => {
        return (
          <>
            <div className="birthdayContainer">
              <img className="birthdayImg" src={adverSymbol} alt="..." />
              <span className="birthdayText">
                <strong>Ads...</strong>
              </span>
            </div>
            <a href="https://splashstore.netlify.app">
              <img className="rightbarAd" src={adImg} alt="..." />
            </a>
            <a href="https://dev.to/adidoshi">
              <img className="rightbarAd2" src={adImg2} alt="..." />
            </a>
          </>
        );
      };
	return (
		<Space direction="vertical" className="rightbar"
        style={{ color: theme.foreground, background: theme.background }}
        >
            {user ? <ProfileRightbar /> : <HomeRightbar />}
			
		</Space>
	);
};
export default QuickContact;
