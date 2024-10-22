import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  addProduct,
  findProductsById,
} from "../../../../store/customer/product/action";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import ProductFields from "./productFields";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { Link, useLocation } from "react-router-dom";
import { productInitState } from "../../utils/productUtil";
import AdminAppRoutes from "../../../../common/adminRoutes";

function EditProduct() {
  const location = useLocation();
  const productId = parseInt(location?.pathname.split("/")?.[4]);
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(productInitState);
  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: product?.title
          ? "Edit " + product.title
          : AppStrings.editProduct,
        showBackIcon: true,
      })
    );

    // fetch product details
    const timer = setTimeout(() => {
      dispatch(findProductsById(productId));
      productRes &&
        setProduct({
          thumbnail: productRes?.thumbnail?.[0],
          images: productRes?.images,
          brand: productRes.brand,
          title: productRes.productName,
          description: productRes.description,
          price: Number(productRes.price),
          quantity: productRes.quantity,
          color: productRes.color,
          size: productRes.size,
          disPercentage: Number(productRes.discountPercentage),
          disPrice: Number(productRes.discountPrice),
          topLevelCategory: productRes.categoryId,
          secondLevelCategory: productRes.sectionId,
          thirdLevelCategory: productRes.itemId,
        });
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
  }, [productRes?.productId, product?.title]);

  function handleOnChange(value: any, fieldId: string) {
    setProduct({ ...product, [fieldId]: value });
  }

  async function handleOnEditProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    // dispatch(addProduct(product));
  }

  return (
    <form onSubmit={handleOnEditProduct}>
      <Grid container spacing={2} justifyContent={"center"}>
        <ProductFields
          product={product}
          isEditProductPage={true}
          handleOnChange={handleOnChange}
        />

        <div className="flex space-x-4 mt-8 items-center">
          <Link to={AdminAppRoutes.products}>
            <Button type="submit" variant="outlined" sx={{ minWidth: "200px" }}>
              {AppStrings.cancel}
            </Button>
          </Link>

          <Button type="submit" variant="contained" sx={{ minWidth: "200px" }}>
            {isLoading ? <Loader /> : AppStrings.editProduct}
          </Button>
        </div>
      </Grid>
    </form>
  );
}

export default EditProduct;
