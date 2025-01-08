/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, ReactNode, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridValueFormatterParams, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Sort from '@mui/icons-material/Sort';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from './ScheduleTiming';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { patient_profile } from '@/public/assets/imagepath';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';


type InputProps = {
  justifycontent: string
}
export const StyledBox = styled(Container)<InputProps>(({ theme, justifycontent }) => ({
  border: '2px solid ',
  // marginTop: -10,
  borderColor: theme.palette.secondary.main,
  borderRadius: 5,
  marginBottom: 5,
  minHeight: `60px`,
  minWidth: '100%',
  display: 'flex',
  justifyContent: justifycontent,
  alignItems: 'center',
  '--animate-duration': '1s',
  '--animate-delay': '1s'
}));

export interface BankType {
  _id?: string;
  userId: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
  BICcode: string;
  createdAt?: string;
  updateAt?: string;
}
const initialState: BankType = {
  userId: "",
  bankName: "",
  branchName: '',
  accountNumber: "",
  accountName: "",
  swiftCode: "",
  BICcode: "",
  createdAt: "",
  updateAt: "",
}


export interface TotalsType {
  AwaitingRequest?: {
    totalAmount: number;
    totalPrice: number;
    totalBookingsFeePrice: number;
    totalBookings: number;
  };
  Pending?: {
    totalAmount: number;
    totalPrice: number;
    totalBookingsFeePrice: number;
    totalBookings: number;
  };
  Paid?: {
    totalAmount: number;
    totalPrice: number;
    totalBookingsFeePrice: number;
    totalBookings: number;
  };
}

interface AnchorType {
  0: null | HTMLButtonElement;
  field: string;
}
const Accounts: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const [value, setValue] = useState('1');
  const theme = useTheme();
  const grdiRef = useRef<any>(null)
  const [edit, setEdit] = useState(false);
  const [req, setReq] = useState(false);
  const [bankData, setBankData] = useState<BankType>()
  const dispatch = useDispatch();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRows] = useState<AppointmentReservationType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [totals, setTotals] = useState<TotalsType>();
  const perPage = 5;
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: perPage,
    skip: 0,
    filter: "All"
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updateStatusArray, setUpdateStatusArray] = useState<GridRowId[]>([])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
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
      field: 'price',
      headerName: 'Price',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Stack >
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(params?.row?.timeSlot?.price)}</span>
            <span className="d-block">
              <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
            </span>
          </Stack>
        )
      }
    },
    {
      field: 'bookingsFee',
      headerName: 'Bookings Fee',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Stack >
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
              params?.row?.timeSlot?.bookingsFeePrice
            )}</span>
            <span className="d-block">
              <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
            </span>
          </Stack>
        )
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
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
      width: 200,
      align: 'left',
      headerAlign: 'center',
      valueFormatter(params: GridValueFormatterParams) {
        const { value } = params
        return `${value.gender} ${value?.firstName} ${value?.lastName}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row, formattedValue } = params;
        const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
        const online = row?.patientProfile?.online || false;
        return (
          <>
            <Link aria-label='link' className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`} target='_blank'>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={online}
              >
                <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                  <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Stack>
              <Link aria-label='link' href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}
                target='_blank'
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
              <Link href={`/doctors/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'paymentDate',
      headerName: `Payment Date`,
      align: 'center',
      width: 150,
      headerAlign: 'center',
      valueGetter(params: GridRenderCellParams) {
        const { value } = params
        return value == '' ? '====' : dayjs(value).format('DD MMM YYYY  HH:mm')
      }
    },
    {
      field: 'paymentType',
      headerName: `Payment status`,
      width: 180,
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



  const {
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    register,
    setValue: setFormValue
  } = useForm({
    defaultValues: {
      ...initialState,
    }
  })

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      let userId = userProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket.current.emit('getUserBankDataWithReservation', { userId: userId, ...dataGridFilters })
        homeSocket.current.once('getUserBankDataWithReservationReturn', (msg: {
          status: number,
          message?: string,
          bankWithReservations: {
            status: number,
            message?: string,
            bankData: BankType[],
            reservationsAndTotals: {
              reservations: AppointmentReservationType[],
              totalReservations: number,
              totals: TotalsType
            }[]
          }
        }) => {
          const { status, message, bankWithReservations } = msg;
          if (status !== 200) {
            toast.error(message || `Error ${status} find Reservation`, {
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
            if (bankWithReservations.status !== 200) {
              toast.error(bankWithReservations.message || `Error ${bankWithReservations.status} find Doctor`, {
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
              const { bankData, reservationsAndTotals } = bankWithReservations;
              if (bankData && bankData?.length !== 0) {
                setBankData({ ...bankData[0] })
              }
              if (reservationsAndTotals && reservationsAndTotals?.length !== 0) {
                const { reservations, totalReservations, totals } = reservationsAndTotals[0];
                setRowCount(totalReservations);
                setTotals(totals)
                setRows(() => {
                  let newState: AppointmentReservationType[] = []
                  if (reservations && reservations.length > 0) {
                    newState = [...reservations];
                  }
                  return newState
                })
              }

            }
            homeSocket.current.once(`updateGetUserBankDataWithReservation`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }
        })
      }
    }
    return () => {
      isActive = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, userProfile?._id, reload, dataGridFilters])

  const onSubmitEditBank = (data: BankType) => {
    dispatch(updateHomeFormSubmit(true))
    delete data.createdAt
    delete data.updateAt
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('bankUpdate', data);
      homeSocket.current.once('bankUpdateReturn', (msg: { status: number, message?: string, bankData?: BankType }) => {
        const { status, message, bankData } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} udpate Bank`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          if (bankData) {
            setBankData(bankData)
            dispatch(updateHomeFormSubmit(false))
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setEdit(false)
            }, 500);
          }
        }
      })
    }
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
        filter: prevState.filter
      }
    })
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {

    setDataGridFilters((prevState) => {
      return {
        limit: perPage !== paginationModel.pageSize ? paginationModel.pageSize : perPage * value,
        skip: (value - 1) * perPage,
        filter: prevState.filter
      }
    })
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }

  const updateAppointmentRequestSubmit = () => {
    if (homeSocket.current) {
      let userId = userProfile?._id
      homeSocket.current.emit(`updateReservationAndTimsSlotStatus`, { userId: userId, updateStatusArray, newStatus: 'Pending' })
      homeSocket.current.once('updateReservationAndTimsSlotStatusReturn', (msg: { status: number, message: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} find Doctor`, {
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
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setReq(false)
          }, 500);
          setUpdateStatusArray([])
          setReload(!reload)
          toast.info(message, {
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
        }
      })
    }

  }


  return (
    <Fragment>

      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        {isLoading ?
          <CircleToBlockLoading color={theme.palette.primary.main} size="small"
            style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} />
          : <>
            <div className="row">
              <div className="col-lg-5 d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-sm-6">
                        <h3 className="card-title">Account</h3>
                      </div>
                      <div className="col-sm-6">
                        <div className="text-end">
                          <Link
                            title="Edit Details"
                            className="btn view-btn"
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setFormValue('userId', userProfile?._id!)
                              if (typeof bankData !== 'undefined') {
                                const profileEntries = Object.entries(bankData) as [keyof BankType, BankType[keyof BankType]][]; // Explicitly type the entries

                                profileEntries.forEach(([key, value]) => {
                                  setFormValue(key, value); // Ensure key is passed as a string
                                });
                              }

                              setEdit(true)
                            }}
                          >
                            <i className="fas fa-pencil" /> Edit Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="profile-view-bottom">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Bank Name</div>
                            <div className="text" id="bank_name">
                              {bankData?.bankName || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Branch Name</div>
                            <div className="text" id="branch_name">
                              {bankData?.branchName || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Account Number</div>
                            <div className="text" id="account_no">
                              {bankData?.accountNumber || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Account Name</div>
                            <div className="text" id="account_name">
                              {bankData?.accountName || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Swift Code</div>
                            <div className="text" id="account_name">
                              {bankData?.swiftCode || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Bank Identifier Codes</div>
                            <div className="text" id="account_name">
                              {bankData?.BICcode || '---'}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Created Date</div>
                            <div className="text" id="account_name">
                              {!bankData ? '---' : dayjs(bankData?.createdAt).format('YYYY MM DD HH:mm')}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="info-list">
                            <div className="title">Last Update</div>
                            <div className="text" id="account_name">
                              {!bankData ? '---' : dayjs(bankData?.updateAt).format('YYYY MM DD HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 d-flex">
                <div className="card flex-fill">
                  <div className="card-body">
                    <div className="row">
                      <Divider variant="middle" sx={{ m: 2 }}>
                        <Typography variant="body1">
                          Awaiting Request
                          {
                            `(${!!totals?.AwaitingRequest ?
                              formatNumberWithCommas(String(totals?.AwaitingRequest?.totalBookings)) : `0`} booking${totals?.AwaitingRequest?.totalBookings == 1 ? '' : 's'})`
                          }
                        </Typography>
                      </Divider>
                      <div className="col-lg-4">
                        <div className="account-card bg-success-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.AwaitingRequest ?
                                formatNumberWithCommas(String(totals?.AwaitingRequest?.totalAmount)) : `0.00`
                            }
                          </span> Total Sale
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-warning-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.AwaitingRequest ?
                                formatNumberWithCommas(String(totals?.AwaitingRequest?.totalPrice)) : `0.00`
                            }
                          </span> Total Doctor Fee
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-purple-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.AwaitingRequest ?
                                formatNumberWithCommas(String(totals?.AwaitingRequest?.totalBookingsFeePrice)) : `0.00`
                            }
                          </span> Total Bookings Fee Price
                        </div>
                      </div>
                      <Divider variant="middle" sx={{ m: 2 }}>
                        <Typography variant="body1">
                          Pending
                          {
                            `(${!!totals?.Pending ?
                              formatNumberWithCommas(String(totals?.Pending?.totalBookings)) : `0`} booking${totals?.Pending?.totalBookings == 1 ? '' : 's'})`
                          }
                        </Typography>
                      </Divider>
                      <div className="col-lg-4">
                        <div className="account-card bg-success-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Pending ?
                                formatNumberWithCommas(String(totals?.Pending?.totalAmount)) : `0.00`
                            }
                          </span> Total Sale
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-warning-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Pending ?
                                formatNumberWithCommas(String(totals?.Pending?.totalPrice)) : `0.00`
                            }
                          </span> Total Doctor Fee
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-purple-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Pending ?
                                formatNumberWithCommas(String(totals?.Pending?.totalBookingsFeePrice)) : `0.00`
                            }
                          </span> Total Bookings Fee Price
                        </div>
                      </div>
                      <Divider variant="middle" sx={{ m: 2 }}>
                        <Typography variant="body1">
                          Paid
                          {
                            `(${!!totals?.Paid ?
                              formatNumberWithCommas(String(totals?.Paid?.totalBookings)) : `0`} booking${totals?.Paid?.totalBookings == 1 ? '' : 's'})`
                          }
                        </Typography>
                      </Divider>
                      <div className="col-lg-4">
                        <div className="account-card bg-success-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Paid ?
                                formatNumberWithCommas(String(totals?.Paid?.totalAmount)) : `0.00`
                            }
                          </span> Total Sale
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-warning-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Paid ?
                                formatNumberWithCommas(String(totals?.Paid?.totalPrice)) : `0.00`
                            }
                          </span> Total Doctor Fee
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="account-card bg-purple-light">
                          <span>{userProfile?.currency[0]?.currency_symbol} {" "}
                            {
                              !!totals?.Paid ?
                                formatNumberWithCommas(String(totals?.Paid?.totalBookingsFeePrice)) : `0.00`
                            }
                          </span> Total Bookings Fee Price
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" >
              <div className="col-sm-12">
                <div className="card">
                  <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList aria-label="lab API tabs example" textColor="secondary"
                          indicatorColor="secondary" >
                          <Tab label={`Accounts Total: ${rowCount}`} value="1" sx={{ minWidth: '100%' }} />
                          {/* <Tab label="Patients Refund Request" value="2" sx={{ minWidth: '50%' }} /> */}
                        </TabList>
                      </Box>
                      <TabPanel value="1">
                        <StyledBox justifycontent={'space-between'}>

                          <div className="text-center" >
                            {updateStatusArray.length !== 0 ? <Link
                              href=""
                              className="btn btn-primary request_btn"
                              onClick={(e) => {
                                e.preventDefault();
                                setReq(true)
                              }}
                            >
                              Payment Request
                            </Link> : `Select passed appointments to send payment request.`}
                          </div>
                          <Tooltip title="Sort by" arrow placement="bottom">
                            <IconButton onClick={handleClick}>
                              <Sort fontSize="small" sx={{ ':hover': { color: theme.palette.primary.main } }} />
                            </IconButton>
                          </Tooltip>

                          {/* Popover with List */}
                          <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top', // Align the popover above the anchor
                              horizontal: 'right',
                            }}
                          >
                            <List>
                              {['All', 'Awaiting Request', 'Paid', 'Pending'].map((status, index) => (
                                <div key={index}>
                                  <ListItemButton
                                    selected={status == dataGridFilters.filter}
                                    onClick={() => {
                                      setDataGridFilters((prevState) => {
                                        return {
                                          ...prevState,
                                          filter: status
                                        }
                                      })
                                      handleClose()
                                    }}>
                                    <ListItemText primary={status} />
                                  </ListItemButton>
                                  <Divider />
                                </div>
                              ))}
                            </List>
                          </Popover>
                        </StyledBox>
                        <div className="card card-table mb-0">
                          <div className="card-body" >
                            <div className="table-responsive" style={{ height: 480, width: '100%' }}>

                              <DataGrid
                                paginationMode='server'
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
                                checkboxSelection
                                isRowSelectable={(params) => {
                                  const selectedDate = params.row.selectedDate;
                                  const timeSlot = params.row.timeSlot.period;
                                  if (params.row.doctorPaymentStatus !== "Awaiting Request") {
                                    return false;
                                  } else {
                                    return !disablePastTime(selectedDate, timeSlot);
                                    return true;
                                  }
                                }}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                  const { page, pageSize } = paginationModel
                                  let start = page == 0 ? page : page * pageSize
                                  let end = pageSize * (1 + page)
                                  let currrenPageId = newRowSelectionModel.slice(start, end)
                                  setUpdateStatusArray(() => {
                                    let newState = currrenPageId.length > 0 ? [...currrenPageId] : [...newRowSelectionModel]
                                    return newState
                                  });
                                }}
                                rowSelectionModel={updateStatusArray}
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
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </TabContext>
                  </Box>
                </div>
              </div>
            </div>
          </>}
      </div>

      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setEdit(false)
            reset();
            clearErrors('branchName');
          }, 500);

        }}
        aria-labelledby="edit_invoice_details"
        open={edit}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setEdit(false)

              reset();
              clearErrors();
            }, 500);
          }}>
          Account Details
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>
          <form noValidate onSubmit={handleSubmit(onSubmitEditBank)}>
            <div className="row form-row">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    required
                    size="small"
                    id="bankName"
                    label="Bank Name"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.bankName == undefined ? false : true}
                    helperText={errors.bankName && errors['bankName']['message'] as ReactNode}
                    {...register("bankName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    required
                    size="small"
                    id="branchName"
                    label="Branch Name"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.branchName == undefined ? false : true}
                    helperText={errors.branchName && errors['branchName']['message'] as ReactNode}
                    {...register("branchName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    required
                    size="small"
                    id="accountNumber"
                    label="Account Number"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    onKeyDown={(e) => {
                      const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'Tab']
                      if (!allowKeys.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    error={errors.accountNumber == undefined ? false : true}
                    helperText={errors.accountNumber && errors['accountNumber']['message'] as ReactNode}
                    {...register("accountNumber", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    required
                    size="small"
                    id="accountName"
                    label="Account Name"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.accountName == undefined ? false : true}
                    helperText={errors.accountName && errors['accountName']['message'] as ReactNode}
                    {...register("accountName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    size="small"
                    id="swiftCode"
                    label="Swift code"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    {...register("swiftCode")}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    size="small"
                    id="BICcode"
                    label="BIC code"
                    variant='outlined'
                    fullWidth
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    {...register("BICcode")}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} >
              Submit
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
      {req && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setReq(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={req}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setReq(false)
            }, 500);
          }}>
          Payment Request
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>
          <form noValidate>
            {/* <div className="row form-row">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="requestAmount"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Request Amount`}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="description"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Description (Optional)`}
                    multiline
                    minRows={3}
                  />
                </div>
              </div>
            </div> */}
            <p>{`Send ${updateStatusArray.length} appointment${updateStatusArray.length == 1 ? '' : 's'} for Payment request.`}</p>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} onClick={(e) => {
              e.preventDefault();
              updateAppointmentRequestSubmit()
            }}>
              Submit
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
    </Fragment>
  )
});

export const disablePastTime = (date: string, time: string) => {

  // Extract the start time from the timeSlot
  const startTime = time.split(' - ')[0]; // e.g., "10:30"

  // Merge the date and time into a single string
  const dateTimeString = `${date} ${startTime}`; // e.g., "24 Jan 2025 10:30"

  // Parse the merged string into a Date object
  const dateTime = new Date(dateTimeString);

  // Get the current date and time
  const now = new Date();

  // Compare the merged date-time with the current date-time
  const isFuture = dateTime > now;

  // Return whether the row is selectable (true if the date-time is in the future)
  return isFuture;
}


export default Accounts;