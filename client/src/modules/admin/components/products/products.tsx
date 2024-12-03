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
import {
  deleteProduct,
  getProducts,
} from "../../../../store/customer/product/action";
import { Avatar } from "@mui/material";
import { Delete, Edit, AddShoppingCart, Visibility } from "@mui/icons-material";
import {
  formatAmount,
  formattedDate,
  formattedDateTime,
  formattedTime,
  textTruncate,
} from "../../utils/productUtil";
import CustomTable from "../../../../common/components/customTable";
import { Product } from "../../../customer/types/productTypes";
import { TableColumn } from "../../../customer/types/userTypes";
import Loader from "../../../../common/components/loader";

const productColumns: TableColumn<Product>[] = [
  { id: "productId", label: "ID" },
  {
    id: "images",
    label: "Image",
    render: (value: string[]) => (
      <Avatar
        src={value?.[0]}
        alt={"product-image"}
        variant="rounded"
        sx={{ width: 54, height: 54 }}
      />
    ),
  },
  { id: "productName", label: "Product Name" },
  {
    id: "description",
    label: "Description",
    render: (value: string) => (
      <div dangerouslySetInnerHTML={{ __html: textTruncate(value, 100) }} />
    ),
  },
  { id: "brand", label: "Brand" },
  {
    id: "price",
    label: "Price",
    render: (value: string) => (
      <div className="whitespace-nowrap">{formatAmount(Number(value))}</div>
    ),
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value: Date) => (
      <div className="flex flx-col">
        {formattedDate(value)}
        <br />
        {formattedTime(value)}
      </div>
    ),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => (
      <div className="flex flx-col">
        {formattedDate(value)}
        <br />
        {formattedTime(value)}
      </div>
    ),
  },
];

function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, totalCount, isLoading } = useSelector(
    (state: RootState) => state.product
  );

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
    // eslint-disable-next-line
  }, []);

  const handleFetchProducts = (page: number, size: number) => {
    dispatch(getProducts(page, size));
  };

  const handleActions = (product: any) => {
    return (
      <>
        <ActionButton
          startIcon={Visibility}
          onClick={() =>
            navigate(AdminAppRoutes.viewProduct + product.productId)
          }
          text={"View"}
        />
        <ActionButton
          startIcon={Edit}
          onClick={() =>
            navigate(AdminAppRoutes.editProduct + product.productId)
          }
          text={"Edit"}
        />
        <ActionButton
          startIcon={Delete}
          onClick={() => dispatch(deleteProduct(product.productId))}
          text={"Delete"}
        />
      </>
    );
  };

  return (
    <>
      {isLoading && <Loader suspenseLoader={true} fixed={true} />}
      <CustomTable
        isLoading={isLoading}
        fetchData={handleFetchProducts}
        data={products}
        totalCount={totalCount}
        columns={productColumns}
        actions={handleActions}
      />
    </>
  );
}

export default Products;
