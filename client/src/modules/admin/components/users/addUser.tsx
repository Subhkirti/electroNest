import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid } from "@mui/material";
import Loader from "../../../../common/components/loader";
import { UserReqBody } from "../../../customer/types/userTypes";
import { userInitState } from "../../utils/userUtil";
import UserFields from "./userFields";
import { toast } from "react-toastify";
import { emailIdRegex, passwordRegEx } from "../../../../common/constants";
import { addUser } from "../../../../store/customer/users/action";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";

function AddUser() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserReqBody>(userInitState);
  const { isLoading, newUser: userRes } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: AppStrings.addUser,
        showBackIcon: true,
      })
    );

    // set product details after submission
    const timer = setTimeout(() => {
      if (userRes && userRes?.id) {
        setUser(userInitState);
        navigate(AdminAppRoutes.users);
      }
    }, 10);
    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, [userRes?.id]);

  function handleOnChange(value: any, fieldId: string) {
    setUser({ ...user, [fieldId]: value });
  }

  async function handleOnAddUser(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (!emailIdRegex.test(user.email)) {
      toast.error(AppStrings.emailIdError);
      return;
    } else if (user?.password && !passwordRegEx.test(user.password)) {
      toast.error(AppStrings.passwordError);
      return;
    } else {
      dispatch(addUser(user));
    }
  }
  return (
    <form onSubmit={handleOnAddUser}>
      <Grid container spacing={2} justifyContent={"center"}>
        <UserFields user={user} handleOnChange={handleOnChange} />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4, minWidth: "300px" }}
        >
          {isLoading ? <Loader /> : AppStrings.addUser}
        </Button>
      </Grid>
    </form>
  );
}

export default AddUser;
