import { Button, Grid } from "@mui/material";
import AddressCard from "../addressCard/addressCard";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { addAddress } from "../../../../store/customer/address/action";
import { AddressReqBody } from "../../types/addressTypes";
import InputField from "../../../../common/components/inputField";
import {
  addressInitState,
  addressStateIds,
} from "../../../admin/utils/userUtil";
import AppStrings from "../../../../common/appStrings";
import AddressFields from "./addressFields";
import Loader from "../../../../common/components/loader";

function AddDeliveryAddress({
  onNextCallback,
}: {
  onNextCallback?: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<AddressReqBody>(addressInitState);
  const { isLoading, addresses } = useSelector(
    (state: RootState) => state.address
  );

  function handleOnChange(value: any, fieldId: string) {
    setFormData({ ...formData, [fieldId]: value });
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    /* to stop page reloading */
    e.preventDefault();
    dispatch(addAddress(formData));
    setFormData(addressInitState);
  }

  return (
    <Grid
      container
      justifyContent={addresses?.length ? "space-between" : "center"}
    >
      {isLoading && <Loader suspenseLoader={true} fixed={true} />}

      <AddressCard onNextCallback={onNextCallback} />

      {/* add new address section */}
      <Grid item xs={12} lg={7}>
        <div className="border rounded-md p-5 bg-white">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <AddressFields
                formData={formData}
                handleOnChange={handleOnChange}
              />
              <Grid
                item
                xs={12}
                lg={12}
                display={"flex"}
                justifyContent={"center"}
              >
                <Button
                  type="submit"
                  size="large"
                  sx={{ py: 1.5, mt: 2, boxShadow: "none" }}
                  variant="contained"
                >
                  {addresses?.length
                    ? AppStrings.addNewAddress
                    : AppStrings.addAddress}
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
