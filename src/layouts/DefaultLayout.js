import { Toaster } from 'react-hot-toast';
const DefaultLayout = ({ Topbar, SideBar, RightBar, children }) => {
	return (
		<>
			<Toaster />
			{Topbar && <Topbar />}
			<div className="content">
				{SideBar && <SideBar />}
				{children}
				{RightBar && <RightBar />}
			</div>
		</>
	);
};
export default DefaultLayout;
