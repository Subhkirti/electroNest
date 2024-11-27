import { useSelector } from "react-redux";
import { RootState } from "../../../../store/storeTypes";
import { Grid } from "@mui/material";
import {
  formattedDate,
  formattedDateTime,
  formattedTime,
} from "../../../admin/utils/productUtil";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { orderStatuses } from "../../utils/productUtils";
import AppColors from "../../../../common/appColors";

function OrderTracker() {
  const { orderHistory, order } = useSelector(
    (state: RootState) => state.order
  );

  return orderHistory?.length > 0 ? (
    <div className="w-full">
      <p className="font-semibold text-lg py-3">Tracking History</p>
      <Timeline>
        {orderHistory.map((history, index) => {
          const orderStatus = orderStatuses.find(
            (status: { value: string; label: string }) =>
              status.value === history.status
          );
          return (
            <TimelineItem className="mt-3" key={index}>
              <TimelineOppositeContent className="mr-10 flex flex-col justify-center">
                <p className="text-md font-medium capitalize">
                  {formattedDate(history.updatedAt)}
                </p>
                <p className="text-sm opacity-70 font-normal">
                  {formattedTime(history.updatedAt)}
                </p>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor:
                      order?.status === history.status
                        ? AppColors.secondary
                        : "grey",
                  }}
                />
                <TimelineConnector
                  sx={{
                    bgcolor:
                      order?.status === history.status
                        ? AppColors.secondary
                        : "grey",
                  }}
                />
              </TimelineSeparator>
              <TimelineContent className="ml-10 flex items-center space-x-3">
                <img
                  src={orderStatus?.icon}
                  width={50}
                  alt="order-status-icon"
                />
                <div>
                  <p className="text-md font-medium capitalize">
                    {orderStatus?.label}
                  </p>
                  <p className="text-sm opacity-70 font-normal">
                    {orderStatus?.description}
                  </p>
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  ) : (
    <></>
  );
}

export default OrderTracker;
