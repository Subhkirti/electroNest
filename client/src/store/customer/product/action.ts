import axios from "axios";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { ActionDispatch } from "../../storeTypes";
import { handleCatchError, headersConfig } from "../../../modules/customer/utils/apiUtils";
import { ProductReqBody, ProductSearchReqBody } from "../../../modules/customer/types/productTypes";

const findProducts =
  (reqData: ProductSearchReqBody) => async (dispatch: ActionDispatch) => {
    const {
      colors,
      minPrice,
      maxPrice,
      discount,
      category,
      stock,
      sort,
      pageNumber,
      pageSize,
    } = reqData;

    dispatch({ type: ActionTypes.FIND_PRODUCTS_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.findProducts}/color=${colors}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${discount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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

const addProduct = (reqData: ProductReqBody) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.FIND_PRODUCT_BY_ID_REQUEST });

  try {
    const res = await axios.post(ApiUrls.addProduct, reqData, headersConfig);

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

export { findProducts, findProductsById, addProduct };
