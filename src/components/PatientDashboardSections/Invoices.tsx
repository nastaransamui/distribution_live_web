/* eslint-disable @next/next/no-img-element */
import { FC, forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { doctors_profile, logo, patient_profile, } from '@/public/assets/imagepath';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { AppointmentReservationType } from '@/components/DoctorsSections/CheckOut/PaymentSuccess';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';

import Avatar from '@mui/material/Avatar';
import CustomPagination from '../shared/CustomPagination';
import { useReactToPrint } from 'react-to-print';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
export interface AppointmentReservationExtendType extends AppointmentReservationType {
  doctorProfile: DoctorProfileType;
  patientStatus: {
    online: boolean;
    lastLogin: {
      date: Date;
      ipAddr: string;
      userAgent: string;
    };

  }
}

interface PrintProps {
  printProps: any
}
export const PrintInvoiceComponent = forwardRef<HTMLDivElement, PrintProps>((props, ref) => {
  const { muiVar } = useScssVar();
  const { printProps } = props
  const {
    invoiceId,
    issueDay,
    drName,
    drAddress,
    drCity,
    drState,
    drCountry,
    paName,
    paAddress,
    paCity,
    paState,
    paCountry,
    doctorPaymentStatus,
    selectedDate,
    timeSlot,
    paymentType,
    paymentToken,
  } = printProps

  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  return (
    <div ref={ref} >
      <Fragment >
        {/*  minHeight: '3508px' */}
        <div className="content" style={muiVar}>
          <div className="container">
            <div className="row" >
              <div className="col-lg-8 offset-lg-2">
                <div className="invoice-content" style={{
                  background: '#fff',
                  fontSize: '16px',
                  width: '100%'
                }}>
                  <div className="invoice-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                      <div className="col-md-4">
                        <div className="invoice-logo">
                          <img src={logo} alt="logo" />
                        </div>
                      </div>
                      <div className="col-md-4"></div>
                      <div className="col-md-4">
                        <p className="invoice-details" style={{ color: '#000' }}>
                          <strong>Invoice Id:</strong> {invoiceId} <br />
                          <strong>Issued:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {issueDay}<br />
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Invoice Item */}
                  <div className="invoice-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="col-md-4">
                        <div className="invoice-info">
                          <strong className="customer-text">Doctor information</strong>
                          <p className="invoice-details invoice-details-two" style={{ color: '#000' }}>
                            Name: {drName} <br />
                            Address: {`${drAddress.trim().length === 0 ? '---' : drAddress}`}
                            <br />
                            City: {`${drCity.trim().length === 0 ? '---' : drCity}`}
                            <br />
                            State: {`${drState.trim().length === 0 ? '---' : drState}`}
                            <br />
                            Country: {`${drCountry.trim().length === 0 ? '---' : drCountry}`}
                            <br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="invoice-info invoice-info2">
                          <strong className="customer-text">Patient information</strong>
                          <p className="invoice-details" style={{ color: '#000' }}>
                            Name: {paName} <br />
                            Address: {`${paAddress.trim().length === 0 ? '---' : paAddress}`}
                            <br />
                            City: {`${paCity.trim().length === 0 ? '---' : paCity}`}
                            <br />
                            State: {`${paState.trim().length === 0 ? '---' : paState}`}
                            <br />
                            Country: {`${paCountry.trim().length === 0 ? '---' : paCountry}`}
                            <br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="invoice-info invoice-info2">
                          <strong className="customer-text">Payment Method</strong>
                          <p className="invoice-details invoice-details-two" style={{ color: '#000' }}>
                            {paymentType} <br />
                            {paymentToken} <br />
                            <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-item invoice-table-wrap">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="invoice-table table table-bordered" style={{ color: '#000' }}>
                            <thead style={{ borderBottom: "none" }}>
                              <tr>
                                <th>Description</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Price</th>
                                <th className="text-end">Total</th>
                              </tr>
                            </thead>
                            <tbody style={{ borderTop: "none", }}>
                              <tr>
                                <td style={{ padding: '10px 0px', color: '#000' }}>{selectedDate} - {timeSlot?.period}</td>
                                <td className="text-center" style={{ color: '#000' }} >1</td>
                                <td className="text-center" style={{ color: '#000' }} >{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(timeSlot?.price)}</td>
                                <td className="text-end" style={{ color: '#000' }} >{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(timeSlot?.price)}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px 0px', color: '#000' }}>Booking Fee</td>
                                <td className="text-center" style={{ color: '#000' }} >1</td>
                                <td className="text-center" style={{ color: '#000' }} >{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                  timeSlot?.bookingsFeePrice
                                )}</td>
                                <td className="text-end" style={{ color: '#000' }} >{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                  timeSlot?.bookingsFeePrice
                                )}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ maxWidth: '50%' }}>
                        {userProfile?.roleName == 'doctors' ?
                          <div className="col-md-6 col-xl-6 ms-auto" style={{ minHeight: '410px', position: 'relative' }}>
                            <div style={{ left: "50px" }} className={
                              `${doctorPaymentStatus == "Awaiting Request"
                                ? "rubber_stamp_await"
                                : doctorPaymentStatus == "Paid"
                                  ? "rubber_stamp_paid" : "rubber_stamp_pendign"}
                              `}>{doctorPaymentStatus}</div>
                          </div> :
                          <div className="col-md-6 col-xl-6 ms-auto" style={{ minHeight: '350px', position: 'relative' }}></div>
                        }

                      </div>
                      <div style={{ maxWidth: '50%' }}>
                        <div className="table-responsive">
                          <table className="invoice-table-two table">
                            <tbody>
                              <tr>
                                <th>Subtotal:</th>
                                <td style={{ padding: '10px 0px', color: '#000' }}>
                                  <span>{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    timeSlot?.total
                                  )}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Discount:</th>
                                <td style={{ color: "#000" }}>
                                  <span>---</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Total Amount:</th>
                                <td style={{ padding: '10px 0px', color: '#000' }}>
                                  <span>{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    timeSlot?.total
                                  )}</span>
                                </td>
                              </tr>
                              <tr>
                                {/* {
                                  router.asPath.startsWith('/doctors') && <>
                                    <th>Total Price:</th>
                                    <td style={{ padding: '10px 0px', color: "#000" }}>
                                      <span>
                                        {currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          price
                                        )}
                                      </span>
                                    </td>
                                  </>
                                } */}
                              </tr>
                              <tr>
                                {/* {
                                  router.asPath.startsWith('/doctors') ? <>
                                    <th>Total Fee Price:</th>
                                    <td style={{ padding: '10px 0px', color: "#000" }}>
                                      <span>
                                        {currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          bookingsFeePrice
                                        )}
                                      </span>
                                    </td>
                                  </> :
                                    <>
                                      <th>Total:</th>
                                      <td style={{ padding: '10px 0px', color: "#000" }}>
                                        <span>{currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          total
                                        )}</span>
                                      </td>
                                    </>
                                } */}
                              </tr>
                              <tr>
                                {/* {
                                  router.asPath.startsWith('/doctors') && <>
                                    <th>Total:</th>
                                    <td style={{ padding: '10px 0px', color: "#000" }}>
                                      <span>{currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                        total
                                      )}</span>
                                    </td>
                                  </>
                                } */}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-md-6 col-xl-4 ms-auto" style={{
                    minHeight: `${billDetailsArray.length == 1 ? 250 :
                      billDetailsArray.length == 2 ? 250 :
                        billDetailsArray.length == 3 ? 150 :
                          billDetailsArray.length == 4 ? 115 :
                            160
                      }px`
                  }}></div> */}
                  <div className="other-info">
                    <h4>Other information</h4>
                    <p className=" mb-0" style={{ color: '#000' }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                      sed dictum ligula, cursus blandit risus. Maecenas eget metus non
                      tellus dignissim aliquam ut a ex. Maecenas sed vehicula dui, ac
                      suscipit lacus. Sed finibus leo vitae lorem interdum, eu
                      scelerisque tellus fermentum. Curabitur sit amet lacinia lorem.
                      Nullam finibus pellentesque libero.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </div>

  )
})
PrintInvoiceComponent.displayName = "PrintInvoiceComponent"

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
    const { doctorProfile } = row;
    const { firstName, lastName, country, city, state, address1, address2 } = doctorProfile
    const { gender, firstName: paFirstName, lastName: paLastName, country: paCountry,
      city: paCity, state: paState, address1: paAddress1, address2: paAddress2 } = userProfile!

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
  const columns: GridColDef[] = [
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
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      valueGetter(params: GridRenderCellParams) {
        const { value } = params;
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    {
      field: 'invoiceId',
      headerName: "Invoice No",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Link href={`/doctors/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
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
      field: 'doctorProfile',
      headerName: "Doctor",
      width: 200,
      headerAlign: 'center',
      align: 'left',
      renderCell: (data: any) => {
        const { row, } = data;
        const { doctorProfile, doctorStatus, doctorId } = row;
        const { profileImage, firstName, lastName, gender } = doctorProfile;
        const { online } = doctorStatus;
        const doctorName = `Dr.${gender !== '' ? `${gender}.` : ``} ${firstName} ${lastName}`
        return (
          <>
            <Link aria-label='profile' className=" mx-2" target='_blank' href={`/doctors/profile/${btoa(doctorId)}`} >
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
            <Stack >
              <Link aria-label='profile' target='_blank' href={`/doctors/profile/${btoa(doctorId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {doctorName}
              </Link>
              <small> {row?.doctorProfile?.specialities[0]?.specialities}</small>
            </Stack>
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
            printButtonClicked(params.row)
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
      homeSocket.current.emit('getPatientInvoices', { userId: userId, ...dataGridFilters })
      homeSocket.current.once('getPatientInvoicesReturn', (msg: { status: number, reservation: AppointmentReservationExtendType[], message?: string, totalCount: number }) => {
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
          homeSocket.current.once(`updateGetPatientInvoices`, () => {
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
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintInvoiceComponent ref={printRef} printProps={printProps} />}
      </iframe>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card card-table">
          <div className="card-body">
            <div className="table-responsive" style={{ height: 480, width: '100%' }}>
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
                    isRowSelectable={() => false}
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