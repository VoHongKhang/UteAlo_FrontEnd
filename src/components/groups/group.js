/**
 * Represents a component for displaying groups.
 * @constructor
 */
import React, { useState } from 'react';
import Topbar from '../timeline/topbar/Topbar';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import Feed from './Feed';
import Sidebar from './Sidebar';
const Groups = () => {
	const { user: currentUser } = useAuth();
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<Sidebar  />
				<Feed />
			</div>
		</>
	);
};
export default Groups;
