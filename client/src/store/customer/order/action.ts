import axios from "axios";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { ActionDispatch, AppDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { toast } from "react-toastify";
import { OrderReqBody } from "../../../modules/customer/types/orderTypes";
import { getCurrentUser } from "../../../modules/customer/utils/localStorageUtils";
import { orderMap } from "../../../modules/customer/mappers/cartMapper";
import { NavigateFunction } from "react-router-dom";
import AppRoutes from "../../../common/appRoutes";
import { getCart } from "../cart/action";

const user = getCurrentUser();
const userId = user?.id || 0;

/* get order history */
const getOrderHistory =
  (pageNumber?: number, pageSize?: number) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_ORDER_HISTORY_REQUEST });

    try {
      const res = await axios.get(
        pageNumber != undefined
          ? `${
              ApiUrls.getOrderHistory
            }?id=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize || 10}`
          : `${ApiUrls.getOrderHistory}?id=${userId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_ORDER_HISTORY_SUCCESS,
        payload: {
          data: res?.data?.data.length > 0 ? res?.data?.data.map(orderMap) : [],
          totalCount: res?.data?.totalCount,
        },
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
      if (res?.data?.data) {
        const { receiptId, razorpayOrderId } = res?.data?.data;

        dispatch({
          type: ActionTypes.CREATE_ORDER_SUCCESS,
          payload: { receiptId, razorpayOrderId },
        });

        // navigation
        reqData?.cartId
          ? navigate({
              search: `step=3&receipt_id=${receiptId}&razorpay_id=${razorpayOrderId}`,
            })
          : reqData?.productId &&
            navigate({
              search: `step=3&product_id=${reqData?.productId}
          `,
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
  razorpayOrderId,
  navigate,
  dispatch,
  razorpayPaymentId,
  razorpaySignature,
}: {
  cartId: number;
  receiptId: string;
  razorpayOrderId: string;
  navigate: NavigateFunction;
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
        razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      headersConfig
    );
    if (paymentVerification.data.status >= 200) {
      toast.success("Order placed. Thanks for shopping with us.");
      dispatch(getCart());
      navigate(AppRoutes.products);
    } else {
      toast.error("Payment verification failed.");
      navigate(AppRoutes.products);
    }
  } catch (verifyError) {
    toast.error("Payment verification failed.");
    navigate(AppRoutes.products);
  }
};
export { getOrderHistory, getOrderById, createOrder, verifyPayment };
