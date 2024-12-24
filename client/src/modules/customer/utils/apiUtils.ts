import { AxiosError } from "axios";
import { toast } from "react-toastify";
import store from "../../../store/store";
import { getCurrentUser } from "./localStorageUtils";
import AppStrings from "../../../common/appStrings";
import { logout } from "../../../store/customer/auth/action";

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
  const axiosError = error as AxiosError<ErrorResponse>;
  console.log("axiosError:", axiosError);
  if (axiosError?.name === "TokenExpiredError") return dispatch(logout());

  const errorMessage =
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    AppStrings.somethingWentWrong;
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
