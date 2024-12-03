import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import ActionButton from "../../../../common/components/actionButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { Edit, Visibility } from "@mui/icons-material";
import CustomTable from "../../../../common/components/customTable";
import { TableColumn } from "../../../customer/types/userTypes";
import { Order, OrderStatus } from "../../../customer/types/orderTypes";
import {
  getOrders,
  updateOrderStatus,
} from "../../../../store/customer/order/action";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  formatAmount,
  formattedDate,
  formattedDateTime,
  formattedTime,
  textTruncate,
} from "../../utils/productUtil";
import { orderStatuses } from "../../../customer/utils/productUtils";
import InputField from "../../../../common/components/inputField";
import Loader from "../../../../common/components/loader";

const orderColumns: TableColumn<Order>[] = [
  { id: "orderId", label: "ID" },
  {
    id: "productDetails",
    label: "Image",
    render: (value: string[], row) =>
      row.productDetails ? (
        <Avatar
          src={row.productDetails.images?.[0]}
          alt={"product-image"}
          variant="rounded"
          sx={{ width: 54, height: 54 }}
        />
      ) : (
        <></>
      ),
  },
  {
    id: "productDetails",
    label: "Product Name",
    render: (value, row) =>
      row.productDetails
        ? textTruncate(row.productDetails.productName, 30)
        : "N/A",
  },
  {
    id: "status",
    label: "Status",
    render: (value, row) => {
      const orderStatus = orderStatuses.find(
        (status: { value: string; label: string }) =>
          status.value === row.status
      );
      return row.status ? (
        <div className="flex space-x-2 justify-start items-center">
          <img src={orderStatus?.icon} width={20} alt="order-status-icon" />
          <p>{orderStatus?.label}</p>
        </div>
      ) : (
        "N/A"
      );
    },
  },
  { id: "quantity", label: "Quantity" },
  {
    id: "transactionAmount",
    label: "Paid Amount",
    render: (value, row) =>
      row.transactionAmount
        ? formatAmount(row.transactionAmount * row.quantity)
        : "N/A",
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => (
      <div className="flex flx-col">
        {formattedDate(value)}
        <br />
        {formattedTime(value)}
      </div>
    ),
  },
];

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, totalCount, isLoading } = useSelector(
    (state: RootState) => state.order
  );
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | string>(
    ""
  );
  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.orders,
        showBackIcon: true,
      })
    );
    return () => {
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, []);

  const handleOpenDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOrderId(null);
    setSelectedStatus("");
  };

  const handleUpdateStatus = () => {
    if (selectedOrderId && selectedStatus) {
      dispatch(
        updateOrderStatusAndRefetch({
          orderId: selectedOrderId,
          status: selectedStatus as OrderStatus,
        })
      );
      handleCloseDialog();
    }
  };

  const handleFetchOrders = (page: number, size: number) => {
    dispatch(getOrders(page, size));
  };

  const handleActions = (order: any) => {
    return (
      <div className="flex flex-col space-y-2">
        <ActionButton
          startIcon={Edit}
          onClick={() => {
            setSelectedStatus(order.status);
            handleOpenDialog(order.orderId);
          }}
          text={"Update Status"}
        />

        <ActionButton
          startIcon={Visibility}
          onClick={() => navigate(AdminAppRoutes.viewProduct + order.productId)}
          text={"View Product"}
        />
      </div>
    );
  };

  const updateOrderStatusAndRefetch = (payload: {
    orderId: number;
    status: OrderStatus;
  }) => {
    return async (dispatch: AppDispatch) => {
      try {
        await dispatch(updateOrderStatus(payload));
        await dispatch(getOrders()); // Refetch after updating
      } catch (error) {
        console.error("Failed to update and refetch", error);
      }
    };
  };

  return (
    <>
      {isLoading && <Loader suspenseLoader={true} fixed={true} />}
      <CustomTable
        isLoading={isLoading}
        fetchData={handleFetchOrders}
        data={orders}
        totalCount={totalCount}
        columns={orderColumns}
        actions={handleActions}
      />

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        classes={{
          paper:
            "bg-purple p-10 w-full border border-opacity-40 border-lightpurple",
        }}
      >
        <DialogTitle className="text-slate-100">
          Update Order Status
        </DialogTitle>
        <DialogContent>
          <InputField
            label={"Status"}
            required={true}
            type="dropdown"
            value={selectedStatus}
            dropdownOptions={orderStatuses}
            id={"updateStatus"}
            onChange={(value) => setSelectedStatus(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Orders;
