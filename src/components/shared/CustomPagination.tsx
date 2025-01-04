import React, { FC } from "react";

//Mui

import { GridFooterContainer, useGridApiContext, useGridSelector, gridPaginationModelSelector } from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';


type PaginationPropsType = {
  handleChangePage: any;
  handleChangeRowsPerPage: any;
  count: number
}

const CustomPagination: FC<PaginationPropsType> = (props) => {
  const {
    handleChangeRowsPerPage,
    handleChangePage,
    count } = props
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);

  const updatePageNumber = () => {
    let m = paginationModel.page
    if (count !== 0) {
      if (paginationModel.page >= (Math.floor(count / paginationModel.pageSize))) {
        if (Math.ceil(count / paginationModel.pageSize) == paginationModel.page) {
          m = Math.floor(count / paginationModel.pageSize) - 1
        }
      }
    }
    return m
  }

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
        page={updatePageNumber()}
        onPageChange={handleChangePage}
        rowsPerPage={paginationModel.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10]}
        showFirstButton
        showLastButton
        ActionsComponent={() => {
          return (
            <MuiPagination
              count={Math.ceil(count / paginationModel.pageSize)}
              page={updatePageNumber() + 1}
              showLastButton
              showFirstButton
              boundaryCount={2}
              color='secondary'
              onChange={handleChangePage}
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