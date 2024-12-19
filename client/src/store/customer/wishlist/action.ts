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
import { getCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
const userId = getCurrentUser()?.id;

const removeFromWishlist =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_ITEM_FROM_WISHLIST_REQUEST });
    try {
      const res = await axios.post(
        ApiUrls.removeItemFromWishlist,
        { userId, productId },
        headersConfig
      );

      dispatch({
        type: ActionTypes.REMOVE_ITEM_FROM_WISHLIST_SUCCESS,
        payload: productId,
      });
      res?.data?.data && toast.success("Product is removed from wishlist");
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REMOVE_ITEM_FROM_WISHLIST_FAILURE,
      });
    }
  };

const addToWishlist =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_ITEM_TO_WISHLIST_REQUEST });
    try {
      const { data } = await axios.post(
        ApiUrls.addItemToWishlist,
        { userId, productId },
        headersConfig
      );

      if (data.status === 200) {
        dispatch({
          type: ActionTypes.ADD_ITEM_TO_WISHLIST_SUCCESS,
          payload: {
            productId,
            data: data?.data ? productMap(data?.data) : null,
          },
        });
      } else {
        toast.error("Failed to add product in your wishlist");
      }
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
    const res = await axios.get(
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
