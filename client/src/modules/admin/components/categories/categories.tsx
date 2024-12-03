import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import AppStrings from "../../../../common/appStrings";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { Delete, PostAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";
import CustomTable from "../../../../common/components/customTable";
import ActionButton from "../../../../common/components/actionButton";
import {
  deleteSecondLevelCategory,
  deleteThirdLevelCategory,
  deleteTopLevelCategory,
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
import Loader from "../../../../common/components/loader";

function Categories() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading,
    topLevelCategories,
    secondLevelCategories,
    thirdLevelCategories,
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

  const handleTopLevelActions = (row: TopLevelCategories) => {
    return (
      <>
        {/* <ActionButton
          startIcon={Edit}
          onClick={() => navigate(AdminAppRoutes.editProduct + row.categoryId)}
          text={"Edit"}
        /> */}
        <ActionButton
          startIcon={Delete}
          onClick={() => dispatch(deleteTopLevelCategory(row.categoryId))}
          text={"Delete"}
        />
      </>
    );
  };

  const handleSecondLevelActions = (row: SecondLevelCategories) => {
    return (
      <>
        {/* <ActionButton
          startIcon={Edit}
          onClick={() => navigate(AdminAppRoutes.editProduct + row.sectionId)}
          text={"Edit"}
        /> */}
        <ActionButton
          startIcon={Delete}
          onClick={() => dispatch(deleteSecondLevelCategory(row.sectionId))}
          text={"Delete"}
        />
      </>
    );
  };

  const handleThirdLevelActions = (row: ThirdLevelCategories) => {
    return (
      <>
        {/* <ActionButton
          startIcon={Edit}
          onClick={() => navigate(AdminAppRoutes.editProduct + row.itemId)}
          text={"Edit"}
        /> */}
        <ActionButton
          startIcon={Delete}
          onClick={() => dispatch(deleteThirdLevelCategory(row.itemId))}
          text={"Delete"}
        />
      </>
    );
  };

  return (
    <div>
      <SubHeader
        header={`Top Level Categories: ${topLevelCategories.length}`}
        buttonText="Add Top Level Category"
        url={AdminAppRoutes.addCategory}
        urlState={{ categoryType: CategoryTypes.topLevelCategories }}
      />
      {isLoading && <Loader fixed={true} />}
      <CustomTable
        fetchData={(page, size) => dispatch(getTopLevelCategories())}
        data={topLevelCategories}
        isLoading={isLoading}
        totalCount={topLevelCategories.length}
        columns={topLCategoryColumns}
        showPagination={false}
        actions={handleTopLevelActions}
      />

      {topLevelCategories.length > 0 && (
        <Box mt={5}>
          <SubHeader
            header={`Second Level Categories: ${secondLevelCategories.length}`}
            buttonText="Add Second Level Categories"
            url={AdminAppRoutes.addCategory}
            urlState={{ categoryType: CategoryTypes.secondLevelCategories }}
          />
          <CustomTable
            isLoading={isLoading}
            fetchData={(page, size) =>
              topLevelCategories.map((category: TopLevelCategories) => {
                return dispatch(
                  getSecondLevelCategories({ categoryId: category.categoryId })
                );
              })
            }
            showPagination={false}
            data={secondLevelCategories}
            totalCount={secondLevelCategories.length}
            columns={secondLCategoryColumns}
            actions={handleSecondLevelActions}
          />
        </Box>
      )}

      {secondLevelCategories.length > 0 && (
        <Box mt={5}>
          <SubHeader
            header={`Third Level Categories: ${thirdLevelCategories.length}`}
            buttonText="Add Third Level Categories"
            url={AdminAppRoutes.addCategory}
            urlState={{ categoryType: CategoryTypes.thirdLevelCategories }}
          />
          <CustomTable
            isLoading={isLoading}
            fetchData={(page, size) =>
              secondLevelCategories.map((category: SecondLevelCategories) => {
                return dispatch(
                  getThirdLevelCategories({ sectionId: category.sectionId })
                );
              })
            }
            showPagination={false}
            data={thirdLevelCategories}
            totalCount={thirdLevelCategories.length}
            columns={thirdLCategoryColumns}
            actions={handleThirdLevelActions}
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
    label: "Category Id",
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
    label: "Section Id",
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
