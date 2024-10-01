import { Grid } from "@mui/material";
import React from "react";
import OrderFilter from "./orderFilter";
import OrderCard from "./orderCard";

function Order() {
  return (
    <Grid container justifyContent={"space-between"}>
      <Grid item xs={2.5}>
        <OrderFilter />
      </Grid>
      <Grid item xs={9}>
        <div className="space-y-5">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </Grid>
    </Grid>
  );
}

export default Order;
