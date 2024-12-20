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
import {
  cartItemsMap,
  cartMap,
} from "../../../modules/customer/mappers/cartMapper";
import { toast } from "react-toastify";
import AppRoutes from "../../../common/appRoutes";

const userId = getCurrentUser()?.id || 0;
const getCart = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_CART_REQUEST });
  try {
    const res = await axios.get(ApiUrls.getCart, headersConfig);
    dispatch({
      type: ActionTypes.GET_CART_SUCCESS,
      payload: res?.data?.data ? cartMap(res?.data?.data) : null,
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_CART_FAILURE,
    });
  }
};

const getCartItems = () => async (dispatch: ActionDispatch) => {
  if (userId) {
    dispatch({ type: ActionTypes.GET_CART_ITEMS_REQUEST });
    try {
      const res = await axios.get(ApiUrls.getCartItems, headersConfig);
      dispatch({
        type: ActionTypes.GET_CART_ITEMS_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? res?.data?.data.map(cartItemsMap) : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_CART_ITEMS_FAILURE,
      });
    }
  }
};

const addItemToCart =
  (reqData: CartReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_ITEM_TO_CART_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.addItemToCart,
        reqData,
        headersConfig
      );

      dispatch({
        type: ActionTypes.ADD_ITEM_TO_CART_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? res?.data?.data.map(cartItemsMap) : [],
      });
      window.location.pathname !== AppRoutes.cart &&
        res?.data?.message &&
        toast.success(res?.data?.message, { position: "bottom-center" });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_ITEM_TO_CART_FAILURE,
      });
    }
  };

const removeItemFromCart =
  (cartItemId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_CART_ITEM_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.removeItemFromCart,
        { cartItemId },
        headersConfig
      );

      dispatch({
        type: ActionTypes.REMOVE_CART_ITEM_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? res?.data?.data.map(cartItemsMap) : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REMOVE_CART_ITEM_FAILURE,
      });
    }
  };

const reduceItemFromCart =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REDUCE_CART_ITEM_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.reduceItemFromCart,
        { productId },
        headersConfig
      );

      dispatch({
        type: ActionTypes.REDUCE_CART_ITEM_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? res?.data?.data.map(cartItemsMap) : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REDUCE_CART_ITEM_FAILURE,
      });
    }
  };

export {
  getCart,
  addItemToCart,
  removeItemFromCart,
  reduceItemFromCart,
  getCartItems,
};
