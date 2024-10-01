import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import AddressCard from "../addressCard/addressCard";

function DeliveryAddress() {
  return (
    <>
      <Grid container spacing={4}>
        <Grid
          xs={12}
          lg={4}
          className="border rounded-e-md shadow-md  h-[30.5rem] overflow-y-scroll"
        >
          <div className="px-5 py-7 border-b cursor-pointer">
            <AddressCard />
            <Button sx={{ mt: 2 }} variant="contained" size="large">
              Deliver here
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} lg={7}>
          <div className="border rounded-s-md shadow-md p-5">
            <form>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default DeliveryAddress;
