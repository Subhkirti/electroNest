import { ProductReqBody } from "../../customer/types/productTypes";

const productStateIds = {
  images: "images",
  brand: "brand",
  title: "title",
  color: "color",
  size: "size",
  description: "description",
  price: "price",
  quantity: "quantity",
  disPercentage: "disPercentage",
  topLevelCategory: "topLevelCategory",
  secondLevelCategory: "secondLevelCategory",
  thirdLevelCategory: "thirdLevelCategory",
  stock: "stock",
  rating: "rating",
  reviews: "reviews",
  warrantyInfo: "warrantyInfo",
  returnPolicy: "returnPolicy",
  deliveryCharges: "deliveryCharges",
};

const categoryStateIds = {
  categoryName: "categoryName",
  sectionName: "sectionName",
  itemName: "itemName",
};

const productColors = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Premium Black", value: "premium-black" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Aloe", value: "aloe" },
  { label: "Blue", value: "blue" },
  { label: "Midnight Blue", value: "midnight-blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Orange", value: "orange" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" },
  { label: "Gray", value: "gray" },
  { label: "Brown", value: "brown" },
  { label: "Teal", value: "teal" },
  { label: "Navy", value: "navy" },
  { label: "Cyan", value: "cyan" },
  { label: "Magenta", value: "magenta" },
  { label: "Mocha Maroon", value: "mocha-maroon" },
  { label: "Sea Blue", value: "sea-blue" },


];

const productsHeader = [
  "Id",
  "Thumbnail",
  "Name",
  "Description",
  "Brand",
  "Price",
  "Created At",
  "Updated At",
  "Actions",
];

function formattedDateTime(dateString?: Date | string): string {
  const date = dateString ? new Date(dateString) : new Date();

  // Format date part
  const datePart = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  // Format time part
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} | ${timePart}`;
}

function formattedDate(dateString?: Date | string): string {
  const date = dateString ? new Date(dateString) : new Date();

  // Format date part
  const datePart = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return datePart;
}

function formattedTime(dateString?: Date | string): string {
  const date = dateString ? new Date(dateString) : new Date();

  // Format time part
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return timePart;
}

const stripHtml = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// Function to truncate text
const textTruncate = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

function formatAmount(amount: number | string) {
  return amount
    ? "₹" +
        amount.toLocaleString("en-IN", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
    : "₹0";
}
//Format the given input into string in suitable terms of 'k', 'M', etc.
function formatAmountRange(amount: number) {
  if (amount < 50000) {
    //return whatever the value it is as minimum value to represent in shorthand is 1000.
    return `₹ ${amount}`;
  }
  const ranges = [
    { divider: 1e18, suffix: "E" },
    { divider: 1e15, suffix: "P" },
    { divider: 1e12, suffix: "T" },
    { divider: 1e9, suffix: "G" },
    { divider: 1e6, suffix: "M" },
    { divider: 1e3, suffix: "k" },
  ];

  for (let i = 0; i < ranges.length; i++) {
    if (amount >= ranges[i].divider) {
      const value =
        (amount / ranges[i].divider) % 1 !== 0
          ? (amount / ranges[i].divider).toFixed(1) // Upto only a single digit of the decimal.
          : amount / ranges[i].divider;
      return value + ranges[i].suffix;
    }
  }
  return amount.toString();
}

const productInitState: ProductReqBody = {
  images: [],
  brand: "",
  title: "",
  description: "",
  price: null,
  quantity: null,
  color: null,
  size: null,
  disPercentage: null,
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
  stock: 0,
  rating: 0,
  reviews: [],
  warrantyInfo: null,
  returnPolicy: null,
  deliveryCharges: 0,
};

const categoryInitState = {
  categoryName: "",
  sectionName: "",
  itemName: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export {
  productInitState,
  categoryInitState,
  productStateIds,
  categoryStateIds,
  productColors,
  productsHeader,
  formattedDateTime,
  textTruncate,
  formatAmount,
  stripHtml,
  formatAmountRange,
  formattedDate,
  formattedTime,
};
