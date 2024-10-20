import { useDispatch } from "react-redux";
import ProductsTable from "./productsTable";
import { useEffect } from "react";
import { AppDispatch } from "../../../../store/storeTypes";
import AppStrings from "../../../../common/appStrings";
import { AddShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";

function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.products,
        showBackIcon: true,
        buttons: [
          {
            text: AppStrings.addProduct,
            icon: AddShoppingCart,
            onClick: () => navigate(AdminAppRoutes.addProduct),
          },
        ],
      })
    );
    return () => {
      dispatch(resetHeader());
    };
  }, []);

  return (
    <>
      <ProductsTable />
    </>
  );
}

export default Products;
