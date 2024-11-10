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
};

const categoryStateIds = {
  categoryName: "categoryName",
  sectionName: "sectionName",
  itemName: "itemName",
};

const productColors = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
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

function formattedDateTime(dateString: Date) {
  const date = dateString ? new Date(dateString) : new Date();
  const readableDate = date.toLocaleString(); // format sample, "10/17/2024, 3:57:31 PM"
  return readableDate;
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

function formatAmount(amount: number) {
  return (
    "₹ " +
    amount.toLocaleString("en-IN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
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
};
