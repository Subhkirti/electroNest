import { CartItem } from "../../../modules/customer/types/cartTypes";
import { CartState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: CartState = {
  cartItems: [],
  cart: null,
  isLoading: false,
  error: null,
};

function cartReducer(state = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.ADD_ITEM_TO_CART_REQUEST:
    case ActionTypes.GET_CART_REQUEST:
    case ActionTypes.GET_CART_ITEMS_REQUEST:
    case ActionTypes.REMOVE_CART_ITEM_REQUEST:
    case ActionTypes.UPDATE_CART_ITEM_REQUEST:
    case ActionTypes.REDUCE_CART_ITEM_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cart: action?.payload || null,
      };
    case ActionTypes.GET_CART_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: action?.payload,
      };
    case ActionTypes.ADD_ITEM_TO_CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems:
          action?.payload?.length > 0
            ? [...state.cartItems, ...action?.payload]
            : state.cartItems,

        cart:
          action?.payload?.length > 0
            ? {
                ...state.cart,
                totalItems: state?.cart?.totalItems
                  ? state?.cart?.totalItems + 1
                  : 1,
              }
            : state.cart,
      };
    case ActionTypes.REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: state.cartItems.filter(
          (item: CartItem) => item?.cartItemId !== action?.payload?.cartItemId
        ),
        cart:
          state.cart?.cartId === action?.payload?.cartId &&
          state.cart?.userId === action?.payload?.userId
            ? null
            : state.cart,
      };
    case ActionTypes.REDUCE_CART_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cart:
          state.cart && action.payload == state.cart.cartId
            ? { ...state.cart, totalItems: state.cart.totalItems - 1 }
            : null,
      };
    case ActionTypes.UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: state.cartItems.map((item: CartItem) =>
          item?.cartItemId === action?.payload?.id
            ? action?.payload?.data
            : item
        ),
      };
    case ActionTypes.GET_CART_FAILURE:
    case ActionTypes.GET_CART_ITEMS_FAILURE:
    case ActionTypes.ADD_ITEM_TO_CART_FAILURE:
    case ActionTypes.REMOVE_CART_ITEM_FAILURE:
    case ActionTypes.UPDATE_CART_ITEM_FAILURE:
    case ActionTypes.REDUCE_CART_ITEM_FAILURE:
      return { ...state, isLoading: false, error: action?.payload || null };
    default:
      return state;
  }
}

export default cartReducer;
