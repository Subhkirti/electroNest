import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useEffect } from "react";
import {
  getAllAddresses,
  removeAddress,
} from "../../../../store/customer/address/action";
import { Button, Grid, IconButton } from "@mui/material";
import { mergeAddress } from "../../../admin/utils/userUtil";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { Delete } from "@mui/icons-material";

function AddressCard() {
  const { addresses } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();
  const user = getCurrentUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      !addresses?.length && dispatch(getAllAddresses());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, []);

  return addresses?.length > 0 ? (
    <Grid item xs={12} lg={4.8} className=" bg-white space-y-3  mb-20">
      {addresses.map((address, index) => {
        return (
          <div
            key={index}
            className="p-7 border rounded-md hover:bg-blue-100 cursor-pointer "
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {address.firstName + " " + address.lastName}
                </p>
                <IconButton
                  title="Delete"
                  onClick={() => dispatch(removeAddress(address?.addressId))}
                >
                  <Delete className="text-red" />
                </IconButton>
              </div>
              <p>
                {mergeAddress({
                  street: address.street,
                  city: address.city,
                  state: address.state,
                  zipCode: address.zipCode,
                  landmark: address.landmark,
                })}
              </p>

              {user?.phoneNumber && user?.phoneNumber > 0 && (
                <div className="space-y-1">
                  <p className="font-semibold">Phone Number</p>
                  <p> {user?.phoneNumber}</p>
                </div>
              )}
            </div>
            <Button sx={{ mt: 2 }} variant="contained" size="large">
              Deliver here
            </Button>
          </div>
        );
      })}
    </Grid>
  ) : (
    <></>
  );
}

export default AddressCard;
