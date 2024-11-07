import { RootAction, UsersState } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: UsersState = {
  users: [],
  user: null,
  newUser: null,
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
    case ActionTypes.EDIT_USER_REQUEST:
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
        newUser: action?.payload,
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
    case ActionTypes.EDIT_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        users: state.users.map((user) =>
          user?.id === action.payload.id ? action.payload.data : user
        ),
        user: action?.payload?.data,
      };
    case ActionTypes.GET_ALL_USERS_FAILURE:
    case ActionTypes.ADD_USER_FAILURE:
    case ActionTypes.DELETE_USER_FAILURE:
    case ActionTypes.FIND_USER_BY_ID_FAILURE:
    case ActionTypes.EDIT_USER_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default usersReducer;
