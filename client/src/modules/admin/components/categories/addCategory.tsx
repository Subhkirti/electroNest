import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useLocation } from "react-router-dom";
import {
  CategoryState,
  CategoryTypes,
} from "../../../customer/types/productTypes";
import { categoryInitState } from "../../utils/productUtil";
import { Button, Grid } from "@mui/material";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import CategoryFields from "./categoryFields";
import {
  addSecondLevelCategories,
  addThirdLevelCategories,
  addTopLevelCategories,
} from "../../../../store/customer/product/action";

function AddCategory() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<CategoryState>(categoryInitState);
  const { isLoading } = useSelector((state: RootState) => state.product);

  const categoryType =
    (location.state && location.state.categoryType) ||
    CategoryTypes.topLevelCategories;
  const isTopLCategory = categoryType === CategoryTypes.topLevelCategories;
  const isSecondLCategory =
    categoryType === CategoryTypes.secondLevelCategories;
  const isThirdLCategory = categoryType === CategoryTypes.thirdLevelCategories;

  useEffect(() => {
    // set header props
    dispatch(
      setHeader({
        title: isSecondLCategory
          ? "Add Secondary Level Category"
          : isThirdLCategory
          ? "Add Third Level Category"
          : "Add Top Level Category",
        showBackIcon: true,
      })
    );

    return () => {
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, []);

  function handleOnChange(value: any, fieldId: string) {
    setCategory({ ...category, [fieldId]: value });
  }

  async function handleOnAddCategory(e: { preventDefault: () => void }) {
    e.preventDefault();
    dispatch(
      isSecondLCategory
        ? addSecondLevelCategories(category.categoryName, category.sectionName)
        : isThirdLCategory
        ? addThirdLevelCategories(category.sectionName, category.itemName)
        : addTopLevelCategories(category.categoryName)
    );
    setCategory(categoryInitState);
  }
  return (
    <form onSubmit={handleOnAddCategory}>
      <Grid container spacing={2} justifyContent={"center"}>
        <CategoryFields
          category={category}
          isTopLCategory={isTopLCategory}
          isSecondLCategory={isSecondLCategory}
          isThirdLCategory={isThirdLCategory}
          handleOnChange={handleOnChange}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4, minWidth: "300px", position: "absolute", bottom: 20 }}
        >
          {isLoading ? <Loader /> : AppStrings.addCategory}
        </Button>
      </Grid>
    </form>
  );
}

export default AddCategory;
