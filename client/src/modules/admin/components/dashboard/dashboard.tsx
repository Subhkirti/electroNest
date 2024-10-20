import { Grid } from "@mui/material";
import Achievement from "./achievement";
import MonthlyOverview from "./monthlyOverview";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/storeTypes";
import { useEffect } from "react";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import AppStrings from "../../../../common/appStrings";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.dashboard,
      })
    );
    return () => {
      dispatch(resetHeader());
    };
  }, []);
  
  return (
    <div>
      <Grid spacing={2} container>
        <Grid item xs={12} md={4}>
          <Achievement />
        </Grid>

        <Grid item xs={12} md={8}>
          <MonthlyOverview />
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </div>
  );
}
