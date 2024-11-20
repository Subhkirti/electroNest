import { OrderState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: OrderState = {
  orders: [],
  order: null,
  razorpayOrderId: null,
  isLoading: false,
  error: null,
};

function orderReducer(state: OrderState = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.CREATE_ORDER_REQUEST:
    case ActionTypes.GET_ORDER_BY_ID_REQUEST:
    case ActionTypes.GET_ORDER_HISTORY_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orders: action?.payload,
        order: action?.payload?.[0],
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
        order: { id: action?.payload?.orderId },
        razorpayOrderId: action?.payload?.razorpayOrderId,
      };
    case ActionTypes.CREATE_ORDER_FAILURE:
    case ActionTypes.GET_ORDER_BY_ID_FAILURE:
    case ActionTypes.GET_ORDER_HISTORY_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default orderReducer;
