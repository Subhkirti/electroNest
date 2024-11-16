import axios from "axios";
import { ActionDispatch } from "../../storeTypes";
import ActionTypes from "./actionTypes";
import ApiUrls from "../../../common/apiUrls";
import { AddressReqBody } from "../../../modules/customer/types/addressTypes";
import AppRoutes from "../../../common/appRoutes";
import {
  handleCatchError,
  headersConfig,
} from "../../../modules/customer/utils/apiUtils";
import { toast } from "react-toastify";
import {
  getCurrentUser,
  setCurrentUser,
} from "../../../modules/customer/utils/localStorageUtils";
import { addressMap } from "../../../modules/customer/mappers/userMapper";
import { User } from "../../../modules/customer/types/userTypes";

const user = getCurrentUser();
const userId = user?.id || 0;

const getAllAddresses = () => async (dispatch: ActionDispatch) => {
  dispatch({ type: ActionTypes.GET_ADDRESSES_REQUEST });
  try {
    const res = await axios.get(
      userId ? `${ApiUrls.getAddresses}id=${userId}` : ApiUrls.getCartItems,
      headersConfig
    );
    dispatch({
      type: ActionTypes.GET_ADDRESSES_SUCCESS,
      payload:
        res?.data?.data?.length > 0 ? res?.data?.data.map(addressMap) : [],
    });
  } catch (error) {
    handleCatchError({
      error,
      actionType: ActionTypes.GET_ADDRESSES_FAILURE,
    });
  }
};

const addAddress =
  (reqData: AddressReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.ADD_ADDRESS_REQUEST });

    try {
      const res = await axios.post(
        ApiUrls.addAddress,
        { ...reqData, userId },
        headersConfig
      );

      dispatch({
        type: ActionTypes.ADD_ADDRESS_SUCCESS,
        payload:
          res?.data?.data? addressMap(res?.data?.data) : [],
      });
      // set phone number in user object
      setCurrentUser({ phoneNumber: reqData.phoneNumber } as User);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.ADD_ADDRESS_FAILURE,
      });
    }
  };

const removeAddress =
  (addressId: number) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.REMOVE_ADDRESS_REQUEST });

    try {
      const res = await axios.delete(
        `${ApiUrls.deleteAddress}?id=${addressId}`,
        headersConfig
      );

      dispatch({
        type: ActionTypes.REMOVE_ADDRESS_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.REMOVE_ADDRESS_FAILURE,
      });
    }
  };

const updateAddress =
  (reqData: AddressReqBody) => async (dispatch: ActionDispatch) => {
    dispatch({ type: ActionTypes.UPDATE_ADDRESS_REQUEST });

    try {
      const res = await axios.post(ApiUrls.editAddress, reqData, headersConfig);

      dispatch({
        type: ActionTypes.UPDATE_ADDRESS_SUCCESS,
        payload:
          res?.data?.data?.length > 0 ? res?.data?.data.map(addressMap) : [],
      });
       // set phone number in user object
       setCurrentUser({ phoneNumber: reqData.phoneNumber } as User);
    } catch (error) {
      handleCatchError({
        error,
        actionType: ActionTypes.UPDATE_ADDRESS_FAILURE,
      });
    }
  };
export { getAllAddresses, removeAddress, updateAddress, addAddress };
