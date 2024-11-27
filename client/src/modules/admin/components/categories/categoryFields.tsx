import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import InputField from "../../../../common/components/inputField";
import { categoryStateIds } from "../../utils/productUtil";
import { CategoryState } from "../../../customer/types/productTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  getSecondLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";

function CategoryFields({
  category,
  handleOnChange,
  isTopLCategory,
  isSecondLCategory,
  isThirdLCategory,
}: {
  isTopLCategory: boolean;
  isSecondLCategory: boolean;
  isThirdLCategory: boolean;
  category: CategoryState;
  handleOnChange?: (elementValue: any, id: string) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { topLevelCategories, secondLevelCategories } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      !topLevelCategories.length && dispatch(getTopLevelCategories());
      !secondLevelCategories.length &&
        dispatch(
          getSecondLevelCategories({ categoryId: category.categoryName })
        );
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [category.categoryName]);

  return (
    <>
      <Grid item xs={12} lg={12}>
        <InputField
          label={"Category Name"}
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
            required={true}
            type={isThirdLCategory ? "dropdown" : "text"}
            readOnly={isThirdLCategory && !category.categoryName ? true : false}
            dropdownOptions={secondLevelCategories}
            infoText={
              isThirdLCategory && !category.categoryName
                ? "Please select category name"
                : ""
            }
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
            infoText={
              isThirdLCategory && !category.sectionName
                ? !category.categoryName
                  ? "Please select category name"
                  : "Please select section name"
                : ""
            }
            readOnly={
              isThirdLCategory &&
              (!category.categoryName || !category.sectionName)
                ? true
                : false
            }
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
