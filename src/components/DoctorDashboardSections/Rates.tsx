/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import React, { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ReviewTypes } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { toast } from 'react-toastify';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridFilterModel, GridRenderCellParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from './ScheduleTiming';
import Rating from '@mui/material/Rating';

import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import RenderExpandableCell from '../shared/RenderExpandableCell';
import { useTheme } from '@mui/material/styles';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';


const Rates: FC = () => {
  const { bounce } = useScssVar();
  dayjs.extend(relativeTime);
  const dataGridRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const theme = useTheme();
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [rowsCount, setRowsCount] = useState<number>(0)

  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const perPage = 5;
  const [rows, setRows] = useState<ReviewTypes[] | []>([])

  const [paginationModel, setPaginationModel] = useState({
    pageSize: perPage,
    page: 0,
  });

  const [sortModel, setSortModel] = useState<any>([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const [mongoFilterModel, setMongoFilterModel] = useState<DataGridMongoDBQuery>({});
  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter: (params: GridRenderCellParams) => {
          return params?.row?.id
        },
      },
      {
        field: 'role',
        headerName: "Role",
        width: 100,
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridValueGetterParams) {
          const { value } = params
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      },
      {
        field: 'authorProfile.fullName',
        headerName: `Author`,
        width: 250,
        headerAlign: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.authorProfile?.fullName
        },
        sortComparator: (v1: any, v2: any) => v1.toLowerCase() > v2.toLowerCase() ? 1 : -1,
        renderCell: (data: any) => {
          const { row } = data;
          const roleName = row?.authorProfile?.roleName;
          const authorName =
            `${roleName == "doctors" ?
              "Dr. " : `${row?.authorProfile.gender !== "" ?
                `${row?.authorProfile.gender}. ` : ""}`}${row?.authorProfile?.fullName}`
          return (
            <>
              <Link aria-label='profile' className=" mx-2" href={
                roleName == "doctors" ?
                  `/doctors/profile/${btoa(row?.authorId)}` :
                  `/doctors/dashboard/patient-profile/${btoa(row?.authorId)}`} >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={row?.authorProfile?.online}
                  idle={row?.authorProfile?.lastLogin?.idle}
                >
                  <Avatar alt="" src={`${row?.authorProfile?.profileImage}`} >
                    <img src={roleName == "doctors" ? doctors_profile : patient_profile} alt="" className="avatar" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Stack >
                <Link aria-label='profile' href={
                  roleName == "doctors" ?
                    `/doctors/profile/${btoa(row?.authorId)}` :
                    `/doctors/dashboard/patient-profile/${btoa(row?.authorId)}`}
                  style={{ color: theme.palette.secondary.main, }}>
                  {authorName}
                </Link>
                <small> {row?.authorProfile?.userName}</small>
              </Stack>
            </>
          )
        },
      },
      {
        field: 'rating',
        headerName: "Rating",
        width: 150,
        headerAlign: 'center',
        type: "number",
        align: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Rating
              name="read-only"
              precision={0.5}
              value={row?.rating}
              readOnly
              size='small' />
          )
        }
      },
      {
        field: 'recommend',
        headerName: "Recommend",
        width: 150,
        headerAlign: 'center',
        type: "boolean",
        align: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().boolean,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <>
              {row?.recommend ?
                <p className="recommended">
                  <i className="far fa-thumbs-up" /> Recommend
                </p> :
                <p className="not-recommended">
                  <i className="far fa-thumbs-down" /> Not Recommend
                </p>
              }
            </>
          )
        }
      },
      {
        field: 'title',
        headerName: `Title`,
        align: 'center',
        width: 200,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <RenderExpandableCell {...params} />
            </>
          )
        }
      },
      {
        field: 'body',
        headerName: "Message",
        align: 'center',
        width: 200,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <RenderExpandableCell {...params} />
            </>
          )
        }
      },
      {
        field: 'replies',
        headerName: "Replies",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: false,
        valueGetter: (params) => {
          const replies = params?.row?.replies;
          return replies.length;
        },
        sortComparator: (v1: any, v2: any) => {
          return v1 > v2 ? -1 : 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { replies: value } = params?.row;
          const tooltipText = value.map((obj: any) => {
            // Map over each key-value pair in the object
            const formattedEntries = Object.entries(obj)
              .filter(([key, _]) => key == "title" || key == 'body')
              .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`)
              .join("\n"); // Join each key-value pair with a newline

            // Add a separator after each object
            return `${formattedEntries}\n------------------------------------`;
          }).join("\n\n"); // Separate each object's result with double newlines

          return (
            <>
              {value &&
                value.length > 0 ?
                <>
                  <Tooltip arrow title={tooltipText} followCursor>
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {`${value.length} Replies ${value.length <= 1 ? '' : "s"}`}
                    </span>
                  </Tooltip>
                </> :
                <>
                  <span style={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                    ===
                  </span></>
              }
            </>
          )
        },
      },
      {
        field: 'createdAt',
        headerName: "Wrote",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'date',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.createdAt ? dayjs(row.createdAt).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row?.createdAt).fromNow()}</span>
            </>
          )
        }
      },
      {
        field: 'updatedAt',
        headerName: "Updated",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'date',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.updatedAt ? dayjs(row.updatedAt).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row?.updatedAt).fromNow()}</span>
            </>
          )
        }
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userProfile) {
      if (homeSocket?.current) {
        homeSocket.current.emit('getDoctorRates',
          {
            doctorId: userProfile?._id,
            paginationModel,
            sortModel,
            mongoFilterModel,
          })
        homeSocket.current.once('getDoctorRatesReturn', (msg: {
          status: number,
          doctorReviews: ReviewTypes[],
          totalReviews: number,
          message?: string,
          reason?: string
        }) => {
          if (msg?.status !== 200) {
            toast.error(msg?.reason || 'getDoctorRates error', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              toastId: "rates-toast",
              transition: bounce,
              onClose: () => {
                setIsLoading(false);
                toast.dismiss('rates-toast')
              }
            });
          } else if (msg?.status == 200) {
            const { doctorReviews, totalReviews } = msg;
            setRows((prevState) => {
              prevState = []
              prevState = [...doctorReviews];
              return prevState;
            })
            setRowsCount(totalReviews)
            homeSocket.current.once(`updateGetDoctorRates`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, userProfile, mongoFilterModel, paginationModel, sortModel])


  const handleChangePage = (
    _event: any | null,
    newPage: number) => {
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: newPage - 1
      }
    })
  }


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowsCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowsCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowsCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        page: maximuPage <= 0 ? 0 : maximuPage,
        pageSize: parseInt(event.target.value, 10)
      }
    })
  }

  const { filterModel, onFilterChange, } = useDataGridServerFilter();

  const handelFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    onFilterChange(newFilterModel);
  }, [onFilterChange])


  const removeMongoFilter = (filterModel: GridFilterModel) => {
    if (filterModel.items.length == 0) { setMongoFilterModel({}) }
    const value = filterModel.items[0]?.value;
    if (!value && value == 0 && value == '') {
      setMongoFilterModel({})
    }
  }

  useEffect(() => {
    const updateDbFilter = (filterModel: GridFilterModel) => {
      const value = filterModel.items[0]?.value;
      if (value && value !== '0' && value !== '') {
        const mongoQuery = convertFilterToMongoDB(filterModel, columns);
        setMongoFilterModel(mongoQuery);
      } else {
        setMongoFilterModel({})
      }
    }
    globalFilterFunctions.applyFilters = updateDbFilter;
    removeMongoFilter(filterModel)
  }, [columns, filterModel])


  useEffect(() => {
    setTimeout(() => {
      if (dataGridRef?.current) {
        setBoxMinHeight(`${dataGridRef.current.clientHeight}px`);
      }
    }, 100);
  }, [paginationModel.pageSize, isLoading]);


  //Update page for pagination model in case last page delete or result less than page
  useEffect(() => {
    const totalCount = rowsCount;
    const totalPages = Math.ceil(totalCount / paginationModel.pageSize);
    const isOutOfRange = paginationModel.page >= totalPages;

    if (totalCount !== 0) {
      if (isOutOfRange) {
        setPaginationModel((prevState: { page: number, pageSize: number }) => ({
          ...prevState,
          page: Math.max(0, totalPages - 1), // Ensures page never goes below 0
        }));
      }
    } else {
      setPaginationModel((prevState: { page: number, pageSize: number }) => ({
        ...prevState,
        page: 0, // Ensures page never goes below 0
      }));
    }
  }, [paginationModel.page, paginationModel.pageSize, rowsCount])


  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12  animate__animated animate__backInUp">
        {
          isLoading ?
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <Box sx={{ minHeight: boxMinHeight }} className="dataGridOuterBox">
                    <LoadingComponent boxMinHeight={boxMinHeight} />
                  </Box>
                </div>
              </div>
            </div> :
            <div className="card">
              <div ref={dataGridRef} className="tab-content schedule-cont">
                <Box className="dataGridOuterBox" >
                  <Typography className="totalTypo"
                    variant='h5' align='center' gutterBottom >
                    {
                      rowsCount !== 0 ?
                        `Total Rates: ${rowsCount}` :
                        `Not any Rates yet`
                    }
                  </Typography>
                  <div className="table-responsive" style={{ height: paginationModel?.pageSize == 5 ? 600 : 1000, width: '100%' }}>


                    <DataGrid
                      rowHeight={80}
                      paginationMode='server'
                      filterMode="server"
                      // dont mode server and handle in client side sorting toosortingMode="server"
                      sortModel={sortModel}
                      onSortModelChange={(model: GridSortModel) => {
                        if (model.length > 0) {
                          setSortModel((_prev: GridSortModel) => [...model]);
                        }
                      }}
                      sortingOrder={['desc', 'asc']}
                      filterModel={filterModel}
                      onFilterModelChange={handelFilterModelChange}
                      columnVisibilityModel={columnVisibilityModel}
                      onColumnVisibilityModelChange={(newModel) => {
                        setColumnVisibilityModel(newModel)
                      }}
                      loading={isLoading}
                      experimentalFeatures={{ ariaV7: true }}
                      slots={{
                        toolbar: CustomToolbar,
                        pagination: CustomPagination,
                        noResultsOverlay: CustomNoRowsOverlay,
                        noRowsOverlay: CustomNoRowsOverlay
                      }}
                      slotProps={{
                        toolbar: {
                          printOptions: { disableToolbarButton: true },
                          deleteId: [],
                          deleteClicked: () => { },
                          columnVisibilityModel: columnVisibilityModel,
                        },
                        pagination: {
                          onRowsPerPageChange: handleChangeRowsPerPage,
                          page: paginationModel.page,
                          rowsPerPage: paginationModel.pageSize,
                          onPageChange: handleChangePage,
                          count: rowsCount,
                          SelectProps: {
                            inputProps: {
                              id: 'pagination-select',
                              name: 'pagination-select',
                            },
                          },
                        },
                        filterPanel: {
                          filterFormProps: {
                            deleteIconProps: {
                              sx: {
                                justifyContent: 'flex-start'
                              },
                            },
                          },
                        },
                        baseCheckbox: {
                          inputProps: {
                            name: "select-checkbox"
                          }
                        }
                      }}
                      getRowId={(params) => params._id}
                      rows={rows}
                      rowCount={rowsCount}
                      columns={columns}
                      disableRowSelectionOnClick
                      paginationModel={paginationModel}
                      pageSizeOptions={[5, 10]}
                      showCellVerticalBorder
                      showColumnVerticalBorder
                      sx={{
                        "&.MuiDataGrid-root .MuiDataGrid-row": {
                          backgroundColor:
                            false ? getSelectedBackgroundColor(
                              theme.palette.primary.dark,
                              theme.palette.mode,
                            ) : '',
                          '&:hover': {
                            backgroundColor: getSelectedHoverBackgroundColor(
                              theme.palette.primary.light,
                              theme.palette.mode,
                            ),
                          }
                        },
                        "& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                          marginTop: "1em",
                          marginBottom: "1em"
                        },
                        "& .MuiDataGrid-footerContainer": {
                          [theme.breakpoints.only("xs")]: {
                            justifyContent: 'center',
                            marginBottom: '2px'
                          }
                        }
                      }}
                    />
                  </div>
                </Box>
              </div>
            </div>
        }
      </div>
    </Fragment>
  );
}

export default Rates;
