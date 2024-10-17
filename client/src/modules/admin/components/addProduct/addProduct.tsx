import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import InputField from "../../../../common/components/inputField";
import AppStrings from "../../../../common/appStrings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { productColors, productStateIds } from "../../utils/productUtil";
import {
  addProduct,
  getSecondLevelCategories,
  getThirdLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";
import { ProductReqBody } from "../../../customer/types/productTypes";
import { toast } from "react-toastify";
import Loader from "../../../../common/components/loader";

const initState = {
  thumbnail: null,
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
  const {
    topLevelCategories,
    secondLevelCategories,
    thirdLevelCategories,
    isLoading,
    product: productRes,
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    loadCategories();
    if (productRes && productRes.productId) {
      toast.success("Product added successfully");
      setProduct(initState);
    }
  }, [
    product,
    product.disPercentage,
    product.disPrice,
    product.size,
    productRes?.productId,
  ]);

  function loadCategories() {
    if (!topLevelCategories.length) dispatch(getTopLevelCategories());
    if (product.topLevelCategory)
      dispatch(getSecondLevelCategories(product.topLevelCategory));
    if (product.topLevelCategory && product.secondLevelCategory)
      dispatch(getThirdLevelCategories(product.secondLevelCategory));
  }

  function handleOnChange(value: string, fieldId: string) {
    setProduct({ ...product, [fieldId]: value });
  }

  async function handleOnAddProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(addProduct(product));
  }

  return (
    <form onSubmit={handleOnAddProduct}>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid item xs={12} lg={6}>
          <InputField
            label={"Title"}
            required={true}
            id={productStateIds.title}
            value={product.title}
            onChange={handleOnChange}
            maxLength={70}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InputField
            label={"Brand"}
            required={true}
            id={productStateIds.brand}
            value={product.brand}
            onChange={handleOnChange}
            maxLength={40}
          />
        </Grid>

        <Grid item xs={12} lg={12}>
          <InputField
            label={"Description"}
            required={true}
            value={product.description}
            id={productStateIds.description}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={12}>
          <InputField
            label={"Thumbnail"}
            id={productStateIds.thumbnail}
            required={true}
            type="file"
            acceptFile="image/*"
            value={product.thumbnail}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <InputField
            label={"Price (₹)"}
            required={true}
            type="number"
            id={productStateIds.price}
            value={product.price}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Discount Price (₹)"}
            type="number"
            id={productStateIds.disPrice}
            value={product.disPrice}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Discount Percentage (%)"}
            type="number"
            id={productStateIds.disPercentage}
            value={product.disPercentage}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Top Level Category"}
            required={true}
            type="dropdown"
            value={product.topLevelCategory}
            dropdownOptions={topLevelCategories}
            dropdownKeys={{ labelKey: "categoryName", valueKey: "categoryId" }}
            id={productStateIds.topLevelCategory}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Second Level Category"}
            required={true}
            type="dropdown"
            value={product.secondLevelCategory}
            dropdownOptions={secondLevelCategories}
            dropdownKeys={{ labelKey: "sectionName", valueKey: "sectionId" }}
            id={productStateIds.secondLevelCategory}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Third Level Category"}
            required={true}
            type="dropdown"
            value={product.thirdLevelCategory}
            dropdownOptions={thirdLevelCategories}
            dropdownKeys={{ labelKey: "itemName", valueKey: "itemId" }}
            id={productStateIds.thirdLevelCategory}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Quantity"}
            type="number"
            required={true}
            value={product.quantity}
            id={productStateIds.quantity}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Color"}
            required={true}
            type="dropdown"
            value={product.color}
            dropdownOptions={productColors}
            id={productStateIds.color}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Size in Inches (w x d x h) "}
            required={true}
            value={product.size}
            id={productStateIds.size}
            onChange={handleOnChange}
          />
        </Grid>

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
