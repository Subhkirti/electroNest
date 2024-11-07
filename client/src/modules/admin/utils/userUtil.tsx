import { UserReqBody } from "../../customer/types/userTypes";

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

export { userInitState, userStateIds, userRoles };
