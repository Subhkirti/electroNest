import { Grid } from "@mui/material";
import Achievement from "./achievement";
import MonthlyOverview from "./monthlyOverview";

export default function Dashboard() {
  return (
    <div >
      <Grid spacing={2} container>
        <Grid item xs={12} md={4}>
          <Achievement />
        </Grid>

        <Grid item xs={12} md={8}>
          <MonthlyOverview />
        </Grid>
        <Grid item xs={12} md={12}>
        </Grid>
      </Grid>
    </div>
  );
}


