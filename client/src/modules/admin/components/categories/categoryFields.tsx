import { Grid } from "@mui/material";
import React from "react";
import InputField from "../../../../common/components/inputField";
import { categoryStateIds } from "../../utils/productUtil";
import { CategoryState } from "../../../customer/types/productTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/storeTypes";

function CategoryFields({
  isViewProductPage,
  category,
  handleOnChange,
  isTopLCategory,
  isSecondLCategory,
  isThirdLCategory,
}: {
  isViewProductPage?: boolean;
  isTopLCategory: boolean;
  isSecondLCategory: boolean;
  isThirdLCategory: boolean;
  category: CategoryState;
  handleOnChange?: (elementValue: any, id: string) => void;
}) {
  const { topLevelCategories, secondLevelCategories } = useSelector(
    (state: RootState) => state.product
  );
  return (
    <>
      <Grid item xs={12} lg={12}>
        <InputField
          label={"Category Name"}
          readOnly={isViewProductPage}
          required={true}
          type={isThirdLCategory || isSecondLCategory ? "dropdown" : "text"}
          id={categoryStateIds.categoryName}
          dropdownOptions={topLevelCategories}
          dropdownKeys={{ labelKey: "categoryName", valueKey: "categoryId" }}
          value={category.categoryName}
          onChange={handleOnChange}
          maxLength={70}
        />
      </Grid>

      {!isTopLCategory && (
        <Grid item xs={12} lg={12}>
          <InputField
            label={"Section Name"}
            readOnly={isViewProductPage}
            required={true}
            type={isThirdLCategory ? "dropdown" : "text"}
            dropdownOptions={secondLevelCategories}
            id={categoryStateIds.sectionName}
            dropdownKeys={{ labelKey: "sectionName", valueKey: "sectionId" }}
            value={category.sectionName}
            onChange={handleOnChange}
            maxLength={70}
          />
        </Grid>
      )}
      {!isTopLCategory && !isSecondLCategory && (
        <Grid item xs={12} lg={12}>
          <InputField
            label={"Item Name"}
            required={true}
            readOnly={isViewProductPage}
            id={categoryStateIds.itemName}
            value={category.itemName}
            onChange={handleOnChange}
            maxLength={40}
          />
        </Grid>
      )}
    </>
  );
}

export default CategoryFields;
