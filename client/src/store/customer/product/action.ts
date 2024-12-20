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
  categoriesMap,
  productMap,
  productsCarouselMap,
  secondLevelCategoriesMap,
  thirdLevelCategoriesMap,
  topLevelCategoriesMap,
} from "../../../modules/customer/mappers/productsMapper";
import { toast } from "react-toastify";
import AppStrings from "../../../common/appStrings";
import AdminAppRoutes from "../../../common/adminRoutes";
import { NavigateFunction } from "react-router-dom";

/* Categories section start here */
const getAllCategories = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_ALL_CATEGORIES_REQUEST });

  try {
    const res = await axios.get(ApiUrls.getCategories, headersConfig);

    dispatch({
      type: ActionTypes.GET_ALL_CATEGORIES_SUCCESS,
      payload:
        res?.data?.data?.length > 0 ? res?.data?.data.map(categoriesMap) : [],
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_ALL_CATEGORIES_FAILURE,
    });
  }
};

const getTopLevelCategories =
  (pageNumber?: number, pageSize?: number) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_TOP_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(
        pageNumber
          ? `${
              ApiUrls.getTopLevelCategories
            }?pageNumber=${pageNumber}&pageSize=${pageSize || 10}`
          : ApiUrls.getTopLevelCategories,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_TOP_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data:
            res?.data?.data?.length > 0
              ? res?.data?.data.map(topLevelCategoriesMap)
              : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_TOP_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const getSecondLevelCategories =
  ({
    categoryId,
    pageNumber,
    pageSize,
    newData,
  }: {
    categoryId: string;
    pageNumber?: number;
    pageSize?: number;
    newData?: boolean;
  }) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(
        pageNumber
          ? `${
              ApiUrls.getSecondLevelCategories
            }?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${
              pageSize || 10
            }`
          : `${ApiUrls.getSecondLevelCategories}?categoryId=${categoryId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data:
            res?.data?.data?.length > 0
              ? res?.data?.data.map(secondLevelCategoriesMap)
              : [],
          newData: newData,
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_SECOND_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const getThirdLevelCategories =
  ({
    sectionId,
    pageNumber,
    pageSize,
    newData,
  }: {
    sectionId: string;
    pageNumber?: number;
    pageSize?: number;
    newData?: boolean;
  }) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(
        pageNumber
          ? `${
              ApiUrls.getThirdLevelCategories
            }?sectionId=${sectionId}&pageNumber=${pageNumber}&pageSize=${
              pageSize || 10
            }`
          : `${ApiUrls.getThirdLevelCategories}?sectionId=${sectionId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data:
            res?.data?.data?.length > 0
              ? res?.data?.data.map(thirdLevelCategoriesMap)
              : [],
          newData: newData,
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_THIRD_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const addTopLevelCategories =
  (categoryName: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_TOP_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.addTopLevelCategories,
        { categoryName },
        headersConfig
      );

      dispatch({
        type: ActionTypes.ADD_TOP_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data: res?.data?.data ? topLevelCategoriesMap(res?.data?.data) : {},
        },
      });
      toast.success(AppStrings.categoryAddedSuccessfully);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_TOP_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const addSecondLevelCategories =
  (categoryName: string, sectionName: string) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.addSecondLevelCategories,
        { categoryName, sectionName },
        headersConfig
      );

      dispatch({
        type: ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data: res?.data?.data
            ? secondLevelCategoriesMap(res?.data?.data)
            : {},
        },
      });
      toast.success(AppStrings.categoryAddedSuccessfully);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_SECOND_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const addThirdLevelCategories =
  (sectionName: string, itemName: string) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.addThirdLevelCategories,
        { sectionName, itemName },
        headersConfig
      );

      dispatch({
        type: ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_SUCCESS,
        payload: {
          data: res?.data?.data ? thirdLevelCategoriesMap(res?.data?.data) : {},
        },
      });
      toast.success(AppStrings.categoryAddedSuccessfully);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_THIRD_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const deleteTopLevelCategory =
  (categoryId: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_REQUEST });
    try {
      const res = await axios.delete(
        `${ApiUrls.deleteTopLevelCategory}id=${categoryId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_SUCCESS,
        payload: categoryId,
      });

      res?.data?.message && toast.success(res?.data?.message);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.DELETE_TOP_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const deleteSecondLevelCategory =
  (sectionId: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_REQUEST });
    try {
      const res = await axios.delete(
        `${ApiUrls.deleteSecondLevelCategory}id=${sectionId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_SUCCESS,
        payload: sectionId,
      });

      res?.data?.message && toast.success(res?.data?.message);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.DELETE_SECOND_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };

const deleteThirdLevelCategory =
  (itemId: string) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_REQUEST });
    try {
      const res = await axios.delete(
        `${ApiUrls.deleteThirdLevelCategory}id=${itemId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_SUCCESS,
        payload: itemId,
      });

      res?.data?.message && toast.success(res?.data?.message);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.DELETE_THIRD_LEVEL_CATEGORIES_FAILURE,
      });
    }
  };
/* Categories section ends here */

/* Products section starts here */
const getProducts =
  (pageNumber: number, pageSize: number) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.GET_PRODUCTS_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.getProducts}pageNumber=${pageNumber}&pageSize=${
          pageSize || 10
        }`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.GET_PRODUCTS_SUCCESS,
        payload: {
          pageNumber,
          data:
            res?.data?.data?.length > 0 ? res.data.data.map(productMap) : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.GET_PRODUCTS_FAILURE,
      });
    }
  };
const findProducts =
  (reqData: ProductSearchReqBody, isViewMore?: boolean) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.FIND_PRODUCTS_REQUEST });

    try {
      const res = await axios.post(
        `${ApiUrls.findProducts}`,
        reqData,
        headersConfig
      );
      dispatch({
        type: ActionTypes.FIND_PRODUCTS_SUCCESS,
        payload: {
          isViewMore: isViewMore,
          data:
            res?.data?.data?.length > 0 ? res.data.data.map(productMap) : [],
          totalCount: res?.data?.totalCount,
        },
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCTS_FAILURE,
      });
    }
  };
const findProductsById =
  (productId: string | number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.FIND_PRODUCT_BY_ID_REQUEST });

    try {
      const res = await axios.get(
        `${ApiUrls.productDetails}id=${productId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.FIND_PRODUCT_BY_ID_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? productMap(res?.data?.data[0]) : null,
      });
      res?.data?.data?.length === 0 &&
        toast.info(
          productId
            ? `Product details not found for id ${productId}.`
            : "Product details not found."
        );
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.FIND_PRODUCT_BY_ID_FAILURE,
      });
    }
  };

const addProduct =
  (reqData: ProductReqBody, navigate: NavigateFunction) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_PRODUCT_REQUEST });

    try {
      const res = await axios.post(ApiUrls.addProduct, reqData, headersConfig);

      dispatch({
        type: ActionTypes.ADD_PRODUCT_SUCCESS,
        payload: res?.data?.data ? productMap(res?.data?.data) : {},
      });
      if (res?.data?.data) {
        toast.success("Product added successfully");
        navigate(AdminAppRoutes.products);
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_PRODUCT_FAILURE,
      });
    }
  };

const editProduct =
  (productId: number, reqData: ProductReqBody, navigate: NavigateFunction) =>
  async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.EDIT_PRODUCT_REQUEST });
    try {
      const res = await axios.post(
        `${ApiUrls.editProduct}id=${productId}`,
        reqData,
        headersConfig
      );

      dispatch({
        type: ActionTypes.EDIT_PRODUCT_SUCCESS,
        payload: {
          data: res?.data?.data ? productMap(res?.data?.data) : {},
          id: productId,
        },
      });
      if (res?.data?.data) {
        toast.success("Product details updated successfully.");
        navigate(AdminAppRoutes.products);
      }
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.EDIT_PRODUCT_FAILURE,
      });
    }
  };

const deleteProduct =
  (productId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.DELETE_PRODUCT_REQUEST });

    try {
      const res = await axios.delete(
        `${ApiUrls.deleteProduct}id=${productId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.DELETE_PRODUCT_SUCCESS,
        payload: productId,
      });
      res?.data?.data && toast.success("Product Deleted Successfully");
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.DELETE_PRODUCT_FAILURE,
      });
    }
  };
/* Products section ends here */

const uploadFile = async (filePath: File | null) => {
  try {
    const formData = new FormData();
    filePath && formData.append("filename", filePath);

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
/* Categories section start here */
const getHomeProductsCarousel = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_PRODUCTS_CAROUSEL_REQUEST });

  try {
    const res = await axios.get(ApiUrls.getProductsCarousel, headersConfig);

    dispatch({
      type: ActionTypes.GET_PRODUCTS_CAROUSEL_SUCCESS,
      payload:
        res?.data?.data?.length > 0
          ? res?.data?.data.map(productsCarouselMap)
          : [],
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_PRODUCTS_CAROUSEL_FAILURE,
    });
  }
};

export {
  getProducts,
  findProducts,
  findProductsById,
  addProduct,
  editProduct,
  deleteProduct,
  uploadFile,
  getAllCategories,
  getTopLevelCategories,
  getSecondLevelCategories,
  getThirdLevelCategories,
  addTopLevelCategories,
  addSecondLevelCategories,
  addThirdLevelCategories,
  deleteTopLevelCategory,
  deleteSecondLevelCategory,
  deleteThirdLevelCategory,
  getHomeProductsCarousel,
};
