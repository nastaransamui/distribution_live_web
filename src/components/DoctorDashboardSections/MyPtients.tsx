/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { patient_profile } from '@/public/assets/imagepath';

//Mui
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import { styled } from '@mui/material';
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

import { toast } from 'react-toastify';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import preciseDiff from 'dayjs-precise-range'
import dataGridStyle from '../shared/dataGridStyle';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridFilterModel, GridRenderCellParams, GridRowParams, GridSortModel, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from './ScheduleTiming';
import CustomPagination from '../shared/CustomPagination';
import RenderExpandableCell from '../shared/RenderExpandableCell';
import { useRouter } from 'next/router';



export interface PatientProfile {
  accessToken: string;
  address1: string;
  address2: string;
  billingsIds: string[];
  bloodG: string;
  city: string;
  country: string;
  createdAt: Date;
  dependentsArray: string[];
  dob: Date | "";
  doctors_id: string[];
  favs_id: string[];
  firstName: string;
  fullName?: string;
  gender: string;
  idle?: boolean;
  invoice_ids: string[];
  isActive: boolean;
  isVerified?: boolean | "google";
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
    idle?: boolean;
  };
  lastName: string;
  lastUpdate: Date;
  medicalRecordsArray: string[];
  mobileNumber: string;
  online: boolean;
  prescriptions_id: string[];
  profileImage: string;
  rate_array: number[];
  reservations_id: string[];
  reviews_array: string[];
  roleName: "patient";
  services: "google" | "password";
  state: string;
  userName: string;
  zipCode: string;
  _id: string;
  id: number;

}


export interface MyPatientsProfile {
  patients: PatientProfile[];
  totalCount: number;
}


const MyPtients: FC = (() => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(preciseDiff)
  const { muiVar, bounce } = useScssVar();
  const dataGridRef = useRef<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [patiensDataProfile, setpatiensDataProfile] = useState<PatientProfile[]>([])
  const { classes, theme } = dataGridStyle({});
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [total, setTotal] = useState<number>(0)

  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
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
        valueGetter: (params: GridRenderCellParams) => {
          return params?.row?.id
        },
      },
      {
        field: 'profile.fullName',
        headerName: `Patient Name`,
        width: 270,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter: (params: GridRenderCellParams) => {
          return params?.row?.fullName
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.profileImage == '' ? patient_profile : row?.profileImage
          const online = row?.online || false

          return (
            <span style={{ minWidth: "100%", display: 'flex', alignItems: 'center' }}>
              <Link className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row._id)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                  idle={row?.idle}
                >
                  <Avatar alt="" src={`${profileImage}`} >
                    <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                  </Avatar>
                </StyledBadge></Link>
              <Link href={`/doctors/dashboard/patient-profile/${btoa(row._id)}`} >{`${row?.gender == '' ? '' : row?.gender + '.'}`}{row?.fullName}</Link>
            </span>
          )
        }
      },
      {
        field: 'status.lastLogin.date',
        headerName: `Last Login`,
        align: 'center',
        width: 200,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.lastLogin
        },
        sortComparator: (v1, v2) => {
          if (v1?.lastLogin || v2?.lastLogin) {
            return dayjs(v1?.lastLogin?.date).isAfter(dayjs(v2?.lastLogin?.date)) ? 1 : -1
          }
          return v1 < v2 ? 1 : -1
        },
        valueFormatter(params: GridValueFormatterParams) {
          const { api, id } = params;
          let lastLogin = api.getCellValue(id as string, 'lastLogin')
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
                spacing={0} />
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
        valueGetter: (params) => {
          const { row } = params;
          return row?.profile?.dob
        },
        sortComparator: (v1, v2) => {
          if (typeof v1 !== 'string' && typeof v2 !== 'string') {
            return dayjs(v1).isAfter(dayjs(v2)) ? 1 : -1
          }
          return 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          //@ts-ignore
          let { years, months, days } = dayjs.preciseDiff(row?.dob, dayjs(), true)
          return (
            <Stack direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}>
              <Link href={`#`} onClick={(e) => e.preventDefault()} >
                {row?.dob !== '' ? dayjs(row?.dob).format('DD MMM YYYY') : '---- -- --'}
              </Link>
              {row?.dob !== '' && <Link href={`#`} onClick={(e) => e.preventDefault()} >
                <i className="fas fa-birthday-cake"></i>{"  "}
                {`${isNaN(years) ? '--' : years} years`}
              </Link>}
            </Stack>
          )
        }
      },
      {
        field: 'profile.bloodG',
        headerName: `Blood Type`,
        align: 'center',
        width: 120,
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        valueGetter: (params) => {
          const { row } = params;
          return row?.bloodG == '' ? '===' : `🩸 ${row?.bloodG}`
        },
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
        valueGetter: (params: GridValueGetterParams) => {
          const { row } = params;
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
        valueGetter: (params: GridValueGetterParams) => {
          const { row } = params;
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
        valueGetter: (params: GridValueGetterParams) => {
          const { row } = params;
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
            onClick={() => {
              const encodedId = btoa(params.row?._id);
              router.push(`/doctors/dashboard/patient-profile/${encodedId}`)
            }}
            icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,

        ]
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let patientsIdArray = userDoctorProfile?.patients_id
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userDoctorProfile?.patients_id && userDoctorProfile?.patients_id.length !== 0) {
        homeSocket.current.emit('getMyPatientsProfile', { userId, patientsIdArray, paginationModel, sortModel, mongoFilterModel, })
        homeSocket.current.once('getMyPatientsProfileReturn', (msg: {
          status: number,
          myPatientsProfile: MyPatientsProfile[],
          message?: string
        }) => {
          const { status, myPatientsProfile, message } = msg;
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
            if (myPatientsProfile.length !== 0) {
              const { patients, totalCount } = myPatientsProfile[0]
              setpatiensDataProfile(() => {
                let newState = []
                newState = [...patients]
                return newState
              })
              setTotal(() => totalCount)
            } else {
              setpatiensDataProfile(() => { return [] })
            }
            homeSocket.current.once(`updateGetMyPatientsProfile`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      } else {
        isLoading && setIsLoading(false)

      }
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


  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12   animate__animated animate__backInUp" style={muiVar}>

        {
          isLoading ?
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <Box sx={{ minHeight: boxMinHeight }} className={classes.dataGridOuterBox}>
                    <LoadingComponent boxMinHeight={boxMinHeight} />
                  </Box>
                </div>
              </div>
            </div> :
            <div className="card">
              <div ref={dataGridRef} className="tab-content schedule-cont">
                <Box className={classes.dataGridOuterBox} >
                  <Typography className={classes.totalTypo}
                    variant='h5' align='center' gutterBottom >
                    {
                      total !== 0 ?
                        `Total Patients: ${total}` :
                        `Not any Patients yet`
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
                          count: total,
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
                      rows={patiensDataProfile}
                      rowCount={total}
                      columns={columns}
                      disableRowSelectionOnClick
                      paginationModel={paginationModel}
                      pageSizeOptions={[5, 10]}
                      showCellVerticalBorder
                      showColumnVerticalBorder
                      className={classes.dataGrid}
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

export default MyPtients;