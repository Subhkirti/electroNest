import ActionTypes from "./actionTypes";

const initState = {
  user: null,
  isLoading: false,
  error: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
    case ActionTypes.GET_USER_PROFILE_REQUEST:
    case ActionTypes.REGISTER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.REGISTER_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.GET_USER_PROFILE_SUCCESS:
      return { ...state, isLoading: false, error: null, user: action?.payload };
    case ActionTypes.REGISTER_FAILURE:
    case ActionTypes.LOGIN_FAILURE:
    case ActionTypes.GET_USER_PROFILE_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    case ActionTypes.LOGOUT:
      return initState;
    default:
      return state;
  }
};

export default authReducer;
