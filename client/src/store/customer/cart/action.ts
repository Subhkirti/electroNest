import axios from "axios";
import ApiUrls from "../../../common/apiUrls";
import { handleCatchError } from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const addItemToCart = (reqData: number) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.ADD_ITEM_TO_CART_REQUEST });

  try {
    const res = await axios.post(`${ApiUrls.addItemToCart}`, reqData);
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
  (reqData: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_CART_ITEM_REQUEST });

    try {
      const res = await axios.post(`${ApiUrls.removeItemToCart}`, reqData);
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
  (reqData: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.UPDATE_CART_ITEM_REQUEST });

    try {
      const res = await axios.post(`${ApiUrls.updateItemToCart}`, reqData);
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
export { addItemToCart, removeItemToCart, updateItemToCart };
