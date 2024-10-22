import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  deleteProduct,
  getProducts,
} from "../../../../store/customer/product/action";
import {
  formatAmount,
  formattedDateTime,
  productsHeader,
  textTruncate,
} from "../../utils/productUtil";
import ActionButton from "../../../../common/components/actionButton";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import AppColors from "../../../../common/appColors";
import { pageSizes } from "../../../../common/constants";
import { useNavigate } from "react-router-dom";
import AdminAppRoutes from "../../../../common/adminRoutes";

export default function ProductsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { products, totalCount } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(getProducts(pageNumber + 1, pageSize));
  }, [dispatch, pageNumber, pageSize]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  return (
    <Paper className="bg-purple">
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{ "td , th": { borderBottom: "0.5px solid #9f5eff" } }}
            >
              {productsHeader.map((header, index) => {
                const align =
                  index === productsHeader.length - 1 ? "center" : "left";
                return (
                  <TableCell
                    sx={{ color: AppColors.white }}
                    align={align}
                    key={index}
                  >
                    {header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.productId}
                sx={{ "td , th": { borderBottom: "0.5px solid #9f5eff57" } }}
              >
                <StyledTableCell>{product.productId}</StyledTableCell>
                <StyledTableCell>
                  <Avatar
                    src={product?.thumbnail?.[0]}
                    alt={"product-image"}
                    variant="rounded"
                    sx={{ width: 54, height: 54 }}
                  />
                </StyledTableCell>
                <StyledTableCell>{product.productName}</StyledTableCell>
                <StyledTableCell className="whitespace-pre-wrap">
                  {textTruncate(product.description, 120)}
                </StyledTableCell>
                <StyledTableCell>{product.brand}</StyledTableCell>
                <StyledTableCell className="whitespace-nowrap">
                  {formatAmount(product.price)}
                </StyledTableCell>
                <StyledTableCell>
                  {formattedDateTime(product.createdAt)}
                </StyledTableCell>
                <StyledTableCell>
                  {formattedDateTime(product.updatedAt)}
                </StyledTableCell>
                <TableCell align="center" sx={{ color: AppColors.lightWhite }}>
                  <Box className="flex items-center justify-between space-x-2">
                    <ActionButton
                      startIcon={Visibility}
                      onClick={() => {
                        navigate(
                          AdminAppRoutes.viewProduct + product?.productId
                        );
                      }}
                      text={"View"}
                    />
                    <ActionButton
                      startIcon={Edit}
                      onClick={() => {
                        navigate(
                          AdminAppRoutes.editProduct + product?.productId
                        );
                      }}
                      text={"Edit"}
                    />
                    <ActionButton
                      startIcon={Delete}
                      onClick={() => {
                        dispatch(deleteProduct(product?.productId));
                      }}
                      text={"Delete"}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={pageSizes}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: AppColors.lightWhite,
        }}
      />
    </Paper>
  );
}

function StyledTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TableCell
      align="left"
      sx={{ color: AppColors.lightWhite }}
      className={className}
    >
      {children}
    </TableCell>
  );
}
