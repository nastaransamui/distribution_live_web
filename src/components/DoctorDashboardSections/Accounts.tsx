/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, ReactNode, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { formatNumberWithCommas } from './ScheduleTiming';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import BeatLoader from 'react-spinners/BeatLoader';
import _ from 'lodash';



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


export interface ReservationsValueInners {
  totalAmount: number;
  totalPrice: number;
  totalBookingsFeePrice: number;
  totalBookings: number;
}
export interface BillingsValueInners {
  totalAmount: number;
  totalPrice: number;
  totalBookingsFeePrice: number;
  totalBillings: number;
}
export interface ReservationTotalsType {
  AwaitingRequest?: ReservationsValueInners;
  Pending?: ReservationsValueInners;
  Paid?: ReservationsValueInners;
  totalReservations: number;
}

export interface BillingsTotalsType {
  Pending?: BillingsValueInners;
  Paid?: BillingsValueInners;
  totalBillings: number;
}


const Accounts: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const [edit, setEdit] = useState(false);

  const [bankData, setBankData] = useState<BankType>()
  const dispatch = useDispatch();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [showBankName, setShowBankName] = useState<boolean>(false);
  const [reservationsAndTotals, setReservationsAndTotals] = useState<ReservationTotalsType>();
  const [billingsAndTotals, setBillingsAndTotals] = useState<BillingsTotalsType>();



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
        homeSocket.current.emit('getUserBankDataWithReservation', { userId: userId })
        homeSocket.current.once('getUserBankDataWithReservationReturn', (msg: {
          status: number,
          message?: string,
          bankWithReservations: {
            bankData: BankType,
            reservationsAndTotals: {
              totalReservations: number,
              totals: {
                AwaitingRequest: ReservationsValueInners,
                Paid: ReservationsValueInners,
                Pending: ReservationsValueInners
              }
            }[],
            billingsAndTotals: {
              totalBillings: number,
              totals: {
                Paid: BillingsValueInners,
                Pending: BillingsValueInners,
              }
            }[]
          }
        }) => {
          const { status, message } = msg;
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
            const { bankWithReservations } = msg;
            const { reservationsAndTotals, bankData, billingsAndTotals } = bankWithReservations;
            if (bankData) {
              setBankData({ ...bankData })
            }
            if (reservationsAndTotals && reservationsAndTotals?.length !== 0) {
              setReservationsAndTotals({
                totalReservations: reservationsAndTotals[0]?.totalReservations,
                AwaitingRequest: reservationsAndTotals[0]?.totals?.AwaitingRequest,
                Pending: reservationsAndTotals[0]?.totals?.Pending,
                Paid: reservationsAndTotals[0]?.totals?.Paid
              })
            }
            if (billingsAndTotals && billingsAndTotals?.length !== 0) {
              setBillingsAndTotals({
                totalBillings: billingsAndTotals[0]?.totalBillings,
                Paid: billingsAndTotals[0]?.totals?.Paid,
                Pending: billingsAndTotals[0]?.totals?.Pending
              })
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
  }, [homeSocket, userProfile?._id, reload,])

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


  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>

      <div className="col-md-12 col-lg-12 col-xl-12" style={muiVar}>
        {
          isLoading ?
            <BeatLoader color={theme.palette.primary.main} style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} />
            : <>
              <div className="row">
                <div className={`col-lg-12 d-flex ${isClient ? 'animate__animated animate__backInDown' : 'pre-anim-hidden'}`}>
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="row">
                        <div className="col-sm-6">
                          <h3 className="card-title">Bank Account</h3>
                          <small style={{ color: theme.palette.secondary.main }}>We Encrypt these sensative data.</small>
                          {
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowBankName(!showBankName)}

                            >
                              {showBankName ? <Visibility color='primary' /> : <VisibilityOff color='secondary' />}
                            </IconButton>
                          }
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
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Bank Name</div>
                              <div className="text" id="bank_name">
                                {bankData?.bankName ? showBankName ? bankData?.bankName : "*".repeat(bankData.bankName.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Branch Name</div>
                              <div className="text" id="branch_name">
                                {bankData?.branchName ? showBankName ? bankData?.branchName : "*".repeat(bankData.branchName.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Account Number</div>
                              <div className="text" id="account_no">
                                {bankData?.accountNumber ? showBankName ? bankData?.accountNumber : "*".repeat(bankData.accountNumber.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Account Name</div>
                              <div className="text" id="account_name">
                                {bankData?.accountName ? showBankName ? bankData?.accountName : "*".repeat(bankData.accountName.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Swift Code</div>
                              <div className="text" id="account_name">
                                {bankData?.swiftCode ? showBankName ? bankData?.swiftCode : "*".repeat(bankData.swiftCode.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Bank Identifier Codes</div>
                              <div className="text" id="account_name">
                                {bankData?.BICcode ? showBankName ? bankData?.BICcode : "*".repeat(bankData.BICcode.length) : '---'}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Created Date</div>
                              <div className="text" id="account_name">
                                {!bankData ? '---' : _.isEmpty(bankData) ? '---' : dayjs(bankData?.createdAt).format('YYYY MM DD HH:mm')}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="info-list">
                              <div className="title">Last Update</div>
                              <div className="text" id="account_name">
                                {!bankData ? '---' : _.isEmpty(bankData) ? '---' : dayjs(bankData?.updateAt).format('YYYY MM DD HH:mm')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`col-lg-12 d-flex ${isClient ? 'animate__animated animate__zoomInDown' : 'pre-anim-hidden'}`}>
                  <div className="card flex-fill">
                    <div className="card-header" style={{ padding: '1.2rem 1.5rem' }}>
                      <div className="row">
                        <div className="col-sm-12">
                          <h3 className="card-title">
                            {
                              reservationsAndTotals?.totalReservations !== 0 ?
                                `Total Reservations ${reservationsAndTotals?.totalReservations}` :
                                'No Reservations Yet'
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <Divider variant="middle" sx={{ m: 2 }}>
                          <Typography variant="body1">
                            Awaiting Request
                            {
                              `(${!!reservationsAndTotals?.AwaitingRequest ?
                                formatNumberWithCommas(
                                  String(reservationsAndTotals?.AwaitingRequest?.totalBookings))
                                : `0`} booking${reservationsAndTotals?.AwaitingRequest?.totalBookings == 1 ? '' : 's'})`
                            }
                          </Typography>
                        </Divider>
                        <div className="col-lg-4">
                          <div className="account-card bg-success-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.AwaitingRequest ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.AwaitingRequest?.totalAmount)) : `0.00`
                              }
                            </span> Total Sale
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-warning-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.AwaitingRequest ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.AwaitingRequest?.totalPrice)) : `0.00`
                              }
                            </span> Total Doctor Fee
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-purple-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.AwaitingRequest ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.AwaitingRequest?.totalBookingsFeePrice)) : `0.00`
                              }
                            </span> Total Bookings Fee Price
                          </div>
                        </div>
                        <Divider variant="middle" sx={{ m: 2 }}>
                          <Typography variant="body1">
                            Pending
                            {
                              `(${!!reservationsAndTotals?.Pending ?
                                formatNumberWithCommas(String(reservationsAndTotals?.Pending?.totalBookings)) : `0`} booking${reservationsAndTotals?.Pending?.totalBookings == 1 ? '' : 's'})`
                            }
                          </Typography>
                        </Divider>
                        <div className="col-lg-4">
                          <div className="account-card bg-success-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Pending?.totalAmount)) : `0.00`
                              }
                            </span> Total Sale
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-warning-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Pending?.totalPrice)) : `0.00`
                              }
                            </span> Total Doctor Fee
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-purple-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Pending?.totalBookingsFeePrice)) : `0.00`
                              }
                            </span> Total Bookings Fee Price
                          </div>
                        </div>
                        <Divider variant="middle" sx={{ m: 2 }}>
                          <Typography variant="body1">
                            Paid
                            {
                              `(${!!reservationsAndTotals?.Paid ?
                                formatNumberWithCommas(String(reservationsAndTotals?.Paid?.totalBookings)) : `0`} booking${reservationsAndTotals?.Paid?.totalBookings == 1 ? '' : 's'})`
                            }
                          </Typography>
                        </Divider>
                        <div className="col-lg-4">
                          <div className="account-card bg-success-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Paid?.totalAmount)) : `0.00`
                              }
                            </span> Total Sale
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-warning-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Paid?.totalPrice)) : `0.00`
                              }
                            </span> Total Doctor Fee
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-purple-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!reservationsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(reservationsAndTotals?.Paid?.totalBookingsFeePrice)) : `0.00`
                              }
                            </span> Total Bookings Fee Price
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className={`col-lg-12 d-flex ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
                  <div className="card flex-fill">
                    <div className="card-header" style={{ padding: '1.2rem 1.5rem' }}>
                      <div className="row">
                        <div className="col-sm-12">
                          <h3 className="card-title">
                            {
                              billingsAndTotals?.totalBillings !== 0 ?
                                `Total: Bills ${billingsAndTotals?.totalBillings}` :
                                "No Bill Yet"
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <Divider variant="middle" sx={{ m: 2 }}>
                          <Typography variant="body1">
                            Pending
                            {
                              !!billingsAndTotals?.Pending && `( ${billingsAndTotals?.Pending?.totalBillings} Bills)`
                            }

                          </Typography>
                        </Divider>
                        <div className="col-lg-4">
                          <div className="account-card bg-success-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Pending?.totalAmount)) : `0.00`
                              }
                            </span> Total Sale
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-warning-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Pending?.totalPrice)) : `0.00`
                              }
                            </span>Total Doctor Fee
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-purple-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Pending ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Pending?.totalBookingsFeePrice)) : `0.00`
                              }
                            </span>Total Bookings Fee Price
                          </div>
                        </div>
                        <Divider variant="middle" sx={{ m: 2 }}>
                          <Typography variant="body1">
                            Paid
                            {
                              !!billingsAndTotals?.Paid && `(${billingsAndTotals?.Paid?.totalBillings} Bookings)`
                            }
                          </Typography>
                        </Divider>
                        <div className="col-lg-4">
                          <div className="account-card bg-success-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Paid?.totalAmount)) : `0.00`
                              }
                            </span>Total Sale
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-warning-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Paid?.totalPrice)) : `0.00`
                              }
                            </span> Total Doctor Fee
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="account-card bg-purple-light">
                            <span>{userDoctorProfile?.currency[0]?.currency_symbol} {" "}
                              {
                                !!billingsAndTotals?.Paid ?
                                  formatNumberWithCommas(String(billingsAndTotals?.Paid?.totalBookingsFeePrice)) : `0.00`
                              }
                            </span> Total Bookings Fee Price
                          </div>
                        </div>

                      </div>
                    </div>
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

    </Fragment>
  )
});



export default Accounts;