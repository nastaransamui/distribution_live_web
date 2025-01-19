/* eslint-disable @next/next/no-img-element */
import { FC, forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { doctors_profile, logo, patient_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Edit from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import { useRouter } from 'next/router';
import { BillingDetailsArrayType, BillingType } from '../DoctorDashboardSections/AddBilling';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import CustomPagination from './CustomPagination';
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from './Dialog';
import DialogContent from '@mui/material/DialogContent';

interface PrintProps {
  printProps: any
}
export const PrintBillComponent = forwardRef<HTMLDivElement, PrintProps>((props, ref) => {
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
    billDetailsArray,
    status,
    dueDate,
    price,
    total,
    currencySymbol,
    bookingsFee,
    bookingsFeePrice,
    billKeys
  } = printProps

  const router = useRouter();
  const currentDate = dayjs();
  const isDue = status !== 'Paid' && (dayjs(dueDate).isBefore(currentDate, 'day') || dayjs(dueDate).isSame(currentDate, 'day'))
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
                          <strong>Due Date:</strong> &nbsp;&nbsp;{dayjs(dueDate).format('DD/MMM/YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Invoice Item */}
                  <div className="invoice-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
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
                      <div className="col-md-6">
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
                    </div>
                  </div>
                  <div className="invoice-item invoice-table-wrap">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="invoice-table table table-bordered" style={{ color: '#000' }}>
                            <thead style={{ borderBottom: "none" }}>
                              <tr>
                                {
                                  billKeys.filter((a: string) => {
                                    if (router.asPath.startsWith('/patient')) {
                                      return a == 'title' || a == 'total'
                                    } else {
                                      return a !== 'amount'
                                    }
                                  }).map((pres: string, index: number) => {
                                    return (
                                      <th className={index !== 0 ? "text-center" : ''} key={index}>{`${pres.charAt(0).toLocaleUpperCase()}${pres.slice(1)}`}</th>
                                    )
                                  })
                                }
                              </tr>
                            </thead>
                            <tbody style={{ borderTop: "none" }}>
                              {
                                billDetailsArray.map((a: BillingDetailsArrayType, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ color: '#000' }} >{a.title}</td>
                                      {
                                        router.asPath.startsWith('/doctors') &&
                                        <>
                                          <td style={{ color: '#000' }} className="text-center">
                                            {`${currencySymbol} ${formatNumberWithCommas(a.price?.toString()!)}`}
                                          </td>
                                          <td style={{ color: '#000' }} className="text-center">{`${a.bookingsFee} %`}</td>
                                          <td style={{ color: '#000' }} className="text-center">
                                            {`${currencySymbol} ${formatNumberWithCommas(a.bookingsFeePrice)}`}
                                          </td>
                                        </>
                                      }
                                      <td style={{ color: '#000', display: 'block', whiteSpace: 'pre' }} className="text-center">
                                        {`${currencySymbol} ${formatNumberWithCommas(a.total)}`}
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ maxWidth: '50%' }}>

                        <div style={{ top: billDetailsArray.length == 5 ? '650px' : '600px', left: '150px' }} className={
                          `${isDue
                            ? "rubber_stamp_await"
                            : status == "Paid"
                              ? "rubber_stamp_paid" : "rubber_stamp_pendign"}
                              `}>
                          {`${isDue ? `Over Due` : status}`}
                        </div>

                      </div>
                      <div style={{ maxWidth: '50%' }}>
                        <div className="table-responsive">
                          <table className="invoice-table-two table">
                            <tbody>
                              <tr>
                                {
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
                                }
                              </tr>
                              <tr>
                                {
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
                                }
                              </tr>
                              <tr>
                                {
                                  router.asPath.startsWith('/doctors') && <>
                                    <th>Total:</th>
                                    <td style={{ padding: '10px 0px', color: "#000" }}>
                                      <span>{currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                        total
                                      )}</span>
                                    </td>
                                  </>
                                }
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4 ms-auto" style={{
                    minHeight: `${billDetailsArray.length == 1 ? 250 :
                      billDetailsArray.length == 2 ? 250 :
                        billDetailsArray.length == 3 ? 150 :
                          billDetailsArray.length == 4 ? 115 :
                            160
                      }px`
                  }}></div>
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
PrintBillComponent.displayName = "PrintBillComponent"


const PatientBillingRecords: FC<{ userType: 'patient' | 'doctor', patientId?: string | undefined, doctorId?: string | undefined }> = (({ userType, patientId, doctorId }) => {
  const { muiVar, bounce } = useScssVar();

  const theme = useTheme();
  const billingRef = useRef<any>(null)
  const [billingRecords, setBillingRecords] = useState<BillingType[] | []>([])
  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowBillingCount, setRowBillingCount] = useState<number>(0)
  const perPage = 5;
  const [dataGridBillingFilters, setDataGridBillingFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [billingPaginationModel, setBillingPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
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

    const { doctorProfile, patientProfile } = row
    const { firstName, lastName, country, city, state, address1, address2 } = doctorProfile
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
        status: row?.status,
        dueDate: row?.dueDate,
        price: row?.price,
        total: row?.total,
        currencySymbol: row?.currencySymbol,
        bookingsFee: row?.bookingsFee,
        bookingsFeePrice: row?.bookingsFeePrice,
        billKeys: Object.keys(row.billDetailsArray[0]),
        billDetailsArray: row.billDetailsArray
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }

  const handleChangeBillingRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBillingPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowBillingCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowBillingCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowBillingCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridBillingFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowBillingCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowBillingCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowBillingCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        limit: parseInt(event.target.value, 10),
        skip: maximuPage <= 0 ? 0 : maximuPage
      }
    })
  };

  const handleChangeBillingPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridBillingFilters((prevState) => {
      return {
        limit: perPage !== billingPaginationModel.pageSize ? billingPaginationModel.pageSize : perPage * value,
        skip: (value - 1) * perPage,
      }
    })
    setBillingPaginationModel((prevState) => {
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
        homeSocket?.current.emit('getBillingRecord', { patientId: patientId, doctorId: doctorId, ...dataGridBillingFilters });
        homeSocket.current.once('getBillingRecordReturn', (msg: {
          status: number,
          message?: string,
          billingRecords: BillingType[],
          totalBilling: number
        }) => {
          const { status, message, billingRecords, totalBilling } = msg;
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
            setBillingRecords(billingRecords)
            setRowBillingCount(totalBilling)
            homeSocket.current.once(`updateGetBillingRecord`, () => {
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
  }, [homeSocket, patientId, reload, dataGridBillingFilters])

  const [deleteId, setDeleteId] = useState<string>()
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row._id))
    setShowDelete(true)

  }
  const deleteSubmited = () => {
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('deleteBillingRecord', { patientId: patientId, doctorId: userProfile?._id, deleteId })
      homeSocket.current.once('deleteBillingRecordReturn', (msg: { status: number, message?: string, }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} delete Billing Record`, {
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
              setShowDelete(false)
              setDeleteId('')
            }
          });
        } else {
          dispatch(updateHomeFormSubmit(false))
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setDeleteId('')
            setShowDelete(false)
          }, 500);
        }
      })
    }

  }
  const billingColumns: any[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'invoiceId',
      headerName: "Invoice No",
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <Link href={`/patient/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
        )
      }
    },
    userType == 'patient' && {
      field: 'doctorProfile',
      headerName: "Doctor Name",
      width: 200,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const profileImage = row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage
        const online = row?.doctorProfile?.online || false;

        return (
          <>
            <Link aria-label='link' className="avatar mx-2" href={`/doctors/profile/${btoa(row?.doctorId)}`} target='_blank'>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={online}
              >
                <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                  <img src={doctors_profile} alt="" className="avatar avatar-in-schedule-table" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Stack >
              <Link href={`/doctors/profile/${btoa(row?.doctorId)}`}
                target='_blank'
                style={{ marginBottom: -20, zIndex: 1 }}>
                {`Dr.${row?.doctorProfile?.fullName}`}
              </Link><br />
              <small> {row?.doctorProfile?.specialities[0]?.specialities}</small>
            </Stack>
          </>
        )
      },
    },
    userType == 'doctor' && {
      field: 'patientProfile',
      headerName: "Patient Name",
      width: 200,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
        const online = row?.patientProfile?.online || false;
        return (
          <>
            <Link aria-label='link'
              className="avatar mx-2"
              href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}
              target='_blank'>
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
            <Stack >
              <Link
                href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}
                target='_blank'
                style={{ marginBottom: -20, zIndex: 1 }}>
                {`${row?.patientProfile?.fullName}`}
              </Link><br />

            </Stack>
          </>
        )
      },
    },
    {
      field: 'total',
      headerName: "Price",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const total = params?.row?.total;
        return total ? parseFloat(total) || 0 : 0; // Ensure a numeric value
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <>
            {`${row?.currencySymbol} ` + formatNumberWithCommas(row?.total)}
          </>
        )
      }
    },
    userType == 'doctor' && {
      field: 'bookingsFee',
      headerName: "Fee",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const bookingsFee = params?.row?.bookingsFee;
        return bookingsFee ? parseFloat(bookingsFee) || 0 : 0; // Ensure a numeric value
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <>
            {`${row?.bookingsFee} %`}
          </>
        )
      }
    },
    userType == 'doctor' && {
      field: 'bookingsFeePrice',
      headerName: "Fee Price",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const bookingsFeePrice = params?.row?.bookingsFeePrice;
        return bookingsFeePrice ? parseFloat(bookingsFeePrice) || 0 : 0; // Ensure a numeric value
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <>
            {`${formatNumberWithCommas(row?.bookingsFeePrice)} ${row?.currencySymbol}`}
          </>
        )
      }
    },
    userType == 'doctor' && {
      field: 'price',
      headerName: "Net Price",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const price = params?.row?.price;
        return price ? parseFloat(price) || 0 : 0; // Ensure a numeric value
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <>
            {`${formatNumberWithCommas(row?.price)} ${row?.currencySymbol}`}
          </>
        )
      }
    },
    {
      field: 'dueDate',
      headerName: "Due Date",
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const currentDate = dayjs();
        const { row } = params;
        const isDue = row?.dueDate !== 'Paid' && (dayjs(row?.dueDate).isBefore(currentDate, 'day') || dayjs(row?.dueDate).isSame(currentDate, 'day'))

        return (
          <>
            <span className="user-name"
              style={{ justifyContent: 'center', display: 'flex', color: isDue ? 'crimson' : theme.palette.text.color }}>
              {dayjs(row.dueDate).format(`MMM D, YYYY`)}
            </span>
          </>
        )
      }
    },
    {
      field: 'billDetailsArray',
      headerName: "Items",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        const billDetailsArray = params?.row?.billDetailsArray;
        return billDetailsArray.length;
      },
      sortComparator: (v1: any, v2: any) => {
        return v1 > v2 ? -1 : 1
      },
      renderCell: (params: GridRenderCellParams) => {
        const { billDetailsArray: value } = params?.row;
        const tooltipText = value.map((obj: any) => {
          // Map over each key-value pair in the object
          const formattedEntries = Object.entries(obj)
            .filter(([key]) => userType == 'patient' ? key === 'title' || key === 'total' : key) // Filter for only 'title' and 'total'
            .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`)
            .join("\n"); // Join each key-value pair with a newline

          // Add a separator after each object
          return formattedEntries ? `${formattedEntries}\n------------------------------------` : '';
        }).join("\n\n");

        return (
          <>
            {value &&
              value.length > 0 ?
              <>
                <Tooltip arrow title={tooltipText} followCursor>
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {`${value.length} Item${value?.length <= 1 ? '' : 's'}`}

                  </span>
                </Tooltip>
              </> :
              <>
                <span style={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                  --
                </span>
              </>
            }
          </>
        )
      },
    },
    {
      field: 'status',
      headerName: `Payment status`,
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const currentDate = dayjs();
        const dueDate = dayjs(row.dueDate);
        return (
          <>
            <Chip
              color={
                row.status == 'Paid' ? 'success' :
                  row.status !== 'Paid' && (dueDate.isBefore(currentDate, 'day') || dueDate.isSame(currentDate, 'day')) ? 'error' :
                    'primary'}
              label={`${row.status !== 'Paid' && (dueDate.isBefore(currentDate, 'day') || dueDate.isSame(currentDate, 'day')) ? `Over Due` : row.status}`}
              size="small"
              sx={{ color: theme.palette.primary.contrastText }} />
          </>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: "Create",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'updateAt',
      headerName: "Update",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.updateAt).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.updateAt).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      width: 250,
      getActions: (params: GridRowParams) => {
        if (userType == 'patient') {
          return [
            <GridActionsCellItem
              key={params.row.toString()}
              onClick={() => {
                printButtonClicked(params.row)
              }}
              icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
            <GridActionsCellItem onClick={() => {
              window.open(`/patient/dashboard/see-billing/${btoa(params?.row?._id)}`, "_blank")
            }} key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
            <GridActionsCellItem
              key={params.row.toString()}
              onClick={() => {
                window.open(`/patient/check-out/${btoa(params?.row?._id)}`, "_blank")
              }}
              icon={
                params.row.status === 'Paid' ? (
                  <PaymentIcon sx={{ color: theme.palette.text.disabled }} />
                ) : (
                  <PaymentIcon sx={{ color: theme.palette.primary.main }} />
                )

              }
              label="Pay"
              disabled={params.row.status === 'Paid'} />
          ]
        } else {
          return [
            <GridActionsCellItem
              key={params.row.toString()}
              onClick={() => {
                printButtonClicked(params.row)
              }}
              icon={<i className="fas fa-print"
                style={{ color: theme.palette.primary.main }}></i>} label="Print"
            />,
            <GridActionsCellItem
              key="delete-action"
              onClick={() => deleteClicked(params)}
              icon={
                params.row.status === 'Paid' ? (
                  <DeleteForever sx={{ color: theme.palette.text.disabled }} />
                ) : (
                  <DeleteForever sx={{ color: 'crimson' }} />
                )
              }
              label="Delete"
              disabled={params.row.status === 'Paid'}
            />,
            <GridActionsCellItem key={params.row.toString()} icon={
              <Edit sx={{ color: theme.palette.primary.main }} />} onClick={() => {
                window.open(`/doctors/dashboard/edit-billing/${btoa(params?.row?._id)}`, "_blank")
              }} label="Edit" />,

          ]
        }
      }
    }
  ].filter(Boolean)

  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintBillComponent ref={printRef} printProps={printProps} />}
      </iframe>
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
                  <h4 className="card-title float-start">Billing Records</h4>
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
                              handleChangePage: handleChangeBillingPage,
                              handleChangeRowsPerPage: handleChangeBillingRowsPerPage,
                              count: rowBillingCount,
                              SelectProps: {
                                inputProps: {
                                  id: 'pagination-select',
                                  name: 'pagination-select',
                                },
                              },
                            },
                          }}
                          rowHeight={screen.height / 15.2}
                          rows={billingRecords}
                          getRowId={(params) => params._id}
                          rowCount={rowBillingCount}
                          ref={billingRef}
                          columns={billingColumns}
                          paginationModel={billingPaginationModel}
                          pageSizeOptions={[5, 10]}
                          disableRowSelectionOnClick
                          onPaginationModelChange={setBillingPaginationModel}
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
          </>}
      {showDelete && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setDeleteId('')
            setShowDelete(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={showDelete}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            setTimeout(() => {
              setDeleteId('')
              setShowDelete(false)
            }, 500);
          }}>
          <Stack>
            <span>Delete Bill</span>
          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>

          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
          <span style={{ display: 'flex', justifyContent: 'center', ...muiVar }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              deleteSubmited()
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                setTimeout(() => {
                  setShowDelete(false)
                }, 500);
              }}>Cancell</button>
          </span>

        </DialogContent>
      </BootstrapDialog>}
    </Fragment>
  )
});

export default PatientBillingRecords;