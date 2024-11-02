import { Avatar, Grid, InputLabel, Typography } from "@mui/material";
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
import { HighlightOff } from "@mui/icons-material";
import RichTextEditor from "../../../../common/components/richTextEditor";

const ProductFields = ({
  isViewProductPage,
  isEditProductPage,
  product,
  handleOnChange,
  setProduct,
}: {
  isViewProductPage?: boolean;
  isEditProductPage?: boolean;
  product: ProductReqBody;
  setProduct?: (value: any) => void;
  handleOnChange?: (elementValue: any, id: string) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { topLevelCategories, secondLevelCategories, thirdLevelCategories } =
    useSelector((state: RootState) => state.product);
  const thumbnailImg = product?.thumbnail;

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 10);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [
    topLevelCategories?.length,
    secondLevelCategories?.length,
    thirdLevelCategories?.length,
    product.topLevelCategory,
    product.secondLevelCategory,
    product.thirdLevelCategory,
  ]);

  function loadCategories() {
    if (!topLevelCategories.length) dispatch(getTopLevelCategories());
    if (product.topLevelCategory && !secondLevelCategories.length)
      dispatch(getSecondLevelCategories(product.topLevelCategory));
    if (product.secondLevelCategory && !thirdLevelCategories.length)
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
        <InputLabel className="text-white opacity-60 my-2">
          {"Description"}
        </InputLabel>
        <RichTextEditor
          value={product.description}
          onChange={handleOnChange}
          id={productStateIds.description}
        />
      </Grid>

      {thumbnail()}

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

      {productImages()}
    </>
  );

  function thumbnail() {
    return (
      <Grid item xs={12} lg={12}>
        {isViewProductPage || (isEditProductPage && thumbnailImg) ? (
          <div className="flex border-lightpurple justify-between border rounded-md p-6">
            <div>
              <Typography className="text-white">Thumbnail:</Typography>
              <div className="relative">
                {isEditProductPage && (
                  <HighlightOff
                    onClick={() =>
                      setProduct && setProduct({ ...product, thumbnail: "" })
                    }
                    className="text-slate-300 z-10  absolute top-[-10px] right-[-10px] cursor-pointer"
                  />
                )}
                <img
                  width={200}
                  height={200}
                  className="mt-4"
                  alt="thumbnail"
                  src={thumbnailImg?.toString()}
                />
              </div>
            </div>
          </div>
        ) : (
          <InputField
            label={"Thumbnail"}
            readOnly={isViewProductPage}
            id={productStateIds.thumbnail}
            type="file"
            acceptFile="image/*"
            value={thumbnailImg || ""}
            onChange={handleOnChange}
          />
        )}
      </Grid>
    );
  }

  function productImages() {
    return (
      <Grid item xs={12} lg={12}>
        {isViewProductPage || (isEditProductPage && product.images?.length) ? (
          product.images?.length > 0 ? (
            <div className="flex flex-col space-y-4">
              <Typography className="text-white">
                Product Images ({product.images?.length}):
              </Typography>
              <div className="flex p-4 space-x-4 items-center w-100 overflow-x-scroll">
                {product.images.map((image: string | File, index) => {
                  return (
                    <div className="relative" key={index}>
                      {/* show remove icon also, if it's edit page */}
                      {isEditProductPage && (
                        <HighlightOff
                          onClick={() => {
                            if (setProduct) {
                              setProduct({
                                ...product,
                                images: (
                                  product.images as (File | string)[]
                                )?.filter((_, i) => i !== index),
                              });
                            }
                          }}
                          className="text-slate-300 z-10 absolute top-[-10px] right-[-10px] cursor-pointer"
                        />
                      )}
                      <Avatar
                        key={index}
                        src={image?.toString()}
                        variant="rounded"
                        alt="Product-images"
                        className="border border-lightpurple p-4 rounded-md"
                        sx={{ width: 100, height: 100 }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null
        ) : (
          !isEditProductPage && (
            <InputField
              label={"Product Images"}
              id={productStateIds.images}
              readOnly={isViewProductPage}
              value={product?.images || ""}
              type="file"
              acceptFile="image/*"
              multiple
              onChange={handleOnChange}
            />
          )
        )}

        {isEditProductPage && (
          <InputField
            label={"Product Images"}
            id={productStateIds.images}
            required={product.images?.length ? false : true}
            value={product?.images || ""}
            type="file"
            acceptFile="image/*"
            multiple
            onChange={handleOnChange}
          />
        )}
      </Grid>
    );
  }
};
export default ProductFields;
