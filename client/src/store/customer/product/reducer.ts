import { ProductState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: ProductState = {
  topLevelCategories: [],
  secondLevelCategories: [],
  thirdLevelCategories: [],
  products: [],
  product: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

function productReducer(
  state: ProductState = initState,
  action: RootAction
): ProductState {
  switch (action.type) {
    case ActionTypes.FIND_PRODUCTS_REQUEST:
    case ActionTypes.FIND_PRODUCT_BY_ID_REQUEST:
    case ActionTypes.ADD_PRODUCT_REQUEST:
    case ActionTypes.GET_TOP_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.GET_SECOND_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.GET_THIRD_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.GET_PRODUCTS_REQUEST:
    case ActionTypes.DELETE_PRODUCT_REQUEST:
    case ActionTypes.EDIT_PRODUCT_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.FIND_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products: action?.payload?.data,
        totalCount: action?.payload?.totalCount,
      };
    case ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        product: action?.payload,
      };
    case ActionTypes.ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products:
          state.products.length > 0
            ? [...state?.products, action?.payload]
            : [action?.payload],
        product: action?.payload,
        totalCount: state.totalCount + 1,
      };
    case ActionTypes.EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products: state.products.map((product) =>
          product?.productId === action.payload.id
            ? action.payload.data
            : product
        ),
        product: action?.payload?.data,
      };
    case ActionTypes.GET_TOP_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        topLevelCategories: action.payload,
      };
    case ActionTypes.GET_SECOND_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        secondLevelCategories: action.payload,
      };
    case ActionTypes.GET_THIRD_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        thirdLevelCategories: action.payload,
      };

    case ActionTypes.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products:
          action.payload.data?.length > 0
            ? action.payload.data
            : state.products,
        totalCount: action.payload.totalCount,
      };
    case ActionTypes.DELETE_PRODUCT_SUCCESS:
      const filteredProducts = state.products.filter(
        (product) => product.productId !== action?.payload
      );
      return {
        ...state,
        isLoading: false,
        error: null,
        products: filteredProducts,
        totalCount: state.totalCount - 1,
      };
    case ActionTypes.FIND_PRODUCTS_FAILURE:
    case ActionTypes.FIND_PRODUCT_BY_ID_FAILURE:
    case ActionTypes.ADD_PRODUCT_FAILURE:
    case ActionTypes.GET_TOP_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.GET_SECOND_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.GET_THIRD_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.GET_PRODUCTS_FAILURE:
    case ActionTypes.DELETE_PRODUCT_FAILURE:
    case ActionTypes.EDIT_PRODUCT_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default productReducer;
