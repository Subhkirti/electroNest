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

function AddDeliveryAddress({
  onNextCallback,
}: {
  onNextCallback: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<AddressReqBody>(addressInitState);
  const { addresses } = useSelector((state: RootState) => state.address);

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
      <AddressCard onNextCallback={onNextCallback} />

      <Grid item xs={12} lg={7}>
        <div className="border rounded-md p-5 bg-white">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <InputField
                  label={"First Name"}
                  required={true}
                  id={addressStateIds.firstName}
                  value={formData?.firstName}
                  maxLength={50}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <InputField
                  label={"Last Name"}
                  id={addressStateIds.lastName}
                  value={formData?.lastName}
                  maxLength={50}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={12}>
                <InputField
                  label={"House no. / Street / Building name / Area "}
                  required={true}
                  id={addressStateIds.street}
                  value={formData?.street}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <InputField
                  label={"City"}
                  required={true}
                  id={addressStateIds.city}
                  value={formData?.city}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <InputField
                  label={"State"}
                  required={true}
                  id={addressStateIds.state}
                  value={formData?.state}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <InputField
                  label={"Zip / Postal code"}
                  required={true}
                  id={addressStateIds.zipCode}
                  value={formData?.zipCode}
                  type="number"
                  maxLength={6}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <InputField
                  label={"Phone Number"}
                  required={true}
                  id={addressStateIds.phoneNumber}
                  value={formData.phoneNumber}
                  type="number"
                  maxLength={10}
                  onChange={handleOnChange}
                />
              </Grid>

              <Grid item xs={12} lg={12}>
                <InputField
                  label={"Landmark"}
                  id={addressStateIds.landmark}
                  value={formData?.landmark}
                  onChange={handleOnChange}
                />
              </Grid>

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
