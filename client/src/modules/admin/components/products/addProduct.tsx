import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { addProduct } from "../../../../store/customer/product/action";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import ProductFields from "./productFields";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";

const initState = {
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

function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(initState);
  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: AppStrings.addProduct,
        showBackIcon: true,
      })
    );

    // set product details after submission
    const timer = setTimeout(() => {
      if (productRes && productRes.productId) {
        setProduct(initState);
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
  }, [product, productRes?.productId]);

  function handleOnChange(value: any, fieldId: string) {
    setProduct({ ...product, [fieldId]: value });
  }

  async function handleOnAddProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(addProduct(product));
  }

  return (
    <form onSubmit={handleOnAddProduct}>
      <Grid container spacing={2} justifyContent={"center"}>
        <ProductFields product={product} handleOnChange={handleOnChange} />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4, minWidth: "300px" }}
        >
          {isLoading ? <Loader /> : AppStrings.addProduct}
        </Button>
      </Grid>
    </form>
  );
}

export default AddProduct;
