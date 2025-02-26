import React, { FC } from "react";

//Mui

import { GridFooterContainer, useGridApiContext, useGridSelector, gridPaginationModelSelector } from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';


interface PaginationPropsType {
  onRowsPerPageChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  count: number;
}
const CustomPagination: FC<PaginationPropsType> = (props) => {
  const {
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onPageChange,
    count,
  } = props
  const totalPages = Math.ceil(count / rowsPerPage)
  const isOutOfRange = page >= totalPages;

  return (
    <GridFooterContainer>
      <TablePagination
        component="div"
        sx={(theme) => ({
          "& .MuiTablePagination-toolbar": {
            [theme.breakpoints.only("xs")]: {
              flexDirection: 'column'
            }
          },
        })}
        count={count}
        page={isOutOfRange ? Math.max(0, totalPages - 1) : page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10]}
        showFirstButton
        showLastButton
        SelectProps={{
          inputProps: {
            id: 'rows-per-page-select', // Unique ID
            name: 'rows-per-page', // Name attribute
          },
        }}
        ActionsComponent={() => {
          return (
            <MuiPagination
              count={totalPages}
              page={page + 1}
              showLastButton
              showFirstButton
              boundaryCount={2}
              color='secondary'
              onChange={(_event, page) => {
                onPageChange(null, page)
              }}
              siblingCount={1}
              sx={{
                '.MuiPaginationItem-page.Mui-selected': {
                  color: 'black'
                }
              }}
            />
          )
        }}
      />
    </GridFooterContainer>
  )
}



export default CustomPagination;