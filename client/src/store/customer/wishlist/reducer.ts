import { RootAction, WishlistState } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: WishlistState = {
  products: [],
  isLoading: false,
  productId: -1,
  totalCount: 0,
  error: null,
};

function wishlistReducer(state: WishlistState = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.GET_WISHLIST_REQUEST:
    case ActionTypes.REMOVE_ITEM_FROM_WISHLIST_REQUEST:
    case ActionTypes.ADD_ITEM_TO_WISHLIST_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_WISHLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products: action?.payload?.data,
        totalCount: action?.payload?.totalCount,
      };
    case ActionTypes.ADD_ITEM_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        productId: action?.payload?.productId,
        products: state?.products
          ? [...state.products, action?.payload?.data]
          : [action?.payload?.data],
        totalCount: state.totalCount + 1,
      };
    case ActionTypes.REMOVE_ITEM_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        productId: action?.payload?.productId,
        products: state?.products
          ? state.products.filter(
              (product) => product.productId !== action.payload?.productId
            )
          : [],
        totalCount: state.totalCount - 1,
      };

    case ActionTypes.REMOVE_ITEM_FROM_WISHLIST_FAILURE:
    case ActionTypes.ADD_ITEM_TO_WISHLIST_FAILURE:
    case ActionTypes.GET_WISHLIST_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default wishlistReducer;
