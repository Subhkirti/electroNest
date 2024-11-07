import { Box, Button, Grid, Typography } from "@mui/material";
import Achievement from "./achievement";
import MonthlyOverview from "./monthlyOverview";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/storeTypes";
import { useEffect, useState } from "react";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import AppStrings from "../../../../common/appStrings";
import { getCurrentUser } from "../../../customer/utils/localStorageUtils";
import AuthModal from "../../../customer/components/auth/authModal";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const user = getCurrentUser();

  const handleClose = () => {
    setOpenAuthModal(false);
  };

  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.dashboard,
      })
    );
    return () => {
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {user ? (
        <Grid spacing={2} container>
          <Grid item xs={12} md={4}>
            <Achievement />
          </Grid>

          <Grid item xs={12} md={8}>
            <MonthlyOverview />
          </Grid>
          <Grid item xs={12} md={12}></Grid>
        </Grid>
      ) : (
        <Box className="flex flex-col justify-center items-center space-y-6">
          <Typography className="text-white font-semibold text-3xl">
            {AppStrings.welcomeToDashboard}
          </Typography>
          <Button
            className="bg-lightpurple text-white w-[140px]"
            variant="contained"
            onClick={() => setOpenAuthModal(true)}
          >
            {AppStrings.login}
          </Button>

          <AuthModal handleClose={handleClose} open={openAuthModal} />
        </Box>
      )}
    </div>
  );
}
