/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, useMemo, useCallback } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams, GridColumnVisibilityModel, GridColDef, GridAlignment, GridFilterModel, GridSortModel } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { doctors_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Chip from '@mui/material/Chip';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import { patient_profile } from '@/public/assets/imagepath';
import Typography from '@mui/material/Typography';
import { Box, DialogContent } from '@mui/material';
//liberies
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { LoadingComponent, StyledBadge, formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import { EditValueType } from '../DoctorDashboardSections/AvailableTiming';
import CustomPagination from './CustomPagination';
import { AppointmentReservationExtendType } from '../DoctorsSections/CheckOut/PaymentSuccess';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { PrintInvoiceComponent } from '../DoctorDashboardSections/Invoices';
import dataGridStyle from './dataGridStyle';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from './CustomToolbar';
import { isNotNull } from './PatientBillingRecords';


const PatientAppointment: FC<{ userType: 'patient' | 'doctor', patientId: string }> = (({ userType, patientId }) => {
  const { muiVar, bounce } = useScssVar();

  const { classes, theme } = dataGridStyle({});
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const dataGridRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRow] = useState<AppointmentReservationExtendType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [printProps, setPrintProps] = useState<any>({})
  const printRef = useRef(null);

  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef<any>(null);
  const [isPrinting, setIsPrinting] = useState<any>(false);
  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    // content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;

        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    }
  });
  const printButtonClicked = (row: any) => {
    const { patientProfile } = row;
    const { firstName, lastName, country, city, state, address1, address2 } = userProfile!
    const { gender, firstName: paFirstName, lastName: paLastName, country: paCountry,
      city: paCity, state: paState, address1: paAddress1, address2: paAddress2 } = patientProfile

    setPrintProps(() => {
      let newState = {}
      newState = {
        _id: row?._id,
        issueDay: dayjs(row.createdDate).format('DD MMM YYYY'),
        drName: `Dr. ${firstName} ${lastName}`,
        drAddress: `${address1} ${address1 !== '' ? ', ' : ''} ${address2}`,
        drCity: city,
        drState: state,
        drCountry: country,
        paName: `${gender}${gender !== '' ? '.' : ''} ${paFirstName} ${paLastName}`,
        paAddress: `${paAddress1} ${paAddress1 !== '' ? ', ' : ''} ${paAddress2}`,
        paCity: paCity,
        paState: paState,
        paCountry: paCountry,
        invoiceId: row?.invoiceId,
        doctorPaymentStatus: row?.doctorPaymentStatus,
        selectedDate: dayjs(row?.selectedDate).format('DD MMM YYYY'),
        timeSlot: row?.timeSlot,
        paymentType: row?.paymentType,
        paymentToken: row?.paymentToken,
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();

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
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
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
        field: 'dayPeriod',
        headerName: 'Day time',
        width: 90,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
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
        field: 'doctorProfile.fullName',
        headerName: `Doctor Name`,
        width: 250,
        minWidth: 250,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueFormatter(params: GridValueFormatterParams) {
          const { api, id } = params;
          let fullName = api.getCellValue(id as string, 'doctorProfile')?.fullName
          return ` Dr. ${fullName}`
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row, formattedValue } = params;
          const profileImage = row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage
          const online = row?.doctorProfile?.online || false
          return (
            <>
              <Link aria-label='profile' className=" mx-2" href={`/doctors/profile/${btoa(row.doctorId)}`} >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  idle={row?.doctorProfile?.lastLogin?.idle}
                  online={online}
                >
                  <Avatar alt="" src={`${profileImage}`} >
                    <img src={doctors_profile} alt="" className="avatar" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Stack>
                <Link aria-label='profile' href={`/doctors/profile/${btoa(row.doctorId)}`}
                  style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                  {formattedValue}
                </Link>
                <Link href={
                  userType == "patient" ?
                    `/patient/dashboard/invoice-view/${btoa(params.id as string)}` :
                    `/doctors/dashboard/invoice-view/${btoa(params.id as string)}`
                } >
                  {row.invoiceId}
                </Link>
              </Stack>
            </>
          )
        }
      },
      {
        field: 'selectedDate',
        headerName: `Selected Date`,
        align: 'center' as GridAlignment,
        width: 200,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        headerAlign: 'center' as GridAlignment,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return new Date(row?.selectedDate)
        },
        sortComparator: (v1: any, v2: any) => dayjs(v1).isAfter(dayjs(v2).format('YYYY MM DD HH:mm'), 'minutes') ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
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
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
                params?.row?.timeSlot?.total
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
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
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
      userType == 'doctor' ? {
        field: 'doctorPaymentStatus',
        headerName: 'Payment Status',
        width: 200,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        sortComparator: (v1: any, v2: any) => {
          return v1 > v2 ? -1 : 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;

          return (
            <>

              <Chip
                label={row?.doctorPaymentStatus}
                size="small"
                sx={{
                  color: theme.palette.primary.contrastText,
                  backgroundColor: row.doctorPaymentStatus == 'Paid' ? '#5BC236' :
                    row.doctorPaymentStatus == 'Awaiting Request' ? theme.palette.error.main :
                      '#ffa500'
                }} />

            </>
          )
        }
      } : null,
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        width: 150,
        getActions: (params: GridRowParams) => {
          if (userType == 'patient') {
            return [
              <GridActionsCellItem key={params.row.toString()} icon={
                <i className="far fa-eye" style={{ color: theme.palette.primary.main }}></i>}
                onClick={() => {
                  const startTime = params.row?.timeSlot?.period.split(' - ')[0]
                  const endTime = params.row?.timeSlot?.period.split(' - ')[1]
                  // create a date object with a specific date
                  const date = dayjs.tz(params?.row?.selectedDate, process.env.NEXT_PUBLIC_TZ).startOf('day');
                  const total = params.row.timeSlot.total;
                  const currencySymbol = params.row.timeSlot.currencySymbol
                  // create a time object with a specific time
                  const timeStarted = dayjs(startTime, 'HH:mm');

                  const timeFinished = dayjs(endTime, 'HH:mm');

                  // combine the date and time objects
                  const startDateTime = date.hour(timeStarted.hour()).minute(timeStarted.minute()).second(0);
                  const finishDateTime = date.hour(timeFinished.hour()).minute(timeFinished.minute()).second(0);
                  const s = startDateTime.local().toDate();
                  const e = finishDateTime.local().toDate();
                  const title = `${params?.row?.patientProfile?.firstName} ${params?.row?.patientProfile?.lastName}`
                  setEditValues({
                    start: s,
                    end: e,
                    title: title,
                    patientProfile: params?.row?.patientProfile,
                    _id: params?.row?._id,
                    id: params?.row?.id,
                    createdDate: params?.row?.createdDate,
                    patientId: params?.row?.patientId,
                    total: total,
                    currencySymbol: currencySymbol,
                    invoiceId: params?.row?.invoiceId,
                    doctorPaymentStatus: params?.row?.doctorPaymentStatus
                  })
                  setShow(true)
                }} label='View' />,
              <GridActionsCellItem
                key={params.row.toString()}
                disableFocusRipple
                disableRipple
                disableTouchRipple
                onClick={() => {
                  printButtonClicked(params.row)
                }}
                icon={<i className="fas fa-print"
                  style={{ color: theme.palette.secondary.main }}></i>} label="Print" />,
            ]
          } else {
            return [
              <GridActionsCellItem key={params.row.toString()} icon={
                <i className="far fa-eye" style={{ color: theme.palette.primary.main }}></i>} onClick={() => {
                  const startTime = params.row?.timeSlot?.period.split(' - ')[0]
                  const endTime = params.row?.timeSlot?.period.split(' - ')[1]
                  // create a date object with a specific date
                  const date = dayjs.tz(params?.row?.selectedDate, process.env.NEXT_PUBLIC_TZ).startOf('day');
                  const total = params.row.timeSlot.total;
                  const currencySymbol = params.row.timeSlot.currencySymbol
                  // create a time object with a specific time
                  const timeStarted = dayjs(startTime, 'HH:mm');

                  const timeFinished = dayjs(endTime, 'HH:mm');

                  // combine the date and time objects
                  const startDateTime = date.hour(timeStarted.hour()).minute(timeStarted.minute()).second(0);
                  const finishDateTime = date.hour(timeFinished.hour()).minute(timeFinished.minute()).second(0);
                  const s = startDateTime.local().toDate();
                  const e = finishDateTime.local().toDate();
                  const title = `${params?.row?.patientProfile?.firstName} ${params?.row?.patientProfile?.lastName}`
                  setEditValues({
                    start: s,
                    end: e,
                    title: title,
                    patientProfile: params?.row?.patientProfile,
                    _id: params?.row?._id,
                    id: params?.row?.id,
                    createdDate: params?.row?.createdDate,
                    patientId: params?.row?.patientId,
                    total: total,
                    currencySymbol: currencySymbol,
                    invoiceId: params?.row?.invoiceId,
                    doctorPaymentStatus: params?.row?.doctorPaymentStatus
                  })
                  setShow(true)
                }} label="Edit" />,
              <GridActionsCellItem
                key={params.row.toString()}
                disableFocusRipple
                disableRipple
                disableTouchRipple
                onClick={() => {
                  printButtonClicked(params.row)
                }}
                icon={<i className="fas fa-print"
                  style={{ color: theme.palette.secondary.main }}></i>} label="Print" />,
            ]
          }
        }
      }
    ].filter(isNotNull)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowCount / parseInt(event.target.value, 10))) - 1
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
    const totalCount = rowCount;
    const totalPages = Math.ceil(totalCount / paginationModel.pageSize);
    const isOutOfRange = paginationModel.page >= totalPages;

    if (rowCount !== 0) {
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
  }, [paginationModel.page, paginationModel.pageSize, rowCount])


  useEffect(() => {
    let isActive = true;
    if (isActive) {
      if (homeSocket.current !== undefined) {
        homeSocket?.current.emit('getAppointmentRecord', { patientId: patientId, doctorId: undefined, paginationModel, sortModel, mongoFilterModel, });
        homeSocket.current.once('getAppointmentRecordReturn', (msg: {
          status: number,
          message?: string,
          appointmentRecords: AppointmentReservationExtendType[],
          totalAppointment: number
        }) => {
          const { status, message, appointmentRecords, totalAppointment } = msg;
          if (status !== 200) {
            toast.error(message || `Error ${status} find Billing records`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: 'appointment-get',
              onClose: () => {
                setIsLoading(false)
                toast.dismiss('appointment-get')
              }
            });
          } else {
            setRow(appointmentRecords)
            setRowCount(totalAppointment)
            homeSocket.current.once(`updateGetAppointmentRecord`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }
        });
      }
    }
    return () => {
      isActive = false;
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, patientId, reload, paginationModel, sortModel, mongoFilterModel,])






  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintInvoiceComponent ref={printRef} printProps={printProps} />}
      </iframe>
      <div className="tab-content pt-0" style={muiVar}>
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
                      rowCount !== 0 ?
                        `Total Appointments: ${rowCount}` :
                        `Not any Appointments yet`
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
                          count: rowCount,
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
                      rowCount={rowCount}
                      columns={columns}
                      isRowSelectable={(params) => false}
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
      {
        show && <BootstrapDialog
          TransitionComponent={Transition}
          onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setShow(false)
            }, 500);
          }}
          aria-labelledby="edit_invoice_details"
          open={show}
        >
          <BootstrapDialogTitle
            id="edit_invoice_details" onClose={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setShow(false)
              }, 500);
            }}>
            <Link
              target='_blank'
              className="avatar mx-2"
              href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={editValues?.patientProfile?.online as boolean}
              >
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}`} >
                  <img src={patient_profile} alt="" className="avatar" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Typography
              component="a"
              target='_blank'
              sx={{
                color: theme.palette.primary.main,
                fontSize: '1rem',
                "&:hover": {
                  color: theme.palette.secondary.light
                }
              }} href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              {`${editValues?.patientProfile?.gender} ${editValues?.patientProfile?.firstName} ${editValues?.patientProfile?.lastName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row" style={{ minWidth: 350 }}>
                    <div className="col-md-6">
                      <span className="title">#{editValues?.id}</span>
                      <span className="text">{dayjs(editValues?.start).format('DD MMM YYYY')}</span>
                    </div>
                    <div className="col-md-6">
                      <div className="text-end">
                        <button
                          type="button"
                          className="btnLogin"
                          id="topup_status"
                        >
                          Confirmed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span className="title">Start:</span>
                <span className="text">{dayjs(editValues?.start).format('HH:mm')}</span>
              </li>
              <li>
                <span className="title">Finish</span>
                <span className="text">{dayjs(editValues?.end).format('HH:mm')}</span>
              </li>
              <li>
                <span className="title">Confirm Date:</span>
                <span className="text">{dayjs(editValues?.createdDate).format('DD MMM YYYY - HH:mm')}</span>
              </li>
              {userType == 'doctor' && <li>
                <span className="title">Status:</span>
                <span className="text">
                  <Chip
                    color={
                      editValues?.doctorPaymentStatus == 'Paid' ? 'success' :
                        editValues?.doctorPaymentStatus == 'Awaiting Request' ? 'error' :
                          'primary'}
                    label={`${editValues?.doctorPaymentStatus}`}
                    size="small"
                    sx={{ color: theme.palette.primary.contrastText }} />
                </span>
              </li>}
              <li>
                <span className="title">Invoice:</span>
                <span className="text">{editValues?.invoiceId}</span>
              </li>
              <li>
                <span className="title">Price:</span>
                <span className="text">{formatNumberWithCommas(editValues?.total!)} {" "} {editValues?.currencySymbol || "THB"}</span>
              </li>
            </ul>
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment>
  )
})

export default PatientAppointment;