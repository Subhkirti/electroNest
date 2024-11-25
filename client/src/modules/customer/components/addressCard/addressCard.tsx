import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useEffect } from "react";
import {
  getActiveAddress,
  getAllAddresses,
} from "../../../../store/customer/address/action";
import { Grid } from "@mui/material";
import AppStrings from "../../../../common/appStrings";
import AddressItemCard from "./addressItemCard";

function AddressCard({
  onNextCallback,
  isOrderSummary,
}: {
  onNextCallback?: () => void;
  isOrderSummary?: boolean;
}) {
  const { addresses, activeAddress } = useSelector(
    (state: RootState) => state.address
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setTimeout(() => {
      !addresses?.length && dispatch(getAllAddresses());
      !activeAddress && dispatch(getActiveAddress());
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
        return (
          <AddressItemCard
            key={index}
            address={address}
            isOrderSummary={false}
            onNextCallback={onNextCallback}
          />
        );
      })}
    </Grid>
  ) : (
    <></>
  );
}

export default AddressCard;
