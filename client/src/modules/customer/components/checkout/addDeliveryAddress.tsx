import { Button, Grid, TextField } from "@mui/material";
import AddressCard from "../addressCard/addressCard";

function AddDeliveryAddress() {
  function handleSubmit(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault(); /* to stop page reloading */
    const data = new FormData(e.currentTarget);
    const formData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      address: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zipCode"),
      phoneNumber: data.get("phoneNumber"),
    };

    console.log("formData:", formData);
  }

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid
        item
        xs={12}
        lg={4.8}
        className="border bg-white rounded-md shadow-md h-[30.5rem] overflow-y-scroll"
      >
        <div className="p-7 border-b cursor-pointer ">
          <AddressCard />
          <Button sx={{ mt: 2 }} variant="contained" size="large">
            Deliver here
          </Button>
        </div>
      </Grid>

      <Grid item xs={12} lg={7}>
        <div className="border rounded-md shadow-md p-5 bg-white">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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

              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={5}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="given-city"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="State"
                  fullWidth
                  autoComplete="given-state"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zipCode"
                  name="zipCode"
                  label="Zip / Postal code"
                  fullWidth
                  autoComplete="shipping postal-code"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  autoComplete="given-phone-number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  size="large"
                  sx={{ py: 1.5, mt: 2 }}
                  variant="contained"
                >
                  Deliver Here
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default AddDeliveryAddress;
