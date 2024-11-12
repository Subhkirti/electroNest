import axios from "axios";
import ApiUrls from "../../../common/apiUrls";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import { CartReqBody } from "../../../modules/customer/types/cartTypes";
import { getCurrentUser } from "../../../modules/customer/utils/localStorageUtils";

const getCart = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_CART_REQUEST });
  try {
    const res = await axios.get(`${ApiUrls.getCart}`, headersConfig);
    dispatch({
      type: ActionTypes.GET_CART_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_CART_FAILURE,
    });
  }
};

const getCartItems = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_CART_ITEMS_REQUEST });
  const userId = getCurrentUser()?.id;
  try {
    const res = await axios.get(
      userId ? `${ApiUrls.getCartItems}id=${userId}` : ApiUrls.getCartItems,
      headersConfig
    );
    dispatch({
      type: ActionTypes.GET_CART_ITEMS_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_CART_ITEMS_FAILURE,
    });
  }
};

const addItemToCart =
  (reqData: CartReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_ITEM_TO_CART_REQUEST });

    try {
      const res = await axios.post(
        `${ApiUrls.addItemToCart}`,
        reqData,
        headersConfig
      );
      dispatch({
        type: ActionTypes.ADD_ITEM_TO_CART_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_ITEM_TO_CART_FAILURE,
      });
    }
  };

const removeItemToCart =
  (cartItemId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_CART_ITEM_REQUEST });

    try {
      const res = await axios.delete(
        `${ApiUrls.getCartItems}id=${cartItemId}`,
        headersConfig
      );
      dispatch({
        type: ActionTypes.REMOVE_CART_ITEM_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REMOVE_CART_ITEM_FAILURE,
      });
    }
  };

const updateItemToCart =
  (cartItemId: number, reqData: any) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.UPDATE_CART_ITEM_REQUEST });

    try {
      const res = await axios.put(
        `${ApiUrls.getCartItems}id=${cartItemId}`,
        reqData,
        headersConfig
      );
      dispatch({
        type: ActionTypes.UPDATE_CART_ITEM_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.UPDATE_CART_ITEM_FAILURE,
      });
    }
  };

export {
  getCart,
  addItemToCart,
  removeItemToCart,
  updateItemToCart,
  getCartItems,
};
