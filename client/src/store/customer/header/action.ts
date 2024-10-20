import { ActionDispatch, HeaderState } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const setHeader =
  (headerProps: HeaderState) => async (dispatch: ActionDispatch) => {
    dispatch({
      type: ActionTypes.SET_HEADER,
      payload: headerProps,
    });
  };

const resetHeader = () => async (dispatch: ActionDispatch) => {
  dispatch({
    type: ActionTypes.RESET_HEADER,
  });
};

export { setHeader, resetHeader };
