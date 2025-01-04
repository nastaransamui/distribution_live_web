/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridSortModel, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { patient_profile, PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6, PatientImg7 } from '@/public/assets/imagepath';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { AppointmentReservationType } from '@/components/DoctorsSections/CheckOut/PaymentSuccess';
import { PatientProfile } from './MyPtients';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from './ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import CustomPagination from '../shared/CustomPagination';
export interface AppointmentReservationExtendType extends AppointmentReservationType {
  patientProfile: PatientProfile;
  patientStatus: {
    online: boolean;
    lastLogin: {
      date: Date;
      ipAddr: string;
      userAgent: string;
    };

  }
}
export interface ValueType {
  id: number;
  invoiceNo: string;
  patientName: string;
  patientId: string;
  patientImage: string;
  paidAmount: string;
  paidOn: string;
}
const Invoices: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [rows, setRows] = useState<AppointmentReservationExtendType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [reload, setReload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const perPage = 10
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: perPage,
    skip: 0
  });


  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters({
      limit: perPage !== paginationModel.pageSize ? paginationModel.pageSize : perPage,
      skip: (value - 1) * perPage
    })
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        limit: parseInt(event.target.value, 10),
        skip: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
  }
  const grdiRef = useRef<any>(null)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));

  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: 'dayPeriod',
      headerName: 'Day time',
      width: 90,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      valueGetter(params: GridRenderCellParams) {
        const { value } = params;
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    {
      field: 'invoiceNo',
      headerName: "Invoice No",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Link href={`/doctors/invoice-view/${btoa(row?._id!)}`}>{row._id}</Link>
          </>
        )
      },
      sortComparator: (v1: string, v2: string) => {
        // Compare the underlying values for sorting
        return v1.localeCompare(v2);
      },
      valueGetter: (data: any) => data.row._id
    },
    {
      field: 'patientProfile',
      headerName: "Patient",
      width: 200,
      headerAlign: 'center',
      align: 'left',
      renderCell: (data: any) => {
        const { row, } = data;
        const { patientProfile, patientStatus, patientId } = row;
        const { profileImage, firstName, lastName, gender } = patientProfile;
        const { online } = patientStatus;
        const patientName = `${gender !== '' ? `${gender}.` : ``} ${firstName} ${lastName}`
        return (
          <>
            <Link aria-label='profile' className=" mx-2" target='_blank' href={`/doctors/dashboard/patient-profile/${btoa(patientId)}`} >
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
            <Link aria-label='profile' target='_blank' href={`/doctors/dashboard/patient-profile/${btoa(patientId)}`}
              style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
              {patientName}
            </Link>

          </>
        )
      },
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
      field: 'paidAmount',
      headerName: "Amount",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      flex: matches ? 0 : 1,
      renderCell: (data: any) => {
        const { row } = data;
        const { timeSlot } = row;
        const { total, currencySymbol } = timeSlot;
        return (
          <>
            {`${currencySymbol} ${formatNumberWithCommas(total)}`}
          </>
        )
      }
    },
    {
      field: 'paidOn',
      headerName: "Paid On",
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdDate).format(`MMM D, YYYY H:mm A`)}</span>

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
      getActions: (params: GridRowParams) => [

        <GridActionsCellItem
          key={params.row.toString()}
          disableFocusRipple
          disableRipple
          disableTouchRipple
          onClick={() => {
            router.push(`/doctors/invoice-view/${btoa(params.row?._id!)}`)
          }}
          icon={<i className="fas fa-print"
            style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
      ]
    }
  ]


  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id;
    if (isActive && homeSocket.current !== undefined) {
      homeSocket.current.emit('getDoctorInvoices', { userId: userId, ...dataGridFilters })
      homeSocket.current.once('getDoctorInvoicesReturn', (msg: { status: number, reservation: AppointmentReservationExtendType[], message?: string, totalCount: number }) => {
        const { status, reservation, message, totalCount } = msg;
        if (status !== 200) {
          toast.error(message || `${status} Error for Slots`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            toastId: 'schedule_error',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              setIsLoading(false)
            }
          });
        } else {
          if (reservation.length !== 0) {
            setRows(() => {
              return reservation
            })
            setRowCount(totalCount)
          }
          homeSocket.current.once(`updateGetDoctorInvoices`, () => {
            setReload(!reload)
          })
          setIsLoading(false)
        }
      });
    }

    return () => {
      isActive = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataGridFilters, homeSocket, reload])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card card-table">
          <div className="card-body">
            <div className="table-responsive">
              {isLoading ? <CircleToBlockLoading color={theme.palette.primary.main} size="small"
                style={{
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }} /> :
                <>
                  <DataGrid
                    paginationMode='server'
                    experimentalFeatures={{ ariaV7: true }}
                    slots={{
                      noResultsOverlay: CustomNoRowsOverlay,
                      noRowsOverlay: CustomNoRowsOverlay,
                      pagination: CustomPagination,
                    }}
                    slotProps={{
                      pagination: { //@ts-ignore
                        handleChangePage: handleChangePage,
                        handleChangeRowsPerPage: handleChangeRowsPerPage,
                        count: rowCount,
                        SelectProps: {
                          inputProps: {
                            id: 'pagination-select',
                            name: 'pagination-select',
                          },
                        },
                      },
                    }}
                    getRowId={(params) => params._id}
                    rowHeight={screen.height / 15.2}
                    rows={rows}
                    rowCount={rowCount}
                    ref={grdiRef}
                    columns={columns}
                    paginationModel={paginationModel}

                    pageSizeOptions={[5, 10]}
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
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default Invoices;