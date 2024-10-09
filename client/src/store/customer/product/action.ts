import axios from "axios";
import ActionTypes from "./actionTypes";
import { toast } from "react-toastify";
import ApiUrls from "../../../common/apiUrls";
import { ActionDispatch } from "../../storeTypes";
import { handleCatchError } from "../../../modules/customer/utils/apiUtils";

const findProducts =
  (reqData: ProductReqBody) => async (dispatch: ActionDispatch) => {
    const {
      colors,
      sizes,
      minPrice,
      maxPrice,
      minDiscount,
      category,
      stock,
      sort,
      pageNumber,
      pageSize,
    } = reqData;

    dispatch({ type: ActionTypes.FIND_PRODUCTS_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.findProducts}/color=${colors}&size=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

      dispatch({
        type: ActionTypes.FIND_PRODUCTS_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCTS_FAILURE,
      });
    }
  };

const findProductsById =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.FIND_PRODUCT_BY_ID_REQUEST });

    try {
      const res = await axios.get(`${ApiUrls.findProductsById}/${productId}`);

      dispatch({
        type: ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCT_BY_ID_FAILURE,
      });
    }
  };

export { findProducts, findProductsById };
