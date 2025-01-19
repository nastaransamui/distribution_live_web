/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { doctors_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Chip from '@mui/material/Chip';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import { patient_profile } from '@/public/assets/imagepath';
import Typography from '@mui/material/Typography';
import { DialogContent } from '@mui/material';
//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { StyledBadge, formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import { EditValueType } from '../DoctorDashboardSections/AvailableTiming';
import CustomPagination from './CustomPagination';
import { AppointmentReservationExtendType } from '../DoctorsSections/CheckOut/PaymentSuccess';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { PrintInvoiceComponent } from '../DoctorDashboardSections/Invoices';


const PatientAppointment: FC<{ userType: 'patient' | 'doctor', patientId: string }> = (({ userType, patientId }) => {
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const appointmentRef = useRef<any>(null)
  const [appointmentRecords, setAppointmentRecords] = useState<AppointmentReservationExtendType[] | []>([])

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowAppointmentCount, setRowAppointmentCount] = useState<number>(0)
  const perPage = 5;
  const [dataGridAppointmentFilters, setDataGridAppointmentFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [appointmentPaginationModel, setAppointmentPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();
  const handleChangeAppointmentRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAppointmentPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowAppointmentCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowAppointmentCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowAppointmentCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridAppointmentFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowAppointmentCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowAppointmentCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowAppointmentCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        limit: parseInt(event.target.value, 10),
        skip: maximuPage <= 0 ? 0 : maximuPage
      }
    })
  };

  const handleChangeAppointmentPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridAppointmentFilters((prevState) => {
      return {
        limit: perPage !== appointmentPaginationModel.pageSize ? appointmentPaginationModel.pageSize : perPage * value,
        skip: (value - 1) * perPage,
      }
    })
    setAppointmentPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }


  useEffect(() => {
    let isActive = true;
    if (isActive) {
      if (homeSocket.current !== undefined) {
        homeSocket?.current.emit('getAppointmentRecord', { patientId: patientId, doctorId: undefined, ...dataGridAppointmentFilters });
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
              onClose: () => { }
            });
          } else {
            setAppointmentRecords(appointmentRecords)
            setRowAppointmentCount(totalAppointment)
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
  }, [homeSocket, patientId, reload, dataGridAppointmentFilters])





  const appointmentColumns: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 20,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'dayPeriod',
      headerName: 'Day time',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      valueGetter(params: GridRenderCellParams) {
        const { value } = params
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },

    {
      field: 'doctorProfile',
      headerName: `Doctor Name`,
      width: 250,
      minWidth: 250,
      align: 'left',
      headerAlign: 'center',
      valueFormatter(params: GridValueFormatterParams) {
        const { value } = params
        return ` Dr. ${value?.firstName} ${value?.lastName}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row, formattedValue } = params;
        const profileImage = row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage
        const online = row?.doctorProfile?.online || false
        return (
          <>
            <Link aria-label='profile' className=" mx-2" target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`} >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={online}
              >
                <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                  <img src={doctors_profile} alt="" className="avatar" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Stack>
              <Link aria-label='profile' target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
              <Link href={`/patient/dashboard/invoice-view/${btoa(params.id as string)}`} target='_blank'>{row.invoiceId}</Link></Stack>
          </>
        )
      }
    },
    {
      field: 'selectedDate',
      headerName: `Appointment Time`,
      align: 'center',
      width: 150,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack >
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.selectedDate}</span>
            <span className="d-block" >{params?.row?.timeSlot?.period}</span>
          </Stack>
        )
      }
    },
    {
      field: 'selectedPrice',
      headerName: `Price`,
      align: 'center',
      width: 150,
      headerAlign: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const timeSlot = params?.row?.timeSlot;
        return timeSlot ? parseFloat(timeSlot?.total) || 0 : 0; // Ensure a numeric value
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack >
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(params?.row?.timeSlot?.total)}</span>
            <span className="d-block">
              <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
            </span>
          </Stack>
        )
      }
    },
    {
      field: 'bookingDate',
      headerName: "Booking Date",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdDate).format(`MMM D, YYYY HH:MM`)}</span>
          </>
        )
      }
    },
    userType == 'doctor' && {
      field: 'paymentType',
      headerName: `Payment status`,
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Chip
              color={
                row.doctorPaymentStatus == 'Paid' ? 'success' :
                  row.doctorPaymentStatus == 'Awaiting Request' ? 'error' :
                    'primary'}
              label={`${row.doctorPaymentStatus}`}
              size="small"
              sx={{ color: theme.palette.primary.contrastText }} />
          </>
        )
      }
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
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
                const date = dayjs(params.row.selectedDate);
                const total = params.row.timeSlot.total;
                const currencySymbol = params.row.timeSlot.currencySymbol
                // create a time object with a specific time
                const timeStarted = dayjs(startTime, 'HH:mm');

                const timeFinished = dayjs(endTime, 'HH:mm');

                // combine the date and time objects
                const startDateTime = date.set('hour', timeStarted.hour()).set('minute', timeStarted.minute()).set('second', timeStarted.second());
                const s = dayjs(startDateTime).toDate()

                // combine the date and time objects
                const finishDateTime = date.set('hour', timeFinished.hour()).set('minute', timeFinished.minute()).set('second', timeFinished.second());
                const e = dayjs(finishDateTime).toDate()
                const title = `${params.row?.doctorProfile?.firstName} ${params.row?.doctorProfile?.lastName}`

                setEditValues({
                  start: s,
                  end: e,
                  title: title,
                  patientProfile: params.row?.doctorProfile,
                  _id: params.row?._id,
                  createdDate: params.row?.createdDate,
                  patientId: params.row?.patientId,
                  total: total,
                  currencySymbol: currencySymbol,
                  invoiceId: params.row?.invoiceId,
                  doctorPaymentStatus: params.row?.doctorPaymentStatus
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
                const date = dayjs(params.row.selectedDate);
                const total = params.row.timeSlot.total;
                const currencySymbol = params.row.timeSlot.currencySymbol
                // create a time object with a specific time
                const timeStarted = dayjs(startTime, 'HH:mm');

                const timeFinished = dayjs(endTime, 'HH:mm');

                // combine the date and time objects
                const startDateTime = date.set('hour', timeStarted.hour()).set('minute', timeStarted.minute()).set('second', timeStarted.second());
                const s = dayjs(startDateTime).toDate()

                // combine the date and time objects
                const finishDateTime = date.set('hour', timeFinished.hour()).set('minute', timeFinished.minute()).set('second', timeFinished.second());
                const e = dayjs(finishDateTime).toDate()
                const title = `${params.row?.doctorProfile?.firstName} ${params.row?.doctorProfile?.lastName}`
                setShow(true)
                setEditValues({
                  start: s,
                  end: e,
                  title: title,
                  patientProfile: params.row?.doctorProfile,
                  _id: params.row?._id,
                  createdDate: params.row?.createdDate,
                  patientId: params.row?.patientId,
                  total: total,
                  currencySymbol: currencySymbol,
                  invoiceId: params.row?.invoiceId,
                  doctorPaymentStatus: params.row?.doctorPaymentStatus
                })
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
  ].filter(Boolean)

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
        issueDay: dayjs(row.createdAt).format('DD/MMM/YYYY'),
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
        selectedDate: row?.selectedDate,
        timeSlot: row?.timeSlot,
        paymentType: row?.paymentType,
        paymentToken: row?.paymentToken,
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }
  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintInvoiceComponent ref={printRef} printProps={printProps} />}
      </iframe>
      <div className="tab-content pt-0" style={muiVar}>
        {
          isLoading ?
            <CircleToBlockLoading color={theme.palette.primary.main} size="small"
              style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} /> :
            <>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="card-title float-start">Appointment Records</h4>
                  </div>
                  <div className="card-body ">
                    <div className="card card-table mb-0">
                      <div className="card-body">
                        <div className="table-responsive" style={{ height: 480, width: '100%' }}>
                          <DataGrid
                            experimentalFeatures={{ ariaV7: true }}
                            slots={{
                              noResultsOverlay: CustomNoRowsOverlay,
                              noRowsOverlay: CustomNoRowsOverlay,
                              pagination: CustomPagination,
                            }}
                            slotProps={{
                              baseCheckbox: {
                                name: 'row-checkbox',
                              },
                              pagination: { //@ts-ignore
                                handleChangePage: handleChangeAppointmentPage,
                                handleChangeRowsPerPage: handleChangeAppointmentRowsPerPage,
                                count: rowAppointmentCount,
                                SelectProps: {
                                  inputProps: {
                                    id: 'pagination-select',
                                    name: 'pagination-select',
                                  },
                                },
                              },
                            }}
                            rowHeight={screen.height / 15.2}
                            rows={appointmentRecords}
                            getRowId={(params) => params._id || ''}
                            rowCount={rowAppointmentCount}
                            ref={appointmentRef}
                            columns={appointmentColumns}
                            paginationModel={appointmentPaginationModel}
                            pageSizeOptions={[5, 10]}
                            disableRowSelectionOnClick
                            onPaginationModelChange={setAppointmentPaginationModel}
                            showCellVerticalBorder
                            showColumnVerticalBorder
                            sx={{
                              ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                                "marginTop": "1em",
                                "marginBottom": "1em"
                              },
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
                              "& .MuiDataGrid-footerContainer": {
                                [theme.breakpoints.only("xs")]: {
                                  justifyContent: 'center',
                                  mb: 2
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}?random=${new Date().getTime()}`} >
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
                  <div className="row">
                    <div className="col-md-6">
                      <span className="title">#{editValues?._id}</span>
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