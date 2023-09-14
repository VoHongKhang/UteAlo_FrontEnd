import React, { useState, useEffect } from "react";
import "./Profile.css";
import noCover from "../../assets/appImages/noCover.jpg";
import sampleProPic from "../../assets/appImages/user.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../context/apiCall";
import Feed from "../timeline/feed/Feed";
import Rightbar from "../timeline/rightbar/Rightbar";
import Sidebar from "../timeline/sidebar/Sidebar";
import Topbar from "../timeline/topbar/Topbar";
import Moment from "react-moment";
import { Avatar } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import useAuth from "../../context/auth/AuthContext";
import useTheme from "../../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState({});


  const { user: currentUser } = useAuth();
  console.log(user.id);
  const { theme } = useTheme();

  // get user details
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };
      const res = await axios.get(
        `${BASE_URL}/v1/user/profile`,
        config
      );
      setUser(res.data.result);
    };
    fetchUsers();
  }, [currentUser.accessToken]);

  return (
    <>
      <Helmet
        title={`${user?.fullName ? user?.fullName : "User"} Profile | Splash Social`}
      />
      <Toaster />
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div
              className="profileCover"
              style={{ color: theme.foreground, background: theme.background }}>
              <img
                className="profileCoverImg"
                src={user.coverPicture || noCover}
                alt="..."
              />

              <img
                className="profileUserImg"
                src={user.profilePicture || sampleProPic}
                alt="..."
              />
              { currentUser.accessToken !== undefined && (
                <Link to={`/editProfile/${currentUser._id}`}>
                  <div className="profile-edit-icon">
                    <Avatar
                      style={{ cursor: "pointer", backgroundColor: "blue" }}>
                      <Edit />
                    </Avatar>
                  </div>
                </Link>
              )}
            </div>
            <div
              className="profileInfo"
              style={{ color: theme.foreground, background: theme.background }}>
              <h4 className="profileInfoName">{user.fullName}</h4>
              <p className="profileInfoDesc">About me: {user.about || "----"}</p>
              <small className="profileInfoDesc">
                Joined on:{" "}
                {(
                  <em>
                    <Moment format="YYYY/MM/DD">{user?.createdAt}</Moment>
                  </em>
                ) || "----"}
              </small>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={currentUser.accessToken} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};


export default Profile;