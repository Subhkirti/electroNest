import axios from "axios";
import { toast } from "react-toastify";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../../../common/apiUrls";
import { userMap } from "../../../mappers/userMapper";
import AppRoutes from "../../../../../common/appRoutes";
import { setCurrentUser } from "../../../utils/localStorageUtils";

// register user actions
const registerRequest = () => ({ type: ActionTypes.REGISTER_REQUEST });
const registerSuccess = (user) => ({
  type: ActionTypes.REGISTER_SUCCESS,
  payload: user,
});
const registerFailure = (err) => ({
  type: ActionTypes.REGISTER_FAILURE,
  payload: err,
});

const register = (userReqBody) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await axios.post(ApiUrls.registerUser, userReqBody);
    const user = res?.data?.data && userMap(res.data.data);
    if (user) {
      setCurrentUser(user);
      dispatch(registerSuccess(user));
      window.location = AppRoutes.home;
    }
  } catch ({ response }) {
    toast.error(response?.data?.message);
    dispatch(registerFailure(response?.data?.message));
  }
};

// login actions
const loginRequest = () => ({ type: ActionTypes.LOGIN_REQUEST });
const loginSuccess = (user) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: user,
});
const loginFailure = (err) => ({
  type: ActionTypes.LOGIN_FAILURE,
  payload: err,
});

const login = (userReqBody) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await axios.post(ApiUrls.login, userReqBody);
    const user = res?.data?.data && userMap(res.data.data);
    setCurrentUser(user);
    dispatch(loginSuccess(user));
    window.location = AppRoutes.home;
  } catch ({ response }) {
    toast.error(response?.data?.message);
    dispatch(loginFailure(response?.data?.message));
  }
};

// logout action
const logout = () => async (dispatch) => {
  dispatch({ type: ActionTypes.LOGOUT, payload: null });
  localStorage.clear();
  window.location = "/";
};

export { register, login, logout };
