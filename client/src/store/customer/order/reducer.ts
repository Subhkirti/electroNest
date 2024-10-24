import { OrderState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: OrderState = {
  orders: [],
  order: null,
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
        order: action?.payload,
        orders: [...state.orders, action?.payload],
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
