import { Grid } from "@mui/material";
import ProductFields from "./productFields";
import { useEffect, useState } from "react";
import { findProductsById } from "../../../../store/customer/product/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import { useLocation } from "react-router-dom";

function ViewProduct() {
  const initState = {
    thumbnail: '',
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
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(initState);
  const location = useLocation();
  const productId = parseInt(location?.pathname.split("/")?.[4]);

  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
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
  }, [productRes?.productId]);

  return (
    <Grid container spacing={2} justifyContent={"center"}>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductFields isViewProductPage={true} product={product} />
      )}
    </Grid>
  );
}

export default ViewProduct;
