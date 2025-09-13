/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { doctors_profile, } from '@/public/assets/imagepath';

//Mui

import Avatar from '@mui/material/Avatar';

import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import SyncIcon from '@mui/icons-material/Sync';
//liberies
import { toast } from 'react-toastify';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import preciseDiff from 'dayjs-precise-range'
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnVisibilityModel,
  GridFilterModel,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, CustomToolbarPropsType, CustomToolbarSlotType, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import Typography from '@mui/material/Typography';
import CustomPagination, { CustomPaginationSlotType } from '../shared/CustomPagination';
import Stack from '@mui/material/Stack';
import RenderExpandableCell from '../shared/RenderExpandableCell';
import ageParts from '@/helpers/ageParts';

export interface FavDoctorProfile {
  totalCount: number;
  doctors: DoctorProfileType[];
}


const Favourits: FC = (() => {
  const { bounce } = useScssVar();
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(preciseDiff)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const dataGridRef = useRef<any>(null)
  const [rows, setRows] = useState<DoctorProfileType[]>([])
  const theme = useTheme();
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [total, setTotal] = useState<number>(0)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)


  const perPage = 5;
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
  const [favIconLoading, setFavIconLoading] = useState<{ [key: string]: boolean }>({ "": false });
  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "profile.id",
        headerName: "ID",
        width: 100,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter: (_, row) => {
          return row.id
        }
      },
      {
        field: 'profile.fullName',
        headerName: `Doctor Name`,
        width: 270,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.profileImage == '' ? doctors_profile : row?.profileImage
          const online = row?.online || false

          return (
            <span style={{ minWidth: "100%", display: 'flex', alignItems: 'center' }}>
              <Link className="avatar mx-2" href={`/doctors/profile/${btoa(row._id)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                  idle={row?.lastLogin?.idle}
                >
                  <Avatar alt="" src={`${profileImage}`} >
                    <img src={doctors_profile} alt="" className="avatar avatar-in-schedule-table" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Link href={`/doctors/profile/${btoa(row._id)}`} >
                {`${row?.gender == '' ? '' : row?.gender + '.'}`}{row?.fullName}
              </Link>
            </span>
          )
        }
      },
      {
        field: 'profile.specialities.0.specialities',
        headerName: 'Specialities',
        width: 300,
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(_, row) {
          return row?.specialities?.length == 0 ? '--' : row?.specialities[0]?.specialities
        },
        valueFormatter(_, row) {
          ;
          return row?.specialities?.length == 0 ? '--' : row?.specialities[0]?.specialities
        },
        sortComparator: (v1: any, v2: any) => v1 > v2 ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
          const { row, formattedValue } = params;
          const specialityImage = row?.specialities?.length !== 0 ? row?.specialities[0]?.image : '';
          const description = row?.specialities?.length ? row?.specialities[0]?.description : '--';
          return (
            <>
              {
                row?.specialities?.length !== 0 ?
                  <span style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                    <Link className="avatar mx-2" href="#" onClick={(e) => e.preventDefault()}>
                      <img src={`${specialityImage}`} style={{ width: 30, height: 30 }} alt="" />
                    </Link>
                    <Stack sx={{ maxWidth: 200 }}>
                      <Link href="#" onClick={(e) => e.preventDefault()}>{formattedValue}</Link>
                      <Tooltip title={description} arrow followCursor>
                        <small style={{
                          display: 'block',
                          maxWidth: '250px',  // Adjust width as needed
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}>
                          {description}
                        </small>
                      </Tooltip>
                    </Stack>
                  </span> :
                  <span style={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                    <Link href="#" onClick={(e) => e.preventDefault()}>{`--`}</Link>
                  </span>
              }
            </>
          )
        }
      },
      {
        field: 'status.lastLogin.date',
        headerName: `Last Login`,
        align: 'center',
        width: 200,
        type: 'date',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        sortComparator: (v1, v2) => {
          if (v1?.lastLogin || v2?.lastLogin) {
            return dayjs(v1?.lastLogin?.date).isAfter(dayjs(v2?.lastLogin?.date)) ? 1 : -1
          }
          return v1 < v2 ? 1 : -1
        },
        valueFormatter(_, row) {
          let lastLogin = row?.lastLogin;
          // let online = api.getCellValue(id as string, 'online')
          return lastLogin == undefined ?
            `This User not login yet` :
            `<span> ${dayjs(lastLogin?.date).tz(process.env.NEXT_PUBLIC_TZ).format('DD MMM YYYY HH:mm')}</span>
            `
        },
        renderCell: (params: GridRenderCellParams) => {
          const { formattedValue } = params;
          return (
            <Fragment>
              <Stack direction="column"
                justifyContent="center"
                alignItems="center"
                dangerouslySetInnerHTML={{ __html: formattedValue }}
                spacing={0}
                sx={{ height: '100%', justifyContent: 'center' }} />
            </Fragment>
          )
        }
      },
      {
        field: 'profile.dob',
        headerName: `Birthday`,
        width: 120,
        align: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter: (_, row) => {
          return row.dob ? dayjs(row.dob).toDate() : null;
        },
        sortComparator: (v1, v2) => {
          if (typeof v1 !== 'string' && typeof v2 !== 'string') {
            return dayjs(v1).isAfter(dayjs(v2)) ? 1 : -1
          }
          return 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          let { years, } = ageParts(row?.dob ?? null)
          return (
            <Stack direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
              sx={{ height: '100%', justifyContent: 'center' }} >
              <Link href={`#`} onClick={(e) => e.preventDefault()} >
                {row?.dob !== '' ? dayjs(row?.dob).format('DD MMM YYYY') : '---- -- --'}
              </Link>
              {row?.dob !== '' &&
                <Link href={`#`} onClick={(e) => e.preventDefault()} style={{ color: theme.palette.text.color }} >
                  <i className="fas fa-birthday-cake"></i>{"  "}
                  {`${isNaN(years) ? '--' : years} years`}
                </Link>}
            </Stack>
          )
        }
      },
      {
        field: 'profile.city',
        headerName: `City`,
        align: 'center',
        width: 150,
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        valueFormatter: (_, row) => {
          return row?.city == "" ? "===" : row?.city;
        },
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <RenderExpandableCell {...params} />
            </>
          )
        }
      },
      {
        field: 'profile.state',
        headerName: `State`,
        align: 'center',
        width: 150,
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        valueFormatter: (_, row) => {
          return row?.state == "" ? "===" : row?.state;
        },
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <RenderExpandableCell {...params} />
            </>
          )
        }
      },
      {
        field: 'profile.country',
        headerName: `Country`,
        align: 'center',
        width: 150,
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        valueFormatter: (_, row) => {
          return row?.country == "" ? "===" : row?.country;
        },
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <RenderExpandableCell {...params} />
            </>
          )
        }
      },
      {
        field: "actions",
        type: 'actions',
        width: 150,
        searchAble: false,
        sortable: false,
        filterable: false,
        headerName: "Actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="view-action"
            icon={
              <Tooltip arrow title="Remove doctor to favorite.">
                {!favIconLoading[params.row._id] ?
                  <FavoriteIcon sx={{
                    animation: `heartbeat 1s infinite`,
                    color: 'deeppink',
                    "&:hover": {
                      animation: `heartbeat 1s infinite`,
                      color: 'deeppink'
                    },
                  }} /> :
                  <SyncIcon sx={{
                    color: 'primary.main',
                    animation: `rotate 3s infinite`,
                  }} />
                }
              </Tooltip>
            }
            label="View"
            onClick={() => {
              setFavIconLoading((prevState) => {
                return {
                  ...prevState,
                  [params.row?._id]: true
                }
              });

              removeFavDoctor(params.row?._id)
            }} />,

        ]
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favIconLoading, reload]);

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let favIdArray = userProfile?.favs_id
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      // if (userProfile?.favs_id && userProfile?.favs_id.length !== 0) {
      homeSocket.current.emit('getFavDoctorsForPatientProfile', { userId, favIdArray, paginationModel, sortModel, mongoFilterModel, })
      homeSocket.current.once('getFavDoctorsForPatientProfileReturn', (msg:
        {
          status: number,
          userFavProfile: FavDoctorProfile[],
          message?: string
        }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `${status}`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            toastId: 'socketEror',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              setIsLoading(false)
              toast.dismiss('socketEror')
            }
          });
        } else {
          const { userFavProfile } = msg;
          if (userFavProfile.length !== 0) {
            const { doctors, totalCount } = userFavProfile[0]
            setRows(() => {
              let newState = []
              newState = [...doctors]
              return newState
            })
            setTotal(() => totalCount)
          }
          homeSocket.current.once(`updateGetFavDoctorsForPatientProfile`, () => {
            setReload(!reload)
          })
          setIsLoading(false)
        }

      })
      // } else {
      //   isLoading && setIsLoading(false)

      // }
    }
    return () => {
      isActive = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, mongoFilterModel, paginationModel, reload, sortModel, userProfile])


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
      if (total !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(total / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(total / parseInt(event.target.value, 10))) - 1
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
    const totalCount = total;
    const totalPages = Math.ceil(totalCount / paginationModel.pageSize);
    const isOutOfRange = paginationModel.page >= totalPages;

    if (total !== 0) {
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
  }, [paginationModel.page, paginationModel.pageSize, total])

  const removeFavDoctor = (doctorId: GridRowId) => {
    if (homeSocket?.current) {
      homeSocket.current.emit('removeDocFromFav', { doctorId, patientId: userProfile?._id })
      homeSocket.current.once('removeDocFromFavReturn', (msg: { status: number, message: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            toastId: 'error',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              toast.dismiss('error')
            }
          });
        } else {
          setReload(!reload)
        }
      })
    }
  }
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>

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
                      total !== 0 ?
                        `Total Favourites: ${total}` :
                        `Not any Favourites yet`
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
                      showToolbar
                      slots={{
                        toolbar: CustomToolbar as CustomToolbarSlotType,

                        pagination: CustomPagination as CustomPaginationSlotType,
                        noResultsOverlay: CustomNoRowsOverlay,
                        noRowsOverlay: CustomNoRowsOverlay
                      }}
                      slotProps={{
                        toolbar: {
                          printOptions: { disableToolbarButton: true },
                          deleteId: [],
                          deleteClicked: () => { },
                          columnVisibilityModel: columnVisibilityModel,
                        } as CustomToolbarPropsType,
                        pagination: {
                          onRowsPerPageChange: handleChangeRowsPerPage,
                          page: paginationModel.page,
                          rowsPerPage: paginationModel.pageSize,
                          onPageChange: handleChangePage,
                          count: total,
                          SelectProps: {
                            inputProps: {
                              id: 'pagination-select',
                              name: 'pagination-select',
                            },
                          },
                        },
                      }}
                      getRowId={(params) => params._id}
                      rows={rows}
                      rowCount={total}
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
  )
});

export default Favourits;