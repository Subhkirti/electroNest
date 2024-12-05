import axios from "axios";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { userMap } from "../../../modules/customer/mappers/userMapper";
import { setCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
import AppRoutes from "../../../common/appRoutes";
import { ActionDispatch } from "../../storeTypes";
import { handleCatchError } from "../../../modules/customer/utils/apiUtils";
import {
  LoginReqBody,
  RegisterReqBody,
} from "../../../modules/customer/types/userTypes";
import AdminAppRoutes from "../../../common/adminRoutes";
import { toast } from "react-toastify";

// register user actions
const register =
  (userReqBody: RegisterReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REGISTER_REQUEST });
    try {
      const res = await axios.post(ApiUrls.registerUser, userReqBody);
      const user = res?.data?.data && userMap(res.data.data);
      if (user) {
        setCurrentUser(user);
        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: user,
        });
        user?.name && toast.success(`Welcome ${user?.name}!`);

        setTimeout(() => {
          window.location.pathname = AppRoutes.home;
        }, 1500);
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REGISTER_FAILURE,
      });
    }
  };

// login actions
const login =
  (userReqBody: LoginReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.LOGIN_REQUEST });
    try {
      const res = await axios.post(ApiUrls.login, userReqBody);
      const user = res?.data?.data && userMap(res.data.data);
      setCurrentUser(user);
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: user,
      });

      user?.name && toast.success(`Welcome Back ${user?.name}!`);
      setTimeout(() => {
        window.location.pathname =
          window.location.pathname === "/admin"
            ? AdminAppRoutes.dashboard
            : AppRoutes.home;
      }, 1500);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.LOGIN_FAILURE,
      });
    }
  };

// logout action
const logout = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.LOGOUT_REQUEST });
  toast.success("Logout Successfully");

  setTimeout(() => {
    localStorage.clear();
    dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
    window.location.pathname = "/";
  }, 1000);
};

export { register, login, logout };
