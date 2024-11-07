import { HeaderState, RootAction } from "../../storeTypes";
import ActionTypes from "./actionTypes";

const initState: HeaderState = {
  title: "",
  showBackIcon: false,
  buttons: [],
};

function headerReducer(state: HeaderState = initState, action: RootAction) {
  switch (action.type) {
    case ActionTypes.SET_HEADER:
      return { ...state, ...action.payload };

    case ActionTypes.RESET_HEADER:
      return initState;

    default:
      return state;
  }
}

export default headerReducer;
