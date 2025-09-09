/* eslint-disable @next/next/no-img-element */
import { FC, forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRenderCellParams, GridRowParams, GridColumnVisibilityModel, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { doctors_profile, logo } from '@/public/assets/imagepath';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

//liberies
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
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import { useTheme } from '@mui/material/styles';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RenderExpandableCell from '../shared/RenderExpandableCell';
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

  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

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
                                <td style={{ padding: '10px 0px', color: '#000' }}>{dayjs(selectedDate).format('DD MMM YYYY')} - {timeSlot?.period}</td>
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
                                <td style={{ padding: '10px 20px', color: '#000' }}>
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
                                <td style={{ padding: '10px 20px', color: '#000' }}>
                                  <span>{timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    timeSlot?.total
                                  )}</span>
                                </td>
                              </tr>
                              <tr>
                              </tr>
                              <tr>
                              </tr>
                              <tr>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
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

const Invoices: FC = (() => {
  const { bounce } = useScssVar();
  const theme = useTheme()
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [rows, setRows] = useState<AppointmentReservationExtendType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [reload, setReload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const perPage = 10
  const dataGridRef = useRef<any>(null)
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
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
        issueDay: dayjs(row.createdAt).format('DD MMM YYYY'),
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
        valueGetter: (params: GridRenderCellParams) => {
          return params?.row?.id
        },
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
        field: 'dayPeriod',
        headerName: 'Day time',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { value } = params
          return value?.charAt(0).toUpperCase() + value?.slice(1)
        }
      },
      {
        field: "selectedDate",
        headerName: 'ApointmentTime',
        align: 'center',
        width: 200,
        headerAlign: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row.selectedDate ? dayjs(row.selectedDate).toDate() : null;
        },
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(params?.row?.selectedDate).format(`DD MMM YYYY`)}</span>
              <span style={{ color: theme.palette.primary.main }} >{params?.row?.timeSlot?.period}</span>
            </Stack>
          )
        }

      },
      {
        field: "invoiceId",
        headerName: `Invoice Id`,
        width: 200,
        align: 'center',
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Link href={`/patient/dashboard/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
          )
        }
      },
      {
        field: 'doctorProfile.fullName',
        headerName: 'Doctor Name',
        width: 250,
        headerAlign: 'center',
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.doctorProfile.fullName
        },
        sortComparator: (v1: any, v2: any) => v1 > v2 ? -1 : 1,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage

          return (
            <>
              <Link aria-label='profile' className=" mx-2" target='_blank' href={`/doctors/profile/${btoa(row?.doctorId)}`} >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={row?.doctorStatus?.online}
                  idle={row?.doctorStatus?.lastLogin?.idle}
                >
                  <Avatar alt="" src={profileImage} />
                </StyledBadge>
              </Link>
              <Stack>
                <Link target='_blank'
                  href={`/doctors/profile/${btoa(row?.doctorId)}`}
                  style={{ color: theme.palette.secondary.main, maxWidth: '100%', minWidth: '100%' }}>
                  {`Dr. ${row?.doctorProfile?.fullName}`}
                </Link>
                <small> {row?.doctorProfile?.specialities[0]?.specialities}</small>
              </Stack>
            </>
          )
        }
      },
      {
        field: 'timeSlot.total',
        headerName: 'Amount',
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
        field: "paymentType",
        headerName: `Payment Type`,
        align: 'center',
        headerAlign: 'center',
        width: 170,
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <RenderExpandableCell {...params} />
          )
        },
      },
      {
        field: "paymentToken",
        headerName: `Payment Token`,
        align: 'center',
        headerAlign: 'center',
        width: 270,
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <RenderExpandableCell {...params} />
          )
        },
      },
      {
        field: 'paymentDate',
        headerName: 'Payment Date',
        align: 'center',
        width: 150,
        headerAlign: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter: (params: GridRenderCellParams) => {
          // If the value is empty, you might want to return a default date or null
          return params.value !== '' ? new Date(params.value) : params?.value;
        },
        // Render the cell with your desired format
        renderCell: (params: GridRenderCellParams) => {
          return params.value == "" ? "=====" : dayjs(params.value).format('DD MMM YYYY  HH:mm');
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
    let userId = userProfile?._id;
    if (isActive && homeSocket.current !== undefined) {
      homeSocket.current.emit('getPatientInvoices', { userId: userId, paginationModel, sortModel, mongoFilterModel, })
      homeSocket.current.once('getPatientInvoicesReturn', (msg: { status: number, reservation: AppointmentReservationExtendType[], message?: string, totalCount: number }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `${status} Error for Reservations Invoices`, {
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
              toast.dismiss('schedule_error')
            }
          });
        } else {
          const { reservation, totalCount } = msg;
          if (reservation.length !== 0) {
            setRows(() => {
              return reservation
            })
            setRowCount(totalCount)
          } else {
            setRowCount(0)
            setRows([])
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
  }, [homeSocket, paginationModel, sortModel, mongoFilterModel, reload])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintInvoiceComponent ref={printRef} printProps={printProps} />}
      </iframe>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
        {
          // isLoading ?
          true ?
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <Box sx={{
                    minHeight: boxMinHeight,
                    height: 'auto',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "16px",
                    marginBottom: "16px",
                    marginTop: "16px",
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                    padding: "16px",
                    transition: 'all 1s linear',

                  }} >
                    <LoadingComponent boxMinHeight={boxMinHeight} />
                  </Box>
                </div>
              </div>
            </div> :
            <div className="card">
              <div ref={dataGridRef} className="tab-content schedule-cont">
                <Box sx={{
                  height: 'auto',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "16px",
                  marginBottom: "16px",
                  marginTop: "16px",
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                  padding: "16px",
                  transition: 'all 1s linear',
                }} >
                  <Typography sx={{
                    paddingTop: "5px !important",
                    paddingBottom: "5px !important",
                  }}
                    variant='h5' align='center' gutterBottom >
                    {
                      rowCount !== 0 ?
                        `Total Invoices: ${rowCount}` :
                        `Not any Invoices yet`
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
                      paginationModel={paginationModel}
                      pageSizeOptions={[5, 10]}
                      showCellVerticalBorder
                      showColumnVerticalBorder
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
                        "& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                          marginTop: "1em",
                          marginBottom: "1em"
                        },
                        "& .MuiDataGrid-footerContainer": {
                          [theme.breakpoints.only("xs")]: {
                            justifyContent: 'center',
                            marginBottom: '2px'
                          }
                        }
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

export default Invoices;