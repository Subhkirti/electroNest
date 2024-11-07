import { useEffect } from "react";
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
import { deleteProduct } from "../../../../store/customer/product/action";
import { Avatar } from "@mui/material";
import { Delete, Edit, AddShoppingCart, Visibility, PersonAdd } from "@mui/icons-material";
import {
  formatAmount,
  formattedDateTime,
  textTruncate,
} from "../../utils/productUtil";
import CustomTable from "../../../../common/components/customTable";
import { Product } from "../../../customer/types/productTypes";
import { TableColumn, User } from "../../../customer/types/userTypes";
import { deleteUser, getAllUsers } from "../../../../store/customer/users/action";

const usersColumns: TableColumn<User>[] = [
  { id: "id", label: "User ID" },
  // {
  //   id: "thumbnail",
  //   label: "Image",
  //   render: (value: string) => (
  //     <Avatar
  //       src={value}
  //       alt={"product-image"}
  //       variant="rounded"
  //       sx={{ width: 54, height: 54 }}
  //     />
  //   ),
  // },
  { id: "name", label: "Full Name" },
  {
    id: "email",
    label: "Email address",
  },
  { id: "role", label: "Role" },
  {
    id: "mobile",
    label: "Mobile Number",
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value: Date) => formattedDateTime(value),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => formattedDateTime(value),
  },
];

function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, totalCount } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.users,
        showBackIcon: true,
        buttons: [
          {
            text: AppStrings.addUser,
            icon: PersonAdd,
            onClick: () => navigate(AdminAppRoutes.addUser),
          },
        ],
      })
    );
    return () => {
      dispatch(resetHeader());
    };
  }, []);

  const fetchUsers = (page: number, size: number) => {
    dispatch(getAllUsers(page, size));
  };

  const handleActions = (user: User) => {
    return (
      <>
        <ActionButton
          startIcon={Visibility}
          onClick={() =>
            navigate(AdminAppRoutes.viewUser + user.id)
          }
          text={"View"}
        />
        <ActionButton
          startIcon={Edit}
          onClick={() =>
            navigate(AdminAppRoutes.editUser + user.id)
          }
          text={"Edit"}
        />
        <ActionButton
          startIcon={Delete}
          onClick={() => dispatch(deleteUser(user.id))}
          text={"Delete"}
        />
      </>
    );
  };

  return (
    <CustomTable
      fetchData={fetchUsers}
      data={users}
      totalCount={totalCount}
      columns={usersColumns}
      actions={handleActions}
    />
  );
}

export default Users;
