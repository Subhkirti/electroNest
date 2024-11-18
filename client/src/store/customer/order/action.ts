import axios from "axios";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { toast } from "react-toastify";
import { OrderReqBody } from "../../../modules/customer/types/orderTypes";
import { getCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
import { orderMap } from "../../../modules/customer/mappers/cartMapper";
import { NavigateFunction } from "react-router-dom";

const user = getCurrentUser();
const userId = user?.id || 0;
/* get order history */
const getOrderHistory = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_ORDER_HISTORY_REQUEST });

  try {
    const res = await axios.get(
      `${ApiUrls.getOrderHistory}?id=${userId}`,
      headersConfig
    );

    dispatch({
      type: ActionTypes.GET_ORDER_HISTORY_SUCCESS,
      payload: res?.data?.data.length > 0 ? res?.data?.data.map(orderMap) : [],
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
      payload: res?.data?.data ? orderMap(res?.data?.data) : null,
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_ORDER_BY_ID_FAILURE,
    });
  }
};

/* place/create order */
const createOrder =
  ({
    reqData,
    navigate,
  }: {
    reqData: OrderReqBody;
    navigate: NavigateFunction;
  }) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.CREATE_ORDER_REQUEST });

    try {
      // Call API to create the order
      const res = await axios.post(
        `${ApiUrls.createOrder}`,
        reqData,
        headersConfig
      );
      const orderId = res?.data?.data?.razorpayOrderId;
      if (orderId) {
        dispatch({
          type: ActionTypes.CREATE_ORDER_SUCCESS,
          payload: orderId,
        });
        navigate({ search: `step=3&order_id=${orderId}` });
      } else {
        toast.error("Something went wrong while placing the order.");
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.CREATE_ORDER_FAILURE,
      });
    }
  };

const verifyPayment = async ({
  orderId,
  navigate,
  razorpayPaymentId,
  razorpaySignature,
}: {
  orderId: string;
  navigate: NavigateFunction;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  try {
    const paymentVerification = await axios.post(
      `${ApiUrls.verifyPayment}`,
      {
        orderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      headersConfig
    );
    if (paymentVerification.data.success) {
      navigate({
        search: `step=3&order_id=${orderId}&payment=success`,
      });
    } else {
      toast.error("Payment verification failed.");
    }
  } catch (verifyError) {
    toast.error("Payment verification failed.");
  }
};
export { getOrderHistory, getOrderById, createOrder, verifyPayment };
