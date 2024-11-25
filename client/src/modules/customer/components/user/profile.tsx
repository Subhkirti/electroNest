import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
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
import { mergeAddress } from "../../../admin/utils/userUtil";
import { UserReqBody } from "../../types/userTypes";

const Profile: React.FC = () => {
  const user = getCurrentUser();
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState<UserReqBody>({
    email: "",
    firstName: "",
    lastName: "",
    imageUrl: "",
    mobile: null,
    address: null,
  });
  const params = useParams();
  const userId = params?.userId ? Number(params?.userId) : 0;
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(userData);
  const { user: newUser, isLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData(editData);
    dispatch(editUser(userId, editData));
    handleClose();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId) {
        dispatch(findUserById(userId));
        dispatch(getActiveAddress(userId));
        if (newUser) {
          const name = newUser?.name?.split(" ");
          const userRes = {
            email: newUser?.email,
            firstName: name?.[0],
            lastName: name?.[1],
            imageUrl: newUser?.imageUrl || "",
            mobile: newUser?.mobile,
            address: activeAddress
              ? mergeAddress({
                  street: activeAddress?.street,
                  city: activeAddress?.city,
                  state: activeAddress?.state,
                  zipCode: activeAddress?.zipCode,
                  landmark: activeAddress?.landmark,
                })
              : null,
          };
          setUserData(userRes);
          setEditData(userRes);
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
              userData?.imageUrl
                ? userData?.imageUrl.toString()
                : AppIcons.imgUserProfile
            }
            variant="rounded"
            alt={`${userData.firstName} ${userData.lastName}`}
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
              value={userData.firstName + " " + userData.lastName}
            />
            <RenderTwoColumn title="Email" value={userData.email} />
            <RenderTwoColumn title="Mobile Number" value={userData.mobile} />
            <RenderTwoColumn title="Address" value={userData.address} />
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
      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editData.lastName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={editData.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={editData.imageUrl}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <NotFound message={AppStrings.userDetailsNotFound} isGoBack={true} />
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
