import { Avatar, Grid, InputLabel, Typography } from "@mui/material";
import InputField from "../../../../common/components/inputField";
import { productColors, productStateIds } from "../../utils/productUtil";
import { ProductReqBody } from "../../../customer/types/productTypes";
import { RootState } from "../../../../store/storeTypes";
import { useSelector } from "react-redux";
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
  const { topLevelCategories, secondLevelCategories, thirdLevelCategories } =
    useSelector((state: RootState) => state.product);

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
          maxLength={120}
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
          maxLength={20}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <InputLabel className="text-white opacity-60 my-2">
          {"Description"}
        </InputLabel>
        <RichTextEditor
          readOnly={isViewProductPage}
          value={product.description}
          onChange={handleOnChange}
          id={productStateIds.description}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
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

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          readOnly={isViewProductPage}
          label={"Discount Percentage (%)"}
          type="number"
          id={productStateIds.disPercentage}
          value={product.disPercentage}
          onChange={handleOnChange}
          maxLength={2}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Net Quantity"}
          type="number"
          readOnly={isViewProductPage}
          required={true}
          value={product.quantity}
          id={productStateIds.quantity}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
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

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Stock"}
          type="number"
          readOnly={isViewProductPage}
          required={true}
          value={product.stock}
          id={productStateIds.stock}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Size in Inches (w x d x h) "}
          required={true}
          readOnly={isViewProductPage}
          value={product.size}
          id={productStateIds.size}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Warranty information"}
          readOnly={isViewProductPage}
          value={product.warrantyInfo}
          id={productStateIds.warrantyInfo}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Delivery Charges"}
          readOnly={isViewProductPage}
          type="number"
          id={productStateIds.deliveryCharges}
          value={product.deliveryCharges}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Return Policy"}
          readOnly={isViewProductPage}
          value={product.returnPolicy}
          id={productStateIds.returnPolicy}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
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

      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Second Level Category"}
          readOnly={isViewProductPage}
          type="dropdown"
          value={product.secondLevelCategory}
          dropdownOptions={secondLevelCategories}
          dropdownKeys={{ labelKey: "sectionName", valueKey: "sectionId" }}
          id={productStateIds.secondLevelCategory}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <InputField
          label={"Third Level Category"}
          type="dropdown"
          readOnly={isViewProductPage}
          value={product.thirdLevelCategory}
          dropdownOptions={thirdLevelCategories}
          dropdownKeys={{ labelKey: "itemName", valueKey: "itemId" }}
          id={productStateIds.thirdLevelCategory}
          onChange={handleOnChange}
        />
      </Grid>

      {productImages()}
    </>
  );

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
                {product.images.map((image, index) => {
                  return (
                    <div className="relative" key={index}>
                      {/* show remove icon also, if it's edit page */}
                      {isEditProductPage && (
                        <HighlightOff
                          onClick={() => {
                            if (setProduct) {
                              setProduct({
                                ...product,
                                images: (product.images as string[])?.filter(
                                  (_, i) => i !== index
                                ),
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
              required={true}
              label={"Product Images Links"}
              id={productStateIds.images}
              readOnly={isViewProductPage}
              infoText="Add multiple links by separating them comma ( , )"
              value={product?.images?.length ? product?.images : ""}
              onChange={handleOnChange}
            />
          )
        )}

        {isEditProductPage && (
          <InputField
            required={true}
            label={"Product Images Links"}
            id={productStateIds.images}
            readOnly={isViewProductPage}
            infoText="Add multiple links by separating them comma ( , )"
            value={product?.images?.length ? product?.images : ""}
            onChange={handleOnChange}
          />
        )}
      </Grid>
    );
  }
};
export default ProductFields;
