import React, { useState, useEffect } from "react";
import "./Topbar.css";
import axios from "axios";
import { Menu, NightsStay, Search, WbSunny } from "@material-ui/icons";
import { Link } from "react-router-dom";
import useAuth from "../../../context/auth/AuthContext";
import useTheme, { themes } from "../../../context/ThemeContext";
import noAvatar from "../../../assets/appImages/user.png";
import { BASE_URL } from "../../../context/apiCall";

const Topbar = ({ searchHandler, setSearchKey, searchKey, menuHandler }) => {
  const [user, setUser] = useState();
  const { user: currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  // Toggle theme switch
  const themeModeHandler = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light);
    localStorage.setItem(
      "userTheme",
      theme === themes.light ? "dark" : "light"
    );
  };

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
      <div
        className="topbarContainer"
        style={{
          color: theme.topbarColor,
          background: theme.topbarBackground,
        }}>
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="topbarLogo">Splash Social</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search for friend...example - 'aditya'"
              className="searchInput"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
        <span className="searchIcon">
          <Search style={{ cursor: "pointer" }} onClick={searchHandler} />
        </span>
        <div className="topbarRight">
          <div className="topbarLinks">
            <span className="menu-icon" onClick={menuHandler}>
              <Menu />
            </span>
            <Link to="/" className="topbarLink">
              Welcome {user?.fullName}
            </Link>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem" onClick={themeModeHandler}>
              {theme.background === "#ffffff" ? <NightsStay /> : <WbSunny />}
            </div>
          </div>
          <Link to={`/profile/${currentUser.userId}`}>
  
            <img
              src={user?.avatar ? user?.avatar : noAvatar}
              alt="..."
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Topbar;
