import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { UserReqBody } from "../../../customer/types/userTypes";
import Loader from "../../../../common/components/loader";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userInitState } from "../../utils/userUtil";
import AdminAppRoutes from "../../../../common/adminRoutes";
import {
  editUser,
  findUserById,
} from "../../../../store/customer/users/action";
import { emailIdRegex, passwordRegEx } from "../../../../common/constants";
import { toast } from "react-toastify";
import UserFields from "./userFields";

function EditUser() {
  const location = useLocation();
  const userId = parseInt(location?.pathname.split("/")?.[4]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserReqBody>(userInitState);
  const { isLoading, user: userRes } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fetch user details
      dispatch(findUserById(userId));
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: userRes?.name ? "Edit " + userRes?.name : AppStrings.editUser,
        showBackIcon: true,
      })
    );

    if (!isLoading && userRes) {
      const name = userRes.name ? userRes.name?.split(" ") : ["", ""];
      setUser({
        imageUrl: userRes?.imageUrl || "",
        firstName: name[0] || "",
        lastName: name[1] || "",
        email: userRes?.email || "",
        password: userRes?.password || "",
        role: userRes?.role || "customer",
        mobile: userRes?.mobile || null,
      });
    }
    // eslint-disable-next-line
  }, [isLoading, userRes?.id]);

  function handleOnChange(value: any, fieldId: string) {
    setUser({ ...user, [fieldId]: value });
  }
  async function handleOnEditUser(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (!emailIdRegex.test(user.email)) {
      toast.error(AppStrings.emailIdError);
      return;
    } else if (user?.password && !passwordRegEx.test(user.password)) {
      toast.error(AppStrings.passwordError);
      return;
    } else {
      dispatch(editUser(userId, user, navigate));
    }
  }

  return (
    <form onSubmit={handleOnEditUser}>
      <Grid container spacing={2} justifyContent={"center"}>
        <UserFields user={user} handleOnChange={handleOnChange} />

        <div className="flex space-x-4 mt-8 items-center">
          <Link to={AdminAppRoutes.users}>
            <Button type="submit" variant="outlined" sx={{ minWidth: "200px" }}>
              {AppStrings.cancel}
            </Button>
          </Link>

          <Button type="submit" variant="contained" sx={{ minWidth: "200px" }}>
            {isLoading ? <Loader /> : AppStrings.editUser}
          </Button>
        </div>
      </Grid>
    </form>
  );
}

export default EditUser;
