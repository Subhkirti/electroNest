import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../common/components/loader";
import { useLocation } from "react-router-dom";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import AppStrings from "../../../../common/appStrings";
import UserFields from "./userFields";
import { UserReqBody } from "../../../customer/types/userTypes";
import { userInitState } from "../../utils/userUtil";
import { findUserById } from "../../../../store/customer/users/action";

function ViewUser() {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<UserReqBody>(userInitState);
  const location = useLocation();
  const userId = parseInt(location?.pathname.split("/")?.[4]);
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
    dispatch(
      setHeader({
        title: userRes?.name || AppStrings.viewUserDetails,
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

  return (
    <Grid container spacing={2} justifyContent={"center"}>
      {isLoading ? <Loader /> : <UserFields isViewPage={true} user={user} />}
    </Grid>
  );
}

export default ViewUser;
