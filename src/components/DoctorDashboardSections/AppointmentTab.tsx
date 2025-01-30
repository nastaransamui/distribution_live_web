/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid';
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
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import Pagination from '@mui/material/Pagination';
import { StyledBadge, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from './ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

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

const perPage = 5
const AppointmentTab: FC<PropType> = (({ isToday, total, setTotal, isLoading, setIsLoading }) => {
  const theme = useTheme();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: 5,
    skip: 0
  });


  const { bounce } = useScssVar();




  const [reload, setReload] = useState<boolean>(false)
  const [dashAppointmentData, setDashAppointmentData] = useState<AppointmentReservationExtendType[]>([])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters({
      limit: perPage * value,
      skip: (value - 1) * perPage
    })
  };
  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let reservationsIdArray = userProfile?.reservations_id
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.reservations_id && userProfile?.reservations_id.length !== 0) {
        homeSocket.current.emit('getDocDashAppointments', { userId, reservationsIdArray, ...dataGridFilters, isToday })
        homeSocket.current.once('getDocDashAppointmentsReturn', (msg:
          { status: number, docDashAppointments: { reservations: AppointmentReservationExtendType[], totalCount: { count: number }[] }[], message?: string }) => {
          const { status, docDashAppointments, message } = msg;

          const { reservations, totalCount } = docDashAppointments[0]
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
            if (reservations.length !== 0) {
              setDashAppointmentData(() => {
                let newState = []
                newState = [...reservations]
                return newState
              })
            }
            if (totalCount.length !== 0) {
              const { count } = totalCount[0]
              setTotal(count)
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
  }, [homeSocket, dataGridFilters, reload, isToday, userProfile])

  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }} />
  )

  const appointmentComponents = () => {

    return (
      <DataGrid
        autoHeight
        hideFooter
        getRowId={(params) => params._id}
        rowHeight={screen.height / 15.2}
        rows={dashAppointmentData}
        columns={columns}
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 20,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'startDate',
      headerName: 'From - To Period',
      width: 250,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      valueFormatter(params: GridValueFormatterParams) {
        const { id, api } = params
        return `From: ${api.getCellValue(id as string, 'startDate')} To: ${api.getCellValue(id as string, 'finishDate')}`
      },
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
      field: 'selectedDate',
      headerName: `Apointment Time`,
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
      field: 'patientProfile',
      headerName: `Patient Name`,
      width: 210,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      valueFormatter(params: GridValueFormatterParams) {
        const { value } = params
        return `${value.gender} ${value.gender !== '' ? '.' : ''} ${value?.firstName} ${value?.lastName}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row, formattedValue } = params;
        const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
        const online = row?.patientProfile?.online || false
        return (
          <>
            <Link className="avatar mx-2" aria-label='my patient' href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={online}
              >
                <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                  <img src={patient_profile} alt="" className="avatar" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Stack>
              <Link aria-label='my patient' href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
              <span>{row.invoiceId}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'paymentType',
      headerName: `Payment status`,
      width: 120,
      flex: 1,
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
  ]

  return (
    <Fragment>
      {isLoading ?
        <LoadingCompoenent /> :
        dashAppointmentData.length !== 0 ?
          <>
            <div className="appointments">{appointmentComponents()}</div>

            <Pagination
              showFirstButton
              showLastButton
              hideNextButton
              hidePrevButton
              boundaryCount={1}
              variant="outlined"
              color="secondary"
              count={Math.ceil(total / perPage)}
              page={dataGridFilters.limit / perPage}
              sx={{
                justifyContent: 'center',
                display: 'flex',
                minHeight: 70
              }}
              onChange={handlePageChange}
            /></> :
          <div className='card' style={{ minHeight: '90vh', justifyContent: 'center' }}>
            <CustomNoRowsOverlay text='No Recent  appointment' />
          </div>}

    </Fragment>
  )
})

export default AppointmentTab;