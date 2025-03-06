/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueFormatterParams, GridRenderCellParams, GridColumnVisibilityModel, GridFilterModel, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6, patient_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { AppointmentReservationExtendType } from './Appointment';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';
import CustomNoRowsOverlay from '@/shared/CustomNoRowsOverlay';
import Pagination from '@mui/material/Pagination';
import { LoadingComponent, StyledBadge, formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from './ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import dataGridStyle from '@/shared/dataGridStyle';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import CustomPagination from '../shared/CustomPagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface ValueType {
  id: number;
  appointmentId: string;
  patientName: string;
  apptDate: string;
  patientImage: string;
  purpose: string;
  type: string;
  paidAmount: string;
}

export interface PropType {
  isToday: boolean;
  total: number;
  setTotal: Function;
  isLoading: boolean;
  setIsLoading: Function;
}

const AppointmentTab: FC<PropType> = (({ isToday, total, setTotal, isLoading, setIsLoading }) => {

  const { classes, theme } = dataGridStyle({});
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dataGridRef = useRef<any>(null)
  const { bounce } = useScssVar();
  const [reload, setReload] = useState<boolean>(false)
  const [dashAppointmentData, setDashAppointmentData] = useState<AppointmentReservationExtendType[]>([])

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
      },
      {
        field: 'patientProfile.fullName',
        headerName: `Patient Name`,
        width: 250,
        headerAlign: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.patientProfile?.fullName
        },
        sortComparator: (v1: any, v2: any) => v1.toLowerCase() > v2.toLowerCase() ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
          const online = row?.patientProfile?.online || false
          return (
            <>
              <Link className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                  idle={row?.patientProfile?.lastLogin?.idle}
                >
                  <Avatar alt="" src={profileImage} />
                </StyledBadge></Link>
              <Link href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`} >{`${row?.patientProfile?.gender == '' ? '' : row?.patientProfile?.gender + '.'}`}{row?.patientProfile?.fullName}</Link></>
          )
        }
      },
      {
        field: 'dayPeriod',
        headerName: 'Day time',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { value } = params
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      },
      {
        field: 'selectedDate',
        headerName: `Selected Date`,
        align: 'center',
        width: 200,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.selectedDate ? dayjs(row.selectedDate).toDate() : null;
        },
        sortComparator: (v1: any, v2: any) => dayjs(v1).isAfter(dayjs(v2).format('YYYY MM DD HH:mm'), 'minutes') ? 1 : -1,
        renderCell: (params) => {
          const { row } = params
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row?.selectedDate).format(`DD MMM YYYY`)}</span>
              <span className="d-block">{row?.timeSlot?.period}</span>
            </Stack>
          )
        }
      },
      {
        field: 'timeSlot.total',
        headerName: 'Total',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
                params?.row?.timeSlot?.total.toString()
              )}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: "createdDate",
        headerName: 'Reserved At',
        width: 250,
        headerAlign: 'center',
        align: 'center',
        type: 'date',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row.createdDate ? dayjs(row.createdDate).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdDate).format(`DD MMM YYYY H:mm`)}</span>

            </>
          )
        }
      },
      {
        field: 'doctorPaymentStatus',
        headerName: 'Payment Status',
        width: 180,
        align: 'center',
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Chip
                label={row?.doctorPaymentStatus}
                size="small"
                sx={{
                  color: theme.palette.primary.contrastText,
                  backgroundColor: row?.doctorPaymentStatus == 'Paid' ? '#5BC236' :
                    row.doctorPaymentStatus == 'Awaiting Request' ? theme.palette.error.main :
                      '#ffa500'
                }} />
            </>
          )
        }
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.reservations_id && userProfile?.reservations_id.length !== 0) {
        homeSocket.current.emit('getDocDashAppointments', { userId, paginationModel, sortModel, mongoFilterModel, isToday })
        homeSocket.current.once('getDocDashAppointmentsReturn', (msg:
          { status: number, docDashAppointments: { reservations: AppointmentReservationExtendType[], totalCount: { count: number }[] }[], message?: string }) => {
          const { status, docDashAppointments, message } = msg;
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

            const { reservations, totalCount } = docDashAppointments[0]
            if (reservations.length !== 0) {
              setDashAppointmentData(() => {
                let newState = []
                newState = [...reservations]
                return newState
              })
            } else {
              setDashAppointmentData([])
            }
            if (totalCount.length !== 0) {
              const { count } = totalCount[0]
              setTotal(count)
            } else {
              setTotal(0)
            }
            homeSocket.current.once(`updateGetDocDashAppointments`, () => {
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
  }, [homeSocket, paginationModel, sortModel, reload, mongoFilterModel, isToday, userProfile])

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
      {isLoading && dashAppointmentData.length == 0 ?
        <Box sx={{ minHeight: boxMinHeight }} className={classes.dataGridOuterBox}>
          <LoadingComponent boxMinHeight={boxMinHeight} />
        </Box> :
        <>
          <div className="card">
            <div ref={dataGridRef} className="tab-content schedule-cont">
              <Box className={classes.dataGridOuterBox} >
                <Typography className={classes.totalTypo}
                  variant='h5' align='center' gutterBottom >
                  {
                    total !== 0 ?
                      `Total Reservations ${total}` :
                      `Not any reservation yet`
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
                    rows={dashAppointmentData}
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
        </>
      }

    </Fragment>
  )
})

export default AppointmentTab;