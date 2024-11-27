import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  removeAddress,
  setActiveAddress,
} from "../../../../store/customer/address/action";
import { Address } from "../../types/addressTypes";
import { Button, IconButton, Radio } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { mergeAddress } from "../../../admin/utils/userUtil";
import AppStrings from "../../../../common/appStrings";

function AddressItemCard({
  onNextCallback,
  isOrderSummary = false,
  address,
}: {
  address: Address | null;
  isOrderSummary?: boolean;
  onNextCallback?: () => void;
}) {
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();
  const user = getCurrentUser();

  const isAddressSelected = isOrderSummary
    ? true
    : (activeAddress?.addressId === address?.addressId && address?.isActive) ||
      false;

  return address ? (
    <div
      onClick={() =>
        !isOrderSummary &&
        activeAddress?.addressId !== address?.addressId &&
        dispatch(setActiveAddress(address?.addressId))
      }
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
              onChange={() =>
                !isOrderSummary &&
                dispatch(setActiveAddress(address?.addressId))
              }
              checked={isAddressSelected}
              value={address.addressId}
              name="address-radio"
              inputProps={{
                "aria-label": `Select address ${address.addressId}`,
              }}
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

          {user?.mobile && user?.mobile > 0 && <p>{user?.mobile}</p>}

          {isAddressSelected && !isOrderSummary && (
            <Button
              style={{
                marginTop: "30px",
              }}
              fullWidth
              variant="contained"
              onClick={() => {
                onNextCallback && onNextCallback();
              }}
            >
              {AppStrings.deliverToThisAddress}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default AddressItemCard;
