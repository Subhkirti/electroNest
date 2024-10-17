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

const initState = {
  imageUrl: "",
  brand: "",
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  disPercentage: null,
  disPrice: null,
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
};

function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(initState);
  const { topLevelCategories, secondLevelCategories, thirdLevelCategories } =
    useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (!topLevelCategories.length) dispatch(getTopLevelCategories());
    if (product.topLevelCategory)
      dispatch(getSecondLevelCategories(product.topLevelCategory));
    if (product.topLevelCategory && product.secondLevelCategory)
      dispatch(getThirdLevelCategories(product.secondLevelCategory));
  }, [product.topLevelCategory, product.secondLevelCategory]);

  function handleOnChange(value: string, fieldId: string) {
    setProduct({ ...product, [fieldId]: value });
  }

  function handleOnAddProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(addProduct(product));
    console.log("product:", product);
  }

  return (
    <form onSubmit={handleOnAddProduct}>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid item xs={12} lg={12}>
          <InputField
            label={"Image url"}
            id={productStateIds.imageUrl}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InputField
            label={"Brand"}
            required={true}
            id={productStateIds.brand}
            onChange={handleOnChange}
            maxLength={40}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InputField
            label={"Title"}
            required={true}
            id={productStateIds.title}
            onChange={handleOnChange}
            maxLength={70}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <InputField
            label={"Price (₹)"}
            required={true}
            type="number"
            id={productStateIds.price}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Discount Price (₹)"}
            type="number"
            id={productStateIds.disPrice}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <InputField
            label={"Discount Percentage"}
            type="number"
            id={productStateIds.disPercentage}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Top Level Category"}
            required={true}
            type="dropdown"
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
            dropdownOptions={thirdLevelCategories}
            dropdownKeys={{ labelKey: "itemName", valueKey: "itemId" }}
            id={productStateIds.thirdLevelCategory}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={12}>
          <InputField
            label={"Description"}
            required={true}
            id={productStateIds.description}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Quantity"}
            type="number"
            required={true}
            id={productStateIds.quantity}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Color"}
            required={true}
            type="dropdown"
            dropdownOptions={productColors}
            id={productStateIds.color}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <InputField
            label={"Size (w x h)"}
            required={true}
            id={productStateIds.size}
            onChange={handleOnChange}
          />
        </Grid>

        <Button type="submit" variant="contained" sx={{ mt: 4 }}>
          {AppStrings.addProduct}
        </Button>
      </Grid>
    </form>
  );
}

export default AddProduct;
