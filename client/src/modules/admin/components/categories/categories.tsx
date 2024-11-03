import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import AppStrings from "../../../../common/appStrings";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { Delete, Edit, PostAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";
import CustomTable from "../../../../common/components/customTable";
import ActionButton from "../../../../common/components/actionButton";
import {
  getSecondLevelCategories,
  getThirdLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";
import {
  CategoryTypes,
  SecondLevelCategories,
  ThirdLevelCategories,
  TopLevelCategories,
} from "../../../customer/types/productTypes";
import { TableColumn } from "../../../customer/types/userTypes";
import { formattedDateTime } from "../../utils/productUtil";
import { Box, Button } from "@mui/material";

function Categories() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    topLevelCategories,
    topLCategoryCount,
    secondLevelCategories,
    secondLCategoryCount,
    thirdLevelCategories,
    thirdLCategoryCount,
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(
      setHeader({
        title: AppStrings.categories,
        showBackIcon: true,
      })
    );
    return () => {
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, []);

  const handleActions = (product: any) => {
    return (
      <>
        <ActionButton
          startIcon={Edit}
          onClick={() =>
            navigate(AdminAppRoutes.editProduct + product.productId)
          }
          text={"Edit"}
        />
        <ActionButton startIcon={Delete} onClick={() => {}} text={"Delete"} />
      </>
    );
  };

  return (
    <div>
      <SubHeader
        header="Top Level Categories"
        buttonText="Add Top Level Category"
        url={AdminAppRoutes.addCategory}
        urlState={{ categoryType: CategoryTypes.topLevelCategories }}
      />

      <CustomTable
        fetchData={(page, size) => dispatch(getTopLevelCategories())}
        data={topLevelCategories}
        totalCount={topLCategoryCount}
        columns={topLCategoryColumns}
        showPagination={false}
        actions={handleActions}
      />

      {topLevelCategories.length && (
        <Box mt={5}>
          <SubHeader
            header="Second Level Categories"
            buttonText="Add Second Level Categories"
            url={AdminAppRoutes.addCategory}
            urlState={{ categoryType: CategoryTypes.secondLevelCategories }}
          />
          <CustomTable
            fetchData={(page, size) =>
              topLevelCategories.map((category: TopLevelCategories) => {
                dispatch(getSecondLevelCategories(category.categoryId));
              })
            }
            showPagination={false}
            data={secondLevelCategories}
            totalCount={secondLCategoryCount}
            columns={secondLCategoryColumns}
            actions={handleActions}
          />
        </Box>
      )}

      {secondLevelCategories.length && (
        <Box mt={5}>
          <SubHeader
            header="Third Level Categories"
            buttonText="Add Third Level Categories"
            url={AdminAppRoutes.addCategory}
            urlState={{ categoryType: CategoryTypes.thirdLevelCategories }}
          />
          <CustomTable
            fetchData={(page, size) =>
              secondLevelCategories.map((category: SecondLevelCategories) => {
                console.log("category:", category);
                dispatch(getThirdLevelCategories(category.sectionId));
              })
            }
            showPagination={false}
            data={thirdLevelCategories}
            totalCount={thirdLCategoryCount}
            columns={thirdLCategoryColumns}
            actions={handleActions}
          />
        </Box>
      )}
    </div>
  );
}

function SubHeader({
  header,
  buttonText,
  url,
  urlState,
}: {
  header: string;
  buttonText: string;
  url: string;
  urlState: Object;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between space-x-4 mb-4">
      <p className="text-2xl text-primary font-semibold">{header}</p>
      <Button
        variant="contained"
        onClick={() => navigate(url, { state: urlState })}
        className="text-white bg-lightpurple border border-white rounded-lg"
        startIcon={<PostAdd />}
      >
        {buttonText}
      </Button>
    </div>
  );
}

const topLCategoryColumns: TableColumn<TopLevelCategories>[] = [
  {
    id: "categoryId",
    label: "Id",
  },
  {
    id: "categoryName",
    label: "Name",
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value: Date) => formattedDateTime(value),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => formattedDateTime(value),
  },
];

const secondLCategoryColumns: TableColumn<SecondLevelCategories>[] = [
  {
    id: "sectionId",
    label: "Id",
  },
  {
    id: "sectionName",
    label: "Name",
  },
  {
    id: "categoryId",
    label: "Parent Category Id",
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value: Date) => formattedDateTime(value),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => formattedDateTime(value),
  },
];

const thirdLCategoryColumns: TableColumn<ThirdLevelCategories>[] = [
  {
    id: "itemId",
    label: "Id",
  },
  {
    id: "itemName",
    label: "Name",
  },
  {
    id: "sectionId",
    label: "Parent Category Id",
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (value: Date) => formattedDateTime(value),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    render: (value: Date) => formattedDateTime(value),
  },
];
export default Categories;
