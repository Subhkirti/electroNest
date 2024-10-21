const productStateIds = {
  thumbnail: "thumbnail",
  images: "images",
  brand: "brand",
  title: "title",
  color: "color",
  size: "size",
  description: "description",
  price: "price",
  quantity: "quantity",
  disPercentage: "disPercentage",
  disPrice: "disPrice",
  topLevelCategory: "topLevelCategory",
  secondLevelCategory: "secondLevelCategory",
  thirdLevelCategory: "thirdLevelCategory",
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
const productInitState = {
  thumbnail: "",
  images: [],
  brand: "",
  title: "",
  description: "",
  price: null,
  quantity: null,
  color: null,
  size: null,
  disPercentage: null,
  disPrice: null,
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
};

const productsHeader = [
  "Id",
  "Thumbnail",
  "Name",
  "Description",
  "Brand",
  "Price",
  "Created At",
  "Actions",
];

function formattedDateTime(dateString: Date) {
  const date = dateString ? new Date(dateString) : new Date();
  const readableDate = date.toLocaleString(); // format sample, "10/17/2024, 3:57:31 PM"
  return readableDate;
}

function textTruncate(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
}

function formatAmount(amount: Float32Array | string) {
  return (
    "₹ " +
    Number(amount).toLocaleString("en-IN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}


export {
  productInitState,
  productStateIds,
  productColors,
  productsHeader,
  formattedDateTime,
  textTruncate,
  formatAmount,
};
