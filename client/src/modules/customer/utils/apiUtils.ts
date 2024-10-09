import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Action } from "redux";
import { RootAction } from "../../../store/storeTypes";
import store from "../../../store/store";

interface ErrorResponse {
  message: string;
}

function handleCatchError({
  error,
  actionType,
}: {
  error: unknown;
  actionType: string;
}) {
  const dispatch = store.dispatch;
  console.log('store:', store)
  const axiosError = error as AxiosError<ErrorResponse>;
  const errorMessage =
    axiosError?.response?.data?.message || "An error occurred";
  toast.error(errorMessage);
  dispatch({
    type: actionType,
    payload: errorMessage,
  });
}

export { handleCatchError };
