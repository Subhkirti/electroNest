import axios from "axios";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { toast } from "react-toastify";

/* get order history */
const getOrderHistory =
  (userId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ORDER_HISTORY_REQUEST });

    try {
      const res = await axios.get(`${ApiUrls.getOrderHistory}`, headersConfig);

      dispatch({
        type: ActionTypes.GET_ORDER_HISTORY_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_ORDER_HISTORY_FAILURE,
      });
    }
  };

/* get order details by id */
const getOrderById = (orderId: number) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_ORDER_BY_ID_REQUEST });
  try {
    const res = await axios.get(`${ApiUrls.getOrder}${orderId}`, headersConfig);

    dispatch({
      type: ActionTypes.GET_ORDER_BY_ID_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_ORDER_BY_ID_FAILURE,
    });
  }
};

/* place/create order */
const createOrder = (reqData: any) => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.CREATE_ORDER_REQUEST });
  try {
    const res = await axios.post(
      `${ApiUrls.createOrder}`,
      {
        address: reqData.address,
        price: reqData.price,
      },
      headersConfig
    );
    const orderData = res?.data?.data;
    if (orderData.id) {
      dispatch({
        type: ActionTypes.CREATE_ORDER_SUCCESS,
        payload: orderData,
      });

      reqData.navigate({ search: `step=3&order_id=${orderData.id}` });
    } else {
      toast.error("Something went wrong while placing order.");
    }
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.CREATE_ORDER_FAILURE,
    });
  }
};

export { getOrderHistory, getOrderById, createOrder };
