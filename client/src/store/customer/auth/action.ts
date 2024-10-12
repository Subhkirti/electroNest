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
        window.location.pathname = AppRoutes.home;
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
      window.location.pathname = AppRoutes.home;
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.LOGIN_FAILURE,
      });
    }
  };

// logout action
const logout = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.LOGOUT, payload: null });
  localStorage.clear();
  window.location.pathname = "/";
};

export { register, login, logout };
