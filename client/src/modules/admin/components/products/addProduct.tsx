import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  addProduct,
  getSecondLevelCategories,
  getThirdLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import ProductFields from "./productFields";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { productInitState, productStateIds } from "../../utils/productUtil";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductReqBody>(productInitState);
  const {
    isLoading,
    newProduct: productRes,
    topLCategoryCount,
  } = useSelector((state: RootState) => state.product);

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
        setProduct(productInitState);
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, [product, productRes?.productId]);

  useEffect(() => {
    !topLCategoryCount && dispatch(getTopLevelCategories());
    if (product.topLevelCategory)
      dispatch(
        getSecondLevelCategories({
          categoryId: product.topLevelCategory,
          newData: true,
        })
      );
    if (product.secondLevelCategory)
      dispatch(
        getThirdLevelCategories({
          sectionId: product.secondLevelCategory,
          newData: true,
        })
      );
  }, [
    product.topLevelCategory,
    product.secondLevelCategory,
    topLCategoryCount,
  ]);
  console.log('product:', product)

  function handleOnChange(value: any, fieldId: string) {
    setProduct({ ...product, [fieldId]: value });
  }

  async function handleOnAddProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(
      addProduct(
        {
          ...product,
          [productStateIds.images]: (
            product.images as unknown as string
          )?.split(","),
        },
        navigate
      )
    );
    setProduct(productInitState);
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
