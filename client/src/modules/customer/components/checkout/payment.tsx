import { useEffect, useState } from "react";
import Loader from "../../../../common/components/loader";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { getCheckoutStep, getQuerySearch } from "../../utils/productUtils";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { verifyPayment } from "../../../../store/customer/order/action";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { toast } from "react-toastify";

function Payment() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const activeStep = getCheckoutStep();
  const [seconds, setSeconds] = useState(3);
  const dispatch = useDispatch<AppDispatch>();
  const [paymentError, setPaymentError] = useState("");
  const receiptId = getQuerySearch("receipt_id");
  const razorpayOrderId = getQuerySearch("razorpay_id");
  const { error, isLoading: razorpayLoading, Razorpay } = useRazorpay();
  const { cart } = useSelector((state: RootState) => state.cart);
  const totalAmount = cart
    ? cart.totalPrice - cart.totalDiscountPrice + cart.totalDeliveryCharges
    : 0;

  useEffect(() => {
    if (activeStep === 4) {
      const beforeUnloadHandler = (event: any) => {
        navigate(AppRoutes.home);
      };
      window.addEventListener("load", beforeUnloadHandler);

      if (paymentError) {
        if (seconds === 0) {
          navigate(AppRoutes.home);
        }
        if (seconds > 0) {
          const timer = setInterval(() => {
            setSeconds(seconds - 1);
          }, 1000);

          return () => {
            clearTimeout(timer);
            window.removeEventListener("load", beforeUnloadHandler);
          };
        }
      }
      setTimeout(() => {
        paymentDialog();
      }, 1000);
    }
  }, [paymentError, seconds]);

  const paymentDialog = () => {
    if (!razorpayOrderId || !receiptId || !totalAmount) {
      navigate(-1);
      return;
    }

    const options: RazorpayOrderOptions = {
      key: process.env.REACT_APP_RAZORPAY_API_KEY || "",
      amount: totalAmount * 100,
      currency: "INR",
      order_id: razorpayOrderId,
      name: "ElectroNest",
      description: "Test transaction by ElectroNest",
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phoneNumber?.toString(),
      },
      callback_url: "/payment-success",
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_signature: string;
        razorpay_order_id: string;
      }) => {
        await verifyPayment({
          cartId: cart?.cartId || 0,
          receiptId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          razorpayOrderId: response.razorpay_order_id,
          navigate,
          dispatch,
        });
      },
      modal: {
        ondismiss() {
          setPaymentError("Transaction Failed.");
        },
      },
      theme: {
        color: "#4f45e4",
      },
    };

    try {
      const razorpayInstance = new Razorpay(options);
      razorpayInstance && seconds > 0 && razorpayInstance.open();
    } catch (err) {
      toast.error("Server Error while creating payment link.");
    }
  };

  return (
    <div className="flex justify-center space-y-3">
      <p className="text-2xl font-bold mt-20">
        {error ? (
          "Error loading Razorpay: " + { error }
        ) : paymentError ? (
          <>
            {paymentError}
            {seconds > 0
              ? ` Redirecting to home page in ${seconds} seconds...`
              : ""}
            <Loader suspenseLoader={true} />
          </>
        ) : razorpayLoading ? (
          <>
            Loading Razorpay ...
            <Loader suspenseLoader={true} />
          </>
        ) : (
          <Loader suspenseLoader={true} />
        )}
      </p>
    </div>
  );
}

export default Payment;
