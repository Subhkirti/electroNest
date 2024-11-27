import { Address } from "../../../modules/customer/types/addressTypes";
import { AddressState, AuthState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: AddressState = {
  addresses: [],
  address: null,
  activeAddress: null,
  isLoading: false,
  error: null,
};

function addressReducer(
  state: AddressState = initState,
  action: RootAction
): AddressState {
  switch (action.type) {
    case ActionTypes.ADD_ADDRESS_REQUEST:
    case ActionTypes.UPDATE_ADDRESS_REQUEST:
    case ActionTypes.GET_ADDRESSES_REQUEST:
    case ActionTypes.REMOVE_ADDRESS_REQUEST:
    case ActionTypes.REMOVE_ADDRESS_REQUEST:
    case ActionTypes.SET_ACTIVE_ADDRESS_REQUEST:
    case ActionTypes.GET_ACTIVE_ADDRESS_REQUEST:
    case ActionTypes.GET_ADDRESS_BY_ID_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ActionTypes.ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        address: action?.payload || state.address,
        addresses: action?.payload
          ? [...state.addresses, action?.payload]
          : state.addresses,
      };
    case ActionTypes.GET_ADDRESSES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        addresses:
          action?.payload?.length > 0
            ? [...state.addresses, ...action?.payload]
            : state.addresses,
      };
    case ActionTypes.GET_ADDRESS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        address: action.payload,
      };
    case ActionTypes.UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        addresses: state.addresses.map((address) =>
          address?.addressId === Number(action.payload.id)
            ? action.payload.data
            : address
        ),
        address: action?.payload?.data,
      };
    case ActionTypes.SET_ACTIVE_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        addresses: state.addresses.map((item: Address) => ({
          ...item,
          isActive: item.addressId === Number(action.payload),
        })),
        activeAddress:
          state.addresses.find(
            (item: Address) => item.addressId === Number(action.payload)
          ) || null,
      };
    case ActionTypes.GET_ACTIVE_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        activeAddress: action.payload,
      };
    case ActionTypes.REMOVE_ADDRESS_SUCCESS:
      const newState = {
        ...state,
        isLoading: false,
        error: null,
        addresses: state.addresses.filter(
          (item: Address) => item?.addressId !== Number(action?.payload)
        ),
      };
      return newState;
    case ActionTypes.ADD_ADDRESS_FAILURE:
    case ActionTypes.UPDATE_ADDRESS_FAILURE:
    case ActionTypes.GET_ADDRESSES_FAILURE:
    case ActionTypes.REMOVE_ADDRESS_FAILURE:
    case ActionTypes.SET_ACTIVE_ADDRESS_FAILURE:
    case ActionTypes.GET_ACTIVE_ADDRESS_FAILURE:
    case ActionTypes.GET_ACTIVE_ADDRESS_FAILURE:
      return { ...state, isLoading: false, error: action?.payload || null };

    default:
      return state;
  }
}
export default addressReducer;
