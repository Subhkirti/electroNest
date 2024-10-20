import { Avatar, Grid, Typography } from "@mui/material";
import InputField from "../../../../common/components/inputField";
import { productColors, productStateIds } from "../../utils/productUtil";
import { ProductReqBody } from "../../../customer/types/productTypes";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getSecondLevelCategories,
  getThirdLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";

function ProductFields({
  isViewProductPage,
  product,
  handleOnChange,
}: {
  isViewProductPage?: boolean;
  product: ProductReqBody;
  handleOnChange?: (elementValue: any, id: string) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { topLevelCategories, secondLevelCategories, thirdLevelCategories } =
    useSelector((state: RootState) => state.product);

  useEffect(() => {
    const timer = setTimeout(() => {
      (!topLevelCategories.length ||
        !secondLevelCategories?.length ||
        !thirdLevelCategories.length) &&
        loadCategories();
    }, 10);
    return () => clearTimeout(timer);
  }, [
    topLevelCategories.length,
    secondLevelCategories?.length,
    thirdLevelCategories.length,
    product.topLevelCategory,
    product.secondLevelCategory
  ]);

  function loadCategories() {
    if (!topLevelCategories.length) dispatch(getTopLevelCategories());
    if (product.topLevelCategory)
      dispatch(getSecondLevelCategories(product.topLevelCategory));
    if (product.topLevelCategory && product.secondLevelCategory)
      dispatch(getThirdLevelCategories(product.secondLevelCategory));
  }
  return (
    <>
      <Grid item xs={12} lg={6}>
        <InputField
          label={"Title"}
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
          id={productStateIds.brand}
          value={product.brand}
          onChange={handleOnChange}
          maxLength={40}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <InputField
          label={"Description"}
          readOnly={isViewProductPage}
          required={true}
          value={product.description}
          id={productStateIds.description}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        {isViewProductPage ? (
          <div className="flex border-lightpurple justify-between border rounded-md p-6">
            <div>
              <Typography className="text-white">
                Thumbnail & Product Images :
              </Typography>
              <img
                width={200}
                height={200}
                className="mt-4"
                src={product?.thumbnail?.toString()}
              />
            </div>
            {product.images?.length > 0 ? (
              <div className="flex space-x-4 items-center">
                {product.images?.map((image: string | File) => {
                  return (
                    <Avatar
                      src={image.toString()}
                      variant="rounded"
                      alt="product-images"
                      className="border border-slate-400 p-4 rounded-md"
                      sx={{ width: 100, height: 100 }}
                    />
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <InputField
            label={"Thumbnail"}
            readOnly={isViewProductPage}
            id={productStateIds.thumbnail}
            required={true}
            type="file"
            acceptFile="image/*"
            value={product?.thumbnail || ""}
            onChange={handleOnChange}
          />
        )}
      </Grid>
      <Grid item xs={12} lg={4}>
        <InputField
          label={"Price (₹)"}
          readOnly={isViewProductPage}
          required={true}
          type="number"
          id={productStateIds.price}
          value={product.price}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={6} lg={4}>
        <InputField
          readOnly={isViewProductPage}
          label={"Discount Price (₹)"}
          type="number"
          id={productStateIds.disPrice}
          value={product.disPrice}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={6} lg={4}>
        <InputField
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
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
          readOnly={isViewProductPage}
          value={product.size}
          id={productStateIds.size}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        {!isViewProductPage && (
          <InputField
            label={"Product Images"}
            id={productStateIds.images}
            required={true}
            readOnly={isViewProductPage}
            value={product?.images || ""}
            type="file"
            acceptFile="image/*"
            multiple
            onChange={handleOnChange}
          />
        )}
      </Grid>
    </>
  );
}

export default ProductFields;
