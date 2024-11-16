import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useEffect, useState } from "react";
import {
  getAllAddresses,
  removeAddress,
} from "../../../../store/customer/address/action";
import { Button, Grid, IconButton, Radio } from "@mui/material";
import { mergeAddress } from "../../../admin/utils/userUtil";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { Delete } from "@mui/icons-material";
import AppStrings from "../../../../common/appStrings";

function AddressCard({
  handleNext,
  isOrderSummary,
}: {
  handleNext?: () => void;
  isOrderSummary?: boolean;
}) {
  const { addresses } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();
  const user = getCurrentUser();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

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
      {!isOrderSummary && (
        <p className="text-black font-semibold text-lg">
          {AppStrings.selectDeliveryAddress}
        </p>
      )}
      {addresses.map((address, index) => {
        const isAddressSelected = selectedAddressIndex === index;
        return (
          <div
            onClick={() => setSelectedAddressIndex(index)}
            key={index}
            className={`p-4 border rounded-md ${
              isAddressSelected
                ? "bg-primary bg-opacity-10 border-primary border-opacity-30"
                : "bg-white"
            } cursor-pointer `}
          >
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Radio
                    onChange={() => setSelectedAddressIndex(index)}
                    checked={isAddressSelected}
                    value={index}
                    name="address-radio"
                    inputProps={{ "aria-label": `Select address ${index}` }}
                  />
                  <p className="font-semibold text-lg capitalize">
                    {address.firstName + " " + address.lastName}
                  </p>
                </div>
                {!isOrderSummary && (
                  <IconButton
                    title="Delete"
                    onClick={() => dispatch(removeAddress(address?.addressId))}
                  >
                    <Delete className="text-red" />
                  </IconButton>
                )}
              </div>
              <div className="px-10 space-y-2">
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
                  <p>{user?.phoneNumber}</p>
                )}

                {isAddressSelected && !isOrderSummary && (
                  <Button
                    style={{
                      marginTop: "30px",
                      height: "50px",
                      textTransform: "initial",
                      boxShadow: "none",
                    }}
                    fullWidth
                    variant="contained"
                    onClick={() => handleNext && handleNext()}
                  >
                    {AppStrings.deliverToThisAddress}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Grid>
  ) : (
    <></>
  );
}

export default AddressCard;
