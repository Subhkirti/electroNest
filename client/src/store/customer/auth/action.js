import axios from "axios";
import { toast } from "react-toastify";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { userMap } from "../../../modules/customer/mappers/userMapper";
import { setCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
import AppRoutes from "../../../common/appRoutes";

// register user actions
const register = (userReqBody) => async (dispatch) => {
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
      window.location = AppRoutes.home;
    }
  } catch ({ response }) {
    toast.error(response?.data?.message);
    dispatch({
      type: ActionTypes.REGISTER_FAILURE,
      payload: response?.data?.message,
    });
  }
};

// login actions
const login = (userReqBody) => async (dispatch) => {
  dispatch({ type: ActionTypes.LOGIN_REQUEST });
  try {
    const res = await axios.post(ApiUrls.login, userReqBody);
    const user = res?.data?.data && userMap(res.data.data);
    setCurrentUser(user);
    dispatch({
      type: ActionTypes.LOGIN_SUCCESS,
      payload: user,
    });
    window.location = AppRoutes.home;
  } catch ({ response }) {
    toast.error(response?.data?.message);
    dispatch({
      type: ActionTypes.LOGIN_FAILURE,
      payload: response?.data?.message,
    });
  }
};

// logout action
const logout = () => async (dispatch) => {
  dispatch({ type: ActionTypes.LOGOUT, payload: null });
  localStorage.clear();
  window.location = "/";
};

export { register, login, logout };
