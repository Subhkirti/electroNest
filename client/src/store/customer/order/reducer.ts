import { OrderState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: OrderState = {
  orders: [],
  order: null,
  razorpayOrderId: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

function orderReducer(state: OrderState = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.CREATE_ORDER_REQUEST:
    case ActionTypes.GET_ORDER_BY_ID_REQUEST:
    case ActionTypes.GET_ORDERS_REQUEST:
    case ActionTypes.GET_ORDER_BY_FILTERS_REQUEST:
    case ActionTypes.UPDATE_ORDER_STATUS_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_ORDERS_SUCCESS:
    case ActionTypes.GET_ORDER_BY_FILTERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orders: action?.payload?.data,
        totalCount: action?.payload.totalCount,
        order: action?.payload?.[0],
      };
    case ActionTypes.UPDATE_ORDER_STATUS_SUCCESS:
      const { orderId, status } = action?.payload;
      console.log('action?.payload:', action?.payload)
      return {
        ...state,
        isLoading: false,
        error: null,
        orders: state.orders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        ),
        order:
          state.order?.orderId === orderId ? { ...state.order, status } : null,
      };

    case ActionTypes.GET_ORDER_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        order: action?.payload,
      };
    case ActionTypes.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        order: { receiptId: action?.payload?.receiptId },
        razorpayOrderId: action?.payload?.razorpayOrderId,
      };
    case ActionTypes.CREATE_ORDER_FAILURE:
    case ActionTypes.GET_ORDER_BY_ID_FAILURE:
    case ActionTypes.GET_ORDERS_FAILURE:
    case ActionTypes.GET_ORDER_BY_FILTERS_FAILURE:
    case ActionTypes.UPDATE_ORDER_STATUS_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default orderReducer;
