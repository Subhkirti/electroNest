import axios from "axios";
import ApiUrls from "../../../../common/apiUrls";
import ActionTypes from "./actionTypes";
import { toast } from "react-toastify";

const findProducts = (reqData) => async (dispatch) => {
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
    const res = await axios.post(
      `${ApiUrls.findProducts}/color=${colors}&size=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      userReqBody
    );

    dispatch({
      type: ActionTypes.FIND_PRODUCTS_SUCCESS,
      payload: res?.data?.data,
    });
  } catch ({ response }) {
    dispatch({
      type: ActionTypes.FIND_PRODUCTS_FAILURE,
      payload: response?.data?.message,
    });
    toast.error(response?.data?.message);
  }
};

const findProductsById = (productId) => async (dispatch) => {
  dispatch({ type: ActionTypes.FIND_PRODUCT_BY_ID_REQUEST });

  try {
    const res = await axios.get(`${ApiUrls.findProductsById}/${productId}`);

    dispatch({
      type: ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS,
      payload: res?.data?.data,
    });
  } catch ({ response }) {
    dispatch({
      type: ActionTypes.FIND_PRODUCT_BY_ID_FAILURE,
      payload: response?.data?.message,
    });
    toast.error(response?.data?.message);
  }
};

export { findProducts, findProductsById };
