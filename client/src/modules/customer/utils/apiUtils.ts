import { AxiosError } from "axios";
import { toast } from "react-toastify";
import store from "../../../store/store";
import { getCurrentUser } from "./localStorageUtils";
import AppStrings from "../../../common/appStrings";

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
  const user = getCurrentUser();
  const dispatch = store.dispatch;
  const axiosError = error as AxiosError<ErrorResponse>;
  const errorMessage =
    axiosError?.response?.data?.message || axiosError?.message || AppStrings.somethingWentWrong;
  toast.error(errorMessage);
  dispatch({
    type: actionType,
    payload: errorMessage,
  });
}

const token = getCurrentUser()?.token;

const headersConfig = {
  headers: {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  },
};
export { handleCatchError, headersConfig };
