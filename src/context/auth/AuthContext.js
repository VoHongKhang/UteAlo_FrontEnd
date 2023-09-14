import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import {
  errorOptions,
  successOptions,
} from "../../components/utils/toastStyle";
import { BASE_URL } from "../apiCall";
import authReducer, { initialState } from "./authReducer";

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loginReq = async (credentialId, password) => {
    try {
      dispatch({
        type: "LOGIN_REQUEST",
      });
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const response = await axios.post(
        `${BASE_URL}/v1/auth/login`,
        { credentialId, password },
        config
      );
  
      if (response.status === 200) {
        const { accessToken, refreshToken,userId} = response.data.result;
        console.log(accessToken, refreshToken,userId);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            accessToken,
            refreshToken,
            userId
          },
        });
        localStorage.setItem("userInfo", JSON.stringify({
          accessToken,
          refreshToken,
          userId
        }));
        toast.success("Logged in successfully", successOptions);
      } else {
        dispatch({
          type: "LOGIN_FAIL",
          payload: response.data.message,
        });
        toast.error(response.data.message, errorOptions);
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // user register
  const register = async (name, email, password) => {
    try {
      dispatch({
        type: "REGISTER_REQUEST",
      });
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/auth/register`,
        { name, email, password },
        config
      );

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registered successfully", successOptions);
    } catch (error) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    loginReq,
    register,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthContext");
  }
  return context;
};



export default useAuth;
