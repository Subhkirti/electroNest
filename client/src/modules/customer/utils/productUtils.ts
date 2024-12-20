import AppRoutes from "../../../common/appRoutes";
import { CategoryBreadcrumbs, CategoryState } from "../types/productTypes";
import { OrderStatus } from "../types/orderTypes";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import AppIcons from "../../../common/appIcons";
import { futimes } from "fs";
import { Cart } from "../types/cartTypes";

const productFilters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "yellow", label: "Yellow" },
    ],
  },
  {
    id: "price",
    name: "Price",
    options: [
      { value: "159-399", label: "₹159 to ₹399" },
      { value: "399-999", label: "₹399 to ₹999" },
      { value: "999-1999", label: "₹999 to ₹1999" },
      { value: "1999-4999", label: "₹1999 to ₹4999" },
      { value: "4999-9999", label: "₹4999 to ₹9999" },
      { value: "9999-49999", label: "₹9999 to ₹49999" },
    ],
  },
  {
    id: "discount",
    name: "Discount Range",
    options: [
      { value: "10", label: "10% and above" },
      { value: "20", label: "20% and above" },
      { value: "30", label: "30% and above" },
      { value: "40", label: "40% and above" },
      { value: "50", label: "50% and above" },
      { value: "60", label: "60% and above" },
      { value: "70", label: "70% and above" },
      { value: "80", label: "80% and above" },
    ],
  },
  {
    id: "availability",
    name: "Availability",
    singleSelection: true,
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
    ],
  },
];

const sortOptions = [
  {
    name: "Price: Low to High",
    value: "low_to_high",
  },
  {
    name: "Price: High to Low",
    value: "high_to_low",
  },
];

const orderStatuses: {
  label: string;
  value: OrderStatus;
  description: string;
  icon: any;
}[] = [
  {
    label: "Pending",
    value: OrderStatus.PENDING,
    description: "Order is created but payment is not yet confirmed",
    icon: AppIcons.imgOrderPending,
  },
  {
    label: "Placed",
    value: OrderStatus.PLACED,
    description: "Payment is confirmed.",
    icon: AppIcons.imgOrderPlaced,
  },
  {
    label: "Order Confirmed",
    value: OrderStatus.ORDER_CONFIRMED,
    description: "Order details are reviewed and approved for processing.",
    icon: AppIcons.imgOrderConfirmed,
  },
  {
    label: "Shipped",
    value: OrderStatus.SHIPPED,
    description: "Order is dispatched from the warehouse",
    icon: AppIcons.imgOrderShipped,
  },
  {
    label: "Out For Delivery",
    value: OrderStatus.OUT_FOR_DELIVERY,
    description:
      "Order is with the delivery agent and is on its way to deliver you.",
    icon: AppIcons.imgOutForDelivery,
  },
  {
    label: "Delivered",
    value: OrderStatus.DELIVERED,
    description: "Your Order has been delivered.",
    icon: AppIcons.imgOrderDelivered,
  },
  {
    label: "Cancelled",
    value: OrderStatus.CANCELLED,
    description: "You had cancelled the order before shipment",
    icon: AppIcons.imgOrderCancel,
  },
  {
    label: "Failed",
    value: OrderStatus.FAILED,
    description: "Payment processing failed, or order validation failed",
    icon: AppIcons.imgOrderFailed,
  },
  {
    label: "Refund Initiated",
    value: OrderStatus.REFUNDED_INITIATED,
    description: "You had initiated Refund requested.",
    icon: AppIcons.imgOrderRefundInit,
  },
  {
    label: "Refunded",
    value: OrderStatus.REFUNDED,
    description: "Refund is processed after cancellation or return.",
    icon: AppIcons.imgOrderRefunded,
  },
];

function loadCategoryBreadCrumbs(categories: CategoryState[], product: any) {
  const categoryBreadcrumbs: CategoryBreadcrumbs[] = [];
  if (categories?.length && product) {
    // Find the matching category
    const category = categories.find(
      (cat) => cat.categoryId === product?.categoryId
    );

    if (category) {
      categoryBreadcrumbs.push({
        category: category.categoryName || "",
        path: getCategoryPath({
          categoryId: category.categoryId || "",
          sectionId: "",
          itemId: "",
        }),
      });

      // Find the matching section
      const section = category.sections?.find(
        (sec: any) => sec.sectionId === product?.sectionId
      );

      if (section) {
        categoryBreadcrumbs.push({
          category: section.sectionName || "",
          path: getCategoryPath({
            categoryId: category.categoryId || "",
            sectionId: section.sectionId,
            itemId: "",
          }),
        });

        // Find the matching item
        const item = section.items?.find(
          (itm: any) => itm.itemId === product?.itemId
        );

        if (item) {
          categoryBreadcrumbs.push({
            category: item.itemName || "",
            path: getCategoryPath({
              categoryId: category.categoryId || "",
              sectionId: section.sectionId,
              itemId: item.itemId,
            }),
          });
        }
      }
    }
  }
  return categoryBreadcrumbs;
}

function getCheckoutStep() {
  const location = window.location;
  const querySearch = new URLSearchParams(location.search);
  const activeStep = parseInt(querySearch.get("step") || "1");
  return activeStep;
}

function getQuerySearch(param: string) {
  const querySearch = new URLSearchParams(window.location.search);
  const value = querySearch.get(param) || "";
  return value;
}

function getCategoryPath({
  categoryId,
  sectionId,
  itemId,
}: {
  categoryId: string;
  sectionId?: string;
  itemId?: string;
}) {
  if (categoryId && sectionId && itemId) {
    return `/products/${categoryId}/${sectionId}/${itemId}`;
  } else if (categoryId && sectionId) {
    return `/products/${categoryId}/${sectionId}`;
  } else if (categoryId) {
    return `/products/${categoryId}`;
  } else {
    return AppRoutes.products;
  }
}

function calculateTotalPrice(
  cart:
    | {
        totalPrice: number;
        totalDiscountPrice: number;
        totalDeliveryCharges: number;
      }
    | Cart
    | null
) {
  const totalAmount = cart
    ? (
        Number(cart?.totalPrice) -
        Number(cart?.totalDiscountPrice) +
        Number(cart?.totalDeliveryCharges)
      ).toFixed(2)
    : "0.00";
  return totalAmount;
}

export {
  productFilters,
  sortOptions,
  orderStatuses,
  loadCategoryBreadCrumbs,
  getCheckoutStep,
  getQuerySearch,
  getCategoryPath,
  calculateTotalPrice,
};
