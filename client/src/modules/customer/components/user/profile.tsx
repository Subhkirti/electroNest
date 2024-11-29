import React, { useEffect, useState } from "react";
import { Avatar, Button, Grid } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AppIcons from "../../../../common/appIcons";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  editUser,
  findUserById,
} from "../../../../store/customer/users/action";
import Loader from "../../../../common/components/loader";
import { getActiveAddress } from "../../../../store/customer/address/action";
import NotFound from "../../../../common/components/notFound";
import AppStrings from "../../../../common/appStrings";
import {
  editProfileInitState,
  mergeAddress,
} from "../../../admin/utils/userUtil";
import EditProfile from "./editProfile";
import { EditUserReqBody } from "../../types/userTypes";

const Profile: React.FC = () => {
  const user = getCurrentUser();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const [formData, setFormData] =
    useState<EditUserReqBody>(editProfileInitState);
  const userId = params?.userId ? Number(params?.userId) : 0;
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const { user: newUser, isLoading } = useSelector(
    (state: RootState) => state.users
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleOnChange(value: any, fieldId: string) {
    setFormData({ ...formData, [fieldId]: value });
  }

  const handleSave = () => {
    setFormData(formData);
    dispatch(editUser(userId, formData));
    handleClose();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId) {
        dispatch(findUserById(userId));
        dispatch(getActiveAddress(userId));
        if (newUser) {
          const name = newUser?.name?.split(" ");
          const userRes: EditUserReqBody = {
            email: newUser?.email || "",
            firstName: name?.[0] || "",
            lastName: name?.[1] || "",
            imageUrl: newUser?.imageUrl || "",
            mobile: newUser?.mobile || null,
            street: activeAddress?.street || "",
            city: activeAddress?.city || "",
            state: activeAddress?.state || "",
            zipCode: activeAddress?.zipCode || 0,
            landmark: activeAddress?.landmark || "",
          };
          setFormData(userRes);
        }
      }
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [newUser?.id, activeAddress?.state]);

  return isLoading ? (
    <Loader suspenseLoader={true} />
  ) : newUser ? (
    <>
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        spacing={4}
      >
        <Grid item xs={12} lg={3}>
          <Avatar
            src={
              formData?.imageUrl
                ? formData?.imageUrl.toString()
                : AppIcons.imgUserProfile
            }
            variant="rounded"
            alt={`${formData.firstName} ${formData.lastName}`}
            sx={{
              width: 300,
              height: "100%",
            }}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <div className="flex flex-col space-y-3">
            <RenderTwoColumn
              title="Name"
              value={formData.firstName + " " + formData.lastName}
            />
            <RenderTwoColumn title="Email" value={formData.email} />
            <RenderTwoColumn title="Mobile Number" value={formData.mobile} />
            <RenderTwoColumn
              title="Address"
              value={mergeAddress({
                street: formData?.street,
                city: formData?.city,
                state: formData?.state,
                zipCode: formData?.zipCode,
                landmark: formData?.landmark,
              })}
            />
            {Number(user?.id) === userId && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                color="primary"
                onClick={handleOpen}
                sx={{ textTransform: "none" }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <EditProfile
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        profileData={formData}
        onChange={handleOnChange}
      />
    </>
  ) : (
    !isLoading && (
      <NotFound message={AppStrings.userDetailsNotFound} isGoBack={true} />
    )
  );
};

function RenderTwoColumn({ title, value }: { title: string; value: any }) {
  return (
    <p className="text-lg font-semibold">
      {title}
      {": "}{" "}
      <span className="font-normal text-slate-500">{value || "N/A"}</span>
    </p>
  );
}
export default Profile;
