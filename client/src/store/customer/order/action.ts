import axios from "axios";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch, AppDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { toast } from "react-toastify";
import {
  OrderReqBody,
  OrderStatus,
} from "../../../modules/customer/types/orderTypes";
import { getCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
import {
  orderHistoryMap,
  orderMap,
} from "../../../modules/customer/mappers/cartMapper";
import { NavigateFunction } from "react-router-dom";
import AppRoutes from "../../../common/appRoutes";
import { getCart } from "../cart/action";
import AppStrings from "../../../common/appStrings";

const user = getCurrentUser();
const userId = user?.id || 0;

/* get order history */
const getOrders =
  (pageNumber?: number, pageSize?: number) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ORDERS_REQUEST });

    try {
      const res = await axios.get(
        pageNumber != undefined
          ? `${
              ApiUrls.getOrders
            }?id=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize || 10}`
          : `${ApiUrls.getOrders}?id=${userId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_ORDERS_SUCCESS,
        payload: {
          data: res?.data?.data.length > 0 ? res?.data?.data.map(orderMap) : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_ORDERS_FAILURE,
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

/* get orders by filters*/
const getOrdersByFilters =
  (pageNumber: number, pageSize: number, statuses: string[]) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ORDER_BY_FILTERS_REQUEST });

    try {
      const res = await axios.get(
        `${
          ApiUrls.filterOrders
        }?id=${userId}&pageNumber=${pageNumber}&pageSize=${
          pageSize || 10
        }&status=${statuses}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_ORDER_BY_FILTERS_SUCCESS,
        payload: {
          data: res?.data?.data.length > 0 ? res?.data?.data.map(orderMap) : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_ORDER_BY_FILTERS_FAILURE,
      });
    }
  };

/* get orders history */
const getOrderHistory =
  (orderId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ORDER_HISTORY_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.getOrderHistory}?orderId=${orderId}`,
        headersConfig
      );
      dispatch({
        type: ActionTypes.GET_ORDER_HISTORY_SUCCESS,
        payload:
          res?.data?.data.length > 0
            ? res?.data?.data.map(orderHistoryMap)
            : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_ORDER_HISTORY_FAILURE,
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
      if (res?.data?.data) {
        const { receiptId, razorpayOrderId, orderId } = res?.data?.data;

        dispatch({
          type: ActionTypes.CREATE_ORDER_SUCCESS,
          payload: { receiptId, razorpayOrderId },
        });

        // navigation
        reqData?.cartId
          ? navigate({
              search: `step=3&receipt_id=${receiptId}&razorpay_id=${razorpayOrderId}&order_id=${orderId}`,
            })
          : reqData?.productId &&
            navigate({
              search: `step=3&receipt_id=${receiptId}&razorpay_id=${razorpayOrderId}&order_id=${orderId}&product_id=${reqData?.productId}`,
            });
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
  cartId,
  receiptId,
  orderId,
  razorpayOrderId,
  dispatch,
  razorpayPaymentId,
  razorpaySignature,
}: {
  orderId: string;
  cartId: number | string;
  receiptId: string;
  razorpayOrderId: string;
  dispatch: AppDispatch;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  try {
    const paymentVerification = await axios.post(
      `${ApiUrls.verifyPayment}`,
      {
        cartId,
        receiptId,
        orderId,
        razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      headersConfig
    );
    if (paymentVerification.status >= 200) {
      toast.success("Order placed. Thanks for shopping with us.");
      dispatch(getCart());
      window.location.href = AppRoutes.products;
    } else {
      toast.error("Payment verification failed.");
      window.location.href = AppRoutes.products;
    }
  } catch (verifyError) {
    toast.error("Payment verification failed.");
    window.location.href = AppRoutes.products;
  }
};

// (send receipt Id while creating order, and orderId when order is already placed)
const updateOrderStatus =
  ({
    orderId,
    status,
    receiptId,
  }: {
    orderId?: number;
    receiptId?: number;
    status: OrderStatus;
  }) =>
  async (dispatch: ActionDispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_ORDER_STATUS_REQUEST,
    });

    try {
      const response = await axios.put(
        ApiUrls.updateOrderStatus,
        {
          orderId,
          userId,
          receiptId,
          status,
        },
        headersConfig
      );

      if (response?.data?.status >= 200) {
        dispatch({
          type: ActionTypes.UPDATE_ORDER_STATUS_SUCCESS,
          payload: response.data,
        });
        if (status === OrderStatus.CANCELLED) {
          toast.success(AppStrings.yourOrderHasBeenCancelled);
        }
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.UPDATE_ORDER_STATUS_FAILURE,
      });
    }
  };

export {
  getOrders,
  getOrderHistory,
  getOrderById,
  createOrder,
  verifyPayment,
  getOrdersByFilters,
  updateOrderStatus,
};
