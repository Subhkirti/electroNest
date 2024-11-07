import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  editProduct,
  findProductsById,
} from "../../../../store/customer/product/action";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import ProductFields from "./productFields";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { productInitState, productStateIds } from "../../utils/productUtil";
import AdminAppRoutes from "../../../../common/adminRoutes";

function EditProduct() {
  const location = useLocation();
  const productId = parseInt(location?.pathname.split("/")?.[4]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductReqBody>(productInitState);
  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fetch product details
      dispatch(findProductsById(productId));
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, [productId]);

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: productRes?.productName
          ? "Edit " + productRes.productName
          : AppStrings.editProduct,
        showBackIcon: true,
      })
    );

    if (!isLoading && productRes) {
      setProduct({
        thumbnail: productRes?.thumbnail?.[0] || "",
        images: productRes?.images || [],
        brand: productRes.brand || "",
        title: productRes.productName || "",
        description: productRes.description || "",
        price: Number(productRes.price) || 0,
        quantity: productRes.quantity || 0,
        color: productRes.color || null,
        size: productRes.size || null,
        disPercentage: Number(productRes.discountPercentage) || 0,
        disPrice: Number(productRes.discountPrice) || 0,
        topLevelCategory: productRes.categoryId || "",
        secondLevelCategory: productRes.sectionId || "",
        thirdLevelCategory: productRes.itemId || "",
      });
    }
    // eslint-disable-next-line
  }, [isLoading, productRes?.productName]);

  function handleOnChange(value: any, fieldId: string) {
    if (fieldId === productStateIds.images) {
      const previousImages = product.images || [];
      setProduct({
        ...product,
        images: [...previousImages, ...value],
      });
    } else {
      setProduct({ ...product, [fieldId]: value });
    }
  }

  async function handleOnEditProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(editProduct(productId, product, navigate));
  }

  return (
    <form onSubmit={handleOnEditProduct}>
      <Grid container spacing={2} justifyContent={"center"}>
        <ProductFields
          product={product}
          isEditProductPage={true}
          handleOnChange={handleOnChange}
          setProduct={setProduct}
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