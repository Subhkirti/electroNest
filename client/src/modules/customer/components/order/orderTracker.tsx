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
    <>
      <p className="font-bold text-3xl pt-8 text-center">Tracking History</p>
      <Timeline>
        {orderHistory.map((history, index) => {
          const orderStatus = orderStatuses.find(
            (status: { value: string; label: string }) =>
              status.value === history.status
          );
          return (
            <TimelineItem className="mt-5 " key={index}>
              <TimelineOppositeContent className="mr-2 lg:mr-8 flex flex-col justify-center">
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
              <TimelineContent className="ml-2 py-8 lg:ml-8 flex flex-col space-y-2 lg:flex-row items-start lg:space-x-3">
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
    </>
  ) : (
    <></>
  );
}

export default OrderTracker;
