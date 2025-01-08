/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DoctThumb2, DoctThumb8, DoctThumb9, DoctThumb10, doctors_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import { PatientSidebarDoctorTypes } from '../DoctorDashboardSections/PatientProfileTabs';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import { patient_profile } from '@/public/assets/imagepath';
import Typography from '@mui/material/Typography';
import { DialogContent } from '@mui/material';
//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { StyledBadge, formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import Pagination from '@mui/material/Pagination';
import { DoctorPatientInitialLimitsAndSkipsTypes } from '../DoctorPatientProfile/DoctorPatientProfile';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import { EditValueType } from '../DoctorDashboardSections/AvailableTiming';

const perPage = 5
const PatientAppointment: FC<PatientSidebarDoctorTypes> = (({ userType, doctorPatientProfile, setDataGridFilters, dataGridFilters, isMobile }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();
  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '70vh'
      }} />
  )



  const columns: GridColDef[] = useMemo(() => {
    return [
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
                <Link href={`/doctors/invoice-view/${btoa(params.id as string)}`}>{row.invoiceId}</Link></Stack>
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
        renderCell: (params) => {
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
        renderCell: (params) => {
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
      {
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
        // flex: isMobile ? 0 : 1,
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
                  router.push(`/doctors/invoice-view/${btoa(params.id as string)}`)
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
                  router.push(`/doctors/invoice-view/${btoa(params.id as string)}`)
                }}
                icon={<i className="fas fa-print"
                  style={{ color: theme.palette.secondary.main }}></i>} label="Print" />,
            ]
          }
        }
      }
    ]
  }, [router, theme.palette.primary.contrastText, theme.palette.primary.main, theme.palette.secondary.main, userType])



  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters((prevState: DoctorPatientInitialLimitsAndSkipsTypes) => {

      return {
        ...prevState,
        appointMentsLimit: perPage * value,
        appointMentsSkip: (value - 1) * perPage
      }
    })
  };

  const appointmentComponents = () => {

    return (
      <DataGrid
        autoHeight
        hideFooter
        getRowId={(params) => params._id}
        // rowHeight={typeof window == 'undefined' ? 12 : screen.height / 15.2}
        rows={doctorPatientProfile?.appointments}
        columns={columns.filter((column) => router.asPath.startsWith('/patient') ? column.field !== 'paymentType' : column)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        showCellVerticalBorder
        showColumnVerticalBorder
        slots={{
          // toolbar: CustomToolbar,
          noResultsOverlay: CustomNoRowsOverlay,
          noRowsOverlay: CustomNoRowsOverlay
        }}
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
          }
        }}
      />
    )
  }
  return (
    <Fragment>
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
              <li>
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
              </li>
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
      <div className="tab-content pt-0" style={muiVar}>
        {
          doctorPatientProfile == undefined ?
            <LoadingCompoenent /> :
            <>
              {
                doctorPatientProfile?.appointments.length !== 0 ?
                  <div className="card card-table mb-0">
                    <div className="card-body">
                      <div className="table-responsive">
                        {appointmentComponents()}
                      </div>
                      <Pagination
                        showFirstButton
                        showLastButton
                        hideNextButton
                        hidePrevButton
                        boundaryCount={1}
                        variant="outlined"
                        color="secondary"
                        count={Math.ceil(doctorPatientProfile?.reservations_id.length / perPage)}
                        page={dataGridFilters.appointMentsLimit / perPage}
                        sx={{
                          justifyContent: 'center',
                          display: 'flex',
                          minHeight: 70
                        }}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div> :
                  <div className='card' style={{ minHeight: '70vh', justifyContent: 'center' }}>
                    <CustomNoRowsOverlay text='No appointment' />
                  </div>
              }
            </>
        }
      </div>
    </Fragment>
  )
})

export default PatientAppointment;