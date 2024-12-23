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
      const addedItemState = {
        ...state,
        isLoading: false,
        cartItems:
          action?.payload?.length > 0
            ? action?.payload?.find((newItem: CartItem) => {
                // Check if the product already exists in the cart
                const existingItemIndex = state.cartItems.findIndex(
                  (item) => item.productId === newItem.productId
                );

                if (existingItemIndex !== -1) {
                  // Product exists, update the quantity
                  const updatedItem = {
                    ...state.cartItems[existingItemIndex],
                    quantity:
                      state.cartItems[existingItemIndex].quantity +
                      newItem.quantity,
                  };
                  // Return a new array with the updated item
                  return [
                    ...state.cartItems.slice(0, existingItemIndex),
                    updatedItem,
                    ...state.cartItems.slice(existingItemIndex + 1),
                  ];
                } else {
                  // Product doesn't exist, add new item
                  return [...state.cartItems, newItem];
                }
              })
            : state.cartItems,

        cart:
          state.cart &&
          action?.payload?.length > 0 &&
          action?.payload?.[0]?.cartId === state.cart.cartId
            ? {
                ...state.cart,
                totalItems: action.payload.reduce(
                  (sum: number, item: { quantity: number }) =>
                    sum + item.quantity,
                  0
                ),
                totalPrice: action.payload
                  .reduce(
                    (sum: number, item: { price: string; quantity: number }) =>
                      sum + parseFloat(item.price) * item.quantity,
                    0
                  )
                  .toFixed(2),
                totalDiscountPrice: action.payload
                  .reduce(
                    (
                      sum: number,
                      item: { discountPrice: string; quantity: number }
                    ) => sum + parseFloat(item.discountPrice) * item.quantity,
                    0
                  )
                  .toFixed(2),
                totalDeliveryCharges: action.payload
                  .reduce(
                    (sum: number, item: { deliveryCharges: string }) =>
                      sum + parseFloat(item.deliveryCharges),
                    0
                  )
                  .toFixed(2),
              }
            : state.cart,
      };

      return addedItemState;

    case ActionTypes.REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: action?.payload,
        cart: {
          ...state.cart,
          totalItems: action.payload.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          ),
          totalPrice: action.payload
            .reduce(
              (sum: number, item: { price: string; quantity: number }) =>
                sum + parseFloat(item.price) * item.quantity,
              0
            )
            .toFixed(2),
          totalDiscountPrice: action.payload
            .reduce(
              (
                sum: number,
                item: { discountPrice: string; quantity: number }
              ) => sum + parseFloat(item.discountPrice) * item.quantity,
              0
            )
            .toFixed(2),
          totalDeliveryCharges: action.payload
            .reduce(
              (sum: number, item: { deliveryCharges: string }) =>
                sum + parseFloat(item.deliveryCharges),
              0
            )
            .toFixed(2),
        },
      };
    case ActionTypes.REDUCE_CART_ITEM_SUCCESS:
      const cartItem = action.payload?.[0];
      return {
        ...state,
        isLoading: false,
        cartItems: state.cartItems.map((item) =>
          // Check if the productId matches and ensure the quantity is reduced
          item.cartItemId === cartItem.cartItemId
            ? {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
              }
            : item
        ),
        cart:
          state.cart && cartItem.cartId === state.cart.cartId
            ? {
                ...state.cart,
                totalItems: action.payload.reduce(
                  (sum: number, item: { quantity: number }) =>
                    sum + item.quantity,
                  0
                ),
                totalPrice: action.payload
                  .reduce(
                    (sum: number, item: { price: string; quantity: number }) =>
                      sum + parseFloat(item.price) * item.quantity,
                    0
                  )
                  .toFixed(2),
                totalDiscountPrice: action.payload
                  .reduce(
                    (
                      sum: number,
                      item: { discountPrice: string; quantity: number }
                    ) => sum + parseFloat(item.discountPrice) * item.quantity,
                    0
                  )
                  .toFixed(2),
                totalDeliveryCharges: action.payload
                  .reduce(
                    (sum: number, item: { deliveryCharges: string }) =>
                      sum + parseFloat(item.deliveryCharges),
                    0
                  )
                  .toFixed(2),
              }
            : state.cart,
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
