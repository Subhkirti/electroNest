import { EditUserReqBody, UserReqBody } from "../../customer/types/userTypes";

const userInitState: UserReqBody = {
  imageUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "customer",
  mobile: null,
};

const userStateIds = {
  imageUrl: "imageUrl",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
  role: "role",
  mobile: "mobile",
};
const addressStateIds = {
  firstName: "firstName",
  lastName: "lastName",
  street: "street",
  city: "city",
  state: "state",
  zipCode: "zipCode",
  landmark: "landmark",
  mobile: "mobile",
};

const addressInitState = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  zipCode: 0,
  landmark: "",
  mobile: 0,
};

const userRoles = [
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

function mergeAddress({
  street,
  city,
  state,
  zipCode,
  landmark,
}: {
  street: string;
  city: string;
  state: string;
  zipCode: number;
  landmark: string;
}) {
  return [street, landmark, city, state, zipCode]
    .filter((value) => value)
    .join(", ");
}

const editProfileInitState: EditUserReqBody = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  zipCode: 0,
  landmark: "",
  mobile: null,
  email: "",
  imageUrl: "",
};
export {
  userInitState,
  userStateIds,
  userRoles,
  addressStateIds,
  addressInitState,
  editProfileInitState,
  mergeAddress,
};
