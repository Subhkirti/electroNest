import axios from "axios";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { ActionDispatch } from "../../storeTypes";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import {
  ProductReqBody,
  ProductSearchReqBody,
} from "../../../modules/customer/types/productTypes";
import {
  productMap,
  secondLevelCategoriesMap,
  thirdLevelCategoriesMap,
  topLevelCategoriesMap,
} from "../../../modules/customer/mappers/productsMapper";
import { toast } from "react-toastify";
import AppStrings from "../../../common/appStrings";

const findProducts =
  (reqData: ProductSearchReqBody) => async (dispatch: ActionDispatch) => {
    const {
      colors,
      minPrice,
      maxPrice,
      discount,
      category,
      stock,
      sort,
      pageNumber,
      pageSize,
    } = reqData;

    dispatch({ type: ActionTypes.FIND_PRODUCTS_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.findProducts}/color=${colors}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${discount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.FIND_PRODUCTS_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCTS_FAILURE,
      });
    }
  };

const getTopLevelCategories = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_TOP_LEVEL_CATEGORIES_REQUEST });

  try {
    const res = await axios.get(ApiUrls.getTopLevelCategories, headersConfig);

    dispatch({
      type: ActionTypes.GET_TOP_LEVEL_CATEGORIES_SUCCESS,
      payload:
        res?.data?.data?.length > 0
          ? res?.data?.data.map(topLevelCategoriesMap)
          : [],
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_TOP_LEVEL_CATEGORIES_FAILURE,
    });
  }
};

const getSecondLevelCategories =
  (categoryId: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.getSecondLevelCategories}?categoryId=${categoryId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_SUCCESS,
        payload:
          res?.data?.data?.length > 0
            ? res?.data?.data.map(secondLevelCategoriesMap)
            : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const getThirdLevelCategories =
  (sectionId: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.getThirdLevelCategories}?sectionId=${sectionId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_SUCCESS,
        payload:
          res?.data?.data?.length > 0
            ? res?.data?.data.map(thirdLevelCategoriesMap)
            : [],
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const findProductsById =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.FIND_PRODUCT_BY_ID_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.findProductsById}/${productId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCT_BY_ID_FAILURE,
      });
    }
  };

const addProduct =
  (reqData: ProductReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_PRODUCT_REQUEST });

    try {
      const res = await axios.post(ApiUrls.addProduct, reqData, headersConfig);

      dispatch({
        type: ActionTypes.ADD_PRODUCT_SUCCESS,
        payload: res?.data?.data ? productMap(res?.data?.data) : {},
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_PRODUCT_FAILURE,
      });
    }
  };

const uploadFile = async (filePath: File | null) => {
  try {
    const formData = new FormData();
    filePath && formData.append("file", filePath);

    const res = await axios.post(ApiUrls.uploadFile, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || AppStrings.somethingWentWrong
    );
  }
};

export {
  findProducts,
  findProductsById,
  addProduct,
  uploadFile,
  getTopLevelCategories,
  getSecondLevelCategories,
  getThirdLevelCategories,
};
