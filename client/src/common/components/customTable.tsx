import {
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
import AppColors from "../appColors";
import NoResultsFound from "./noResultsFound";
import { pageSizes } from "../constants";
import { TableColumn } from "../../modules/customer/types/userTypes";

interface CustomTableProps<T> {
  fetchData: (page: number, size: number) => void;
  data: T[];
  isLoading: boolean;
  totalCount: number;
  showPagination?: boolean;
  columns: TableColumn<T>[];
  actions?: (row: T) => React.ReactNode;
}

export default function CustomTable<T>({
  fetchData,
  data,
  totalCount,
  isLoading,
  showPagination = true,
  columns,
  actions,
}: CustomTableProps<T>) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(pageNumber + 1, pageSize);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [pageNumber, pageSize, data?.length]);

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
        <Table aria-label="generic table">
          <TableHead>
            <TableRow
              sx={{ "td , th": { borderBottom: "0.5px solid #9f5eff" } }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id.toString()}
                  align={column.align || "left"}
                  sx={{ color: AppColors.white }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ color: AppColors.lightWhite }}>
                  {"Actions"}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.length > 0 &&
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "td , th": { borderBottom: "0.5px solid #9f5eff57" } }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id.toString()}
                      align={column.align || "left"}
                      sx={{ color: AppColors.lightWhite }}
                    >
                      {column.render
                        ? column.render(row[column.id], row)
                        : (row[column.id] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell
                      align="center"
                      sx={{ color: AppColors.lightWhite }}
                    >
                      <Box className="flex items-center justify-between space-x-2">
                        {actions(row)}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data && data?.length ? (
        showPagination ? (
          <TablePagination
            rowsPerPageOptions={pageSizes}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ color: AppColors.lightWhite, mb: 3 }}
          />
        ) : null
      ) : !isLoading ? (
        <NoResultsFound />
      ) : (
        <></>
      )}
    </Paper>
  );
}
