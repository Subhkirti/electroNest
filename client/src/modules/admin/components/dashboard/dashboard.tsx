import { Grid } from "@mui/material";
import React from "react";
import Achievement from "./achievement";

function Dashboard() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Achievement />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
