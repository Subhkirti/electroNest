import {
  SecondLevelCategories,
  ThirdLevelCategories,
  TopLevelCategories,
} from "../../../modules/customer/types/productTypes";
import { ProductState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import WishlistActionTypes from "../wishlist/actionTypes";

const initState: ProductState = {
  topLevelCategories: [],
  secondLevelCategories: [],
  thirdLevelCategories: [],
  categories: [],
  products: [],
  productsCarousel: [],
  product: null,
  newProduct: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  topLCategoryCount: 0,
  secondLCategoryCount: 0,
  thirdLCategoryCount: 0,
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
    case ActionTypes.ADD_TOP_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_REQUEST:
    case ActionTypes.GET_ALL_CATEGORIES_REQUEST:
    case ActionTypes.GET_PRODUCTS_CAROUSEL_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.GET_PRODUCTS_CAROUSEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        productsCarousel: action?.payload,
      };

    case WishlistActionTypes.ADD_ITEM_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        product: state?.product
          ? state?.product?.productId === action.payload?.productId
            ? { ...state?.product, isLiked: true }
            : state.product
          : null,
        productsCarousel: state.productsCarousel.map((carouselCategory) => ({
          ...carouselCategory,
          products: carouselCategory.products.map((product) =>
            product.productId === action.payload?.productId
              ? { ...product, isLiked: true }
              : product
          ),
        })),
        products: state.products.map((product) =>
          product.productId === action.payload?.productId
            ? { ...product, isLiked: true }
            : product
        ),
      };
    case WishlistActionTypes.REMOVE_ITEM_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        product: state?.product
        ? state?.product?.productId === action.payload?.productId
          ? { ...state?.product, isLiked: false }
          : state.product
        : null,
      productsCarousel: state.productsCarousel.map((carouselCategory) => ({
        ...carouselCategory,
        products: carouselCategory.products.map((product) =>
          product.productId === action.payload?.productId
            ? { ...product, isLiked: false }
            : product
        ),
      })),
      products: state.products.map((product) =>
        product.productId === action.payload?.productId
          ? { ...product, isLiked: false }
          : product
      ),
      };

    case ActionTypes.FIND_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        products: action?.payload?.isViewMore
          ? [...state.products, ...action?.payload?.data]
          : action?.payload?.data,
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
        newProduct: action?.payload,
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
    case ActionTypes.ADD_TOP_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        topLevelCategories: [action.payload?.data, ...state.topLevelCategories],
        topLCategoryCount: state.topLCategoryCount + 1,
      };
    case ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        secondLevelCategories: [
          action.payload?.data,
          ...state.secondLevelCategories,
        ],
        secondLCategoryCount: state.secondLCategoryCount + 1,
      };
    case ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        thirdLevelCategories: [
          action.payload?.data,
          ...state.thirdLevelCategories,
        ],
        thirdLCategoryCount: state.thirdLCategoryCount + 1,
      };
    case ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_SUCCESS:
      const filterTopCategories = state.topLevelCategories.filter(
        (product) => product.categoryId !== action?.payload
      );
      return {
        ...state,
        isLoading: false,
        error: null,
        topLevelCategories: filterTopCategories,
        topLCategoryCount: state.topLCategoryCount - 1,
      };

    case ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_SUCCESS:
      const filterSecondCategories = state.secondLevelCategories.filter(
        (product) => product.sectionId !== action?.payload
      );
      return {
        ...state,
        isLoading: false,
        error: null,
        secondLevelCategories: filterSecondCategories,
        secondLCategoryCount: state.secondLCategoryCount - 1,
      };
    case ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_SUCCESS:
      const filterThirdCategories = state.thirdLevelCategories.filter(
        (product) => product.itemId !== action?.payload
      );
      return {
        ...state,
        isLoading: false,
        error: null,
        thirdLevelCategories: filterThirdCategories,
        thirdLCategoryCount: state.thirdLCategoryCount - 1,
      };
    case ActionTypes.GET_ALL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        categories: action.payload,
      };
    case ActionTypes.GET_TOP_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        topLevelCategories: [
          ...state.topLevelCategories.filter(
            (existingCategory) =>
              !action.payload?.data.some(
                (newCategory: TopLevelCategories) =>
                  newCategory.categoryId === existingCategory.categoryId
              )
          ),
          ...action.payload?.data,
        ],
        topLCategoryCount: action.payload?.totalCount,
      };

    case ActionTypes.GET_SECOND_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        secondLevelCategories: action?.payload?.newData
          ? action.payload?.data
          : [
              ...state.secondLevelCategories.filter(
                (existingCategory) =>
                  !action.payload?.data.some(
                    (newCategory: SecondLevelCategories) =>
                      newCategory.sectionId === existingCategory.sectionId
                  )
              ),
              ...action.payload?.data,
            ],
        secondLCategoryCount: action.payload?.totalCount,
      };
    case ActionTypes.GET_THIRD_LEVEL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        thirdLevelCategories: action?.payload?.newData
          ? action.payload?.data
          : [
              ...state.thirdLevelCategories.filter(
                (existingCategory) =>
                  !action.payload?.data.some(
                    (newCategory: ThirdLevelCategories) =>
                      newCategory.itemId === existingCategory.itemId
                  )
              ),
              ...action.payload?.data,
            ],
        thirdLCategoryCount: action.payload?.totalCount,
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
    case ActionTypes.ADD_TOP_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_FAILURE:
    case ActionTypes.GET_ALL_CATEGORIES_FAILURE:
    case ActionTypes.GET_PRODUCTS_CAROUSEL_FAILURE:
      return { ...state, isLoading: false, error: action?.payload };
    default:
      return state;
  }
}
export default productReducer;
