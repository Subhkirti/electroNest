import axios from "axios";
import ApiUrls from "../../../common/apiUrls";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import { toast } from "react-toastify";
import { productMap } from "../../../modules/customer/mappers/productsMapper";

const removeFromWishlist =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_ITEM_TO_WISHLIST_REQUEST });
    try {
      const res = await axios.delete(
        `${ApiUrls.removeItemFromWishlist}id=${productId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.REMOVE_ITEM_TO_WISHLIST_SUCCESS,
        payload: productId,
      });
      res?.data?.data && toast.success("Product is removed from wishlist");
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REMOVE_ITEM_TO_WISHLIST_FAILURE,
      });
    }
  };

const addToWishlist =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_ITEM_TO_WISHLIST_REQUEST });
    try {
      const res = await axios.delete(
        `${ApiUrls.addItemToWishlist}id=${productId}`,
        headersConfig
      );
      dispatch({
        type: ActionTypes.ADD_ITEM_TO_WISHLIST_SUCCESS,
        payload: productId,
      });
      res?.data?.data && toast.success("Product is added from wishlist");
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_ITEM_TO_WISHLIST_FAILURE,
      });
    }
  };

const getWishlist = (userId: number) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_WISHLIST_REQUEST });
  try {
    const res = await axios.delete(
      `${ApiUrls.getWishlist}id=${userId}`,
      headersConfig
    );

    dispatch({
      type: ActionTypes.GET_WISHLIST_SUCCESS,
      payload: {
        data: res?.data?.data?.length > 0 ? res.data.data.map(productMap) : [],
        totalCount: res?.data?.totalCount,
      },
    });

  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_WISHLIST_FAILURE,
    });
  }
};
export { removeFromWishlist, addToWishlist, getWishlist };
