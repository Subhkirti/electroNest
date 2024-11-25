import axios from "axios";
import ApiUrls from "../../../common/apiUrls";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import { userMap } from "../../../modules/customer/mappers/userMapper";
import { UserReqBody } from "../../../modules/customer/types/userTypes";
import { toast } from "react-toastify";
import { NavigateFunction } from "react-router-dom";
import AdminAppRoutes from "../../../common/adminRoutes";

const isAdminEnv = window?.location.pathname.includes("/admin");
const getAllUsers =
  (pageNumber: number, pageSize: number) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ALL_USERS_REQUEST });
    try {
      const res = await axios.get(
        `${ApiUrls.getUsers}pageNumber=${pageNumber}&pageSize=${
          pageSize || 10
        }`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_ALL_USERS_SUCCESS,
        payload: {
          data: res?.data?.data?.length ? res?.data?.data.map(userMap) : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_ALL_USERS_FAILURE,
      });
    }
  };

const addUser = (user: UserReqBody) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.ADD_USER_REQUEST });
  try {
    const res = await axios.post(`${ApiUrls.addUser}`, user, headersConfig);
    dispatch({
      type: ActionTypes.ADD_USER_SUCCESS,
      payload: res?.data?.data ? userMap(res?.data?.data) : {},
    });
    toast.success(res?.data?.message);
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.ADD_USER_FAILURE,
    });
  }
};

const findUserById = (userId: number) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.FIND_USER_BY_ID_REQUEST });
  try {
    const res = await axios.get(`${ApiUrls.findUsers}id=${userId}`);

    dispatch({
      type: ActionTypes.FIND_USER_BY_ID_SUCCESS,
      payload: res?.data?.data ? userMap(res?.data?.data) : {},
    });
    res?.data?.data?.length === 0 &&
      toast.info(
        userId
          ? `User details not found for id ${userId}.`
          : "User details not found."
      );
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.FIND_USER_BY_ID_FAILURE,
    });
  }
};

const deleteUser = (userId: number) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.DELETE_USER_REQUEST });

  try {
    const res = await axios.delete(
      `${ApiUrls.deleteUser}id=${userId}`,
      headersConfig
    );

    dispatch({
      type: ActionTypes.DELETE_USER_SUCCESS,
      payload: userId,
    });
    res?.data?.data && toast.success("User Deleted Successfully");
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.DELETE_USER_FAILURE,
    });
  }
};

const editUser =
  (userId: number, reqData: UserReqBody, navigate?: NavigateFunction) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.EDIT_USER_REQUEST });
    try {
      const res = await axios.post(
        `${ApiUrls.editUser}id=${userId}`,
        reqData,
        headersConfig
      );

      dispatch({
        type: ActionTypes.EDIT_USER_SUCCESS,
        payload: {
          data: res?.data?.data ? userMap(res?.data?.data) : {},
          id: userId,
        },
      });
      if (res?.data?.data) {
        toast.success("User details updated successfully.");
        isAdminEnv && navigate && navigate(AdminAppRoutes.users);
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.EDIT_USER_FAILURE,
      });
    }
  };

export { getAllUsers, addUser, findUserById, deleteUser, editUser };
