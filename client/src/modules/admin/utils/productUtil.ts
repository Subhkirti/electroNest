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
};
