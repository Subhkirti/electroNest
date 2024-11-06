import { RootAction, UsersState } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: UsersState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

function usersReducer(state: UsersState = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.GET_ALL_USERS_REQUEST:
    case ActionTypes.ADD_USER_REQUEST:
    case ActionTypes.FIND_USER_BY_ID_REQUEST:
    case ActionTypes.DELETE_USER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        users: action?.payload?.data,
        totalCount: action?.payload?.totalCount,
      };
    case ActionTypes.ADD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action?.payload,
        users: [...state.users, action?.payload],
        totalCount: state.totalCount + 1,
      };
    case ActionTypes.FIND_USER_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action?.payload,
      };
    case ActionTypes.DELETE_USER_SUCCESS:
      const filteredUsers = state.users.filter(
        (user) => user?.id !== action?.payload
      );
      return {
        ...state,
        isLoading: false,
        error: null,
        users: filteredUsers,
        totalCount: state.totalCount - 1,
      };
    case ActionTypes.GET_ALL_USERS_FAILURE:
    case ActionTypes.ADD_USER_FAILURE:
    case ActionTypes.DELETE_USER_FAILURE:
    case ActionTypes.FIND_USER_BY_ID_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default usersReducer;
