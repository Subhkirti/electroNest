import axios from "axios";
import ApiUrls from "../../../../common/apiUrls";
import { getCurrentUser, setCurrentUser } from "../../utils/localStorageUtils";
import ActionTypes from "./actionTypes";
import { toast } from "react-toastify";

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
    const user = res?.data;
    const token = user?.token;
    if (token) {
      setCurrentUser({ token });
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
    const user = res?.data;
    setCurrentUser(user);
  } catch ({ response }) {
    toast.error(response?.data?.message);

    dispatch(loginFailure(response?.data?.message));
  }
};

// user profile actions
const getUserProfileRequest = () => ({
  type: ActionTypes.GET_USER_PROFILE_REQUEST,
});
const getUserProfileSuccess = (user) => ({
  type: ActionTypes.GET_USER_PROFILE_SUCCESS,
  payload: user,
});
const getUserProfileFailure = (err) => ({
  type: ActionTypes.GET_USER_PROFILE_FAILURE,
  payload: err,
});

const getUserProfile = () => async (dispatch) => {
  const token = getCurrentUser()?.token;

  dispatch(getUserProfileRequest());
  try {
    const res = await axios.get(ApiUrls.login, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = res?.data;
    if (user) {
      setCurrentUser(user);
      dispatch(getUserProfileSuccess(user));
    }
  } catch ({ response }) {
    toast.error(response?.data?.message);
    dispatch(getUserProfileFailure(response?.data?.message));
  }
};

// logout action
const logout = () => async (dispatch) => {
  dispatch({ type: ActionTypes.LOGOUT, payload: null });
};

export { register, registerSuccess, login, getUserProfile, logout };
