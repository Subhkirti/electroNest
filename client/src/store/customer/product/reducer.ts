import { ProductState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: ProductState = {
  products: [],
  product: {},
  isLoading: false,
  error: null,
};

function productReducer(
  state: ProductState = initState,
  action: RootAction
): ProductState {
  switch (action.type) {
    case ActionTypes.FIND_PRODUCTS_REQUEST:
    case ActionTypes.FIND_PRODUCT_BY_ID_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.FIND_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products: action?.payload,
      };
    case ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        product: action?.payload,
      };
    case ActionTypes.FIND_PRODUCTS_FAILURE:
    case ActionTypes.FIND_PRODUCT_BY_ID_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default productReducer;
