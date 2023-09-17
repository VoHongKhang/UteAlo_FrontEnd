import React, { useState, useEffect } from "react";
import "./Profile.css";
import noCover from "../../assets/appImages/noCover.jpg";
import sampleProPic from "../../assets/appImages/user.png";
import { Link,useParams  } from "react-router-dom";
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
  let listMessage = ['Retrieving user profile successfully and access update denied','Retrieving user profile successfully and access update']
  const [message , setMessage] = useState("");

  const params = useParams();


  const { user: currentUser } = useAuth();

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
        `${BASE_URL}/v1/user/profile/${params.userId}`,
        config
      );
      setUser(res.data.result);
      setMessage(res.data.message);
    };
    fetchUsers();
  }, [params.userId,currentUser.accessToken]);

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
                src={user.background || noCover}
                alt="..."
              />

              <img
                className="profileUserImg"
                src={user.avatar || sampleProPic}
                alt="..."
              />
              { message === listMessage[1] && (
                <Link to={`/update/${currentUser.userId}`}>
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