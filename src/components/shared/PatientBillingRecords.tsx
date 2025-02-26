/* eslint-disable @next/next/no-img-element */
import { FC, forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueGetterParams, GridColumnVisibilityModel, GridColDef, GridAlignment, GridFilterModel, GridSortModel, GridRowId } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { doctors_profile, logo, patient_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Edit from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';

import { BillingDetailsArrayType, BillingType } from '../DoctorDashboardSections/AddBilling';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import CustomPagination from './CustomPagination';
import { formatNumberWithCommas, getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from './Dialog';
import DialogContent from '@mui/material/DialogContent';
import dataGridStyle from './dataGridStyle';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from './CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
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
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  return (
    <div ref={ref} >
      <Fragment >
        {/*  minHeight: '3508px' */}
        <div className="content" style={muiVar}>
          <div>
            <div className="row" >
              <div className="col-lg-12 offset-lg-2" style={{ width: '794px', }}>
                <div className="invoice-content" style={{
                  background: '#fff',
                  fontSize: '16px',
                  width: '794px',
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
                          <strong>Issued:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {dayjs(issueDay).format('DD MMM YYYY')}<br />
                          <strong>Due Date:</strong> &nbsp;&nbsp;{dayjs(dueDate).format('DD MMM YYYY')}
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
                                    if (homeRoleName == 'patient') {
                                      return a == 'title' || a == 'total'
                                    } else {
                                      return a !== 'amount'
                                    }
                                  }).map((pres: string, index: number) => {
                                    return (
                                      <th className={index !== 0 ? "text-center" : ''} key={index}>
                                        {
                                          pres == 'bookingFee' ? "Percent" : pres == "bookingsFeePrice" ? "Fee Price" :
                                            `${pres.charAt(0).toLocaleUpperCase()}${pres.slice(1)}`
                                        }
                                      </th>
                                    )
                                  })
                                }
                              </tr>
                            </thead>
                            <tbody style={{ borderTop: "none", overflowX: "hidden" }}>
                              {
                                billDetailsArray.map((a: BillingDetailsArrayType, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ color: '#000' }} >{a.title}</td>
                                      {
                                        homeRoleName == 'doctors' &&
                                        <>
                                          <td style={{ color: '#000' }} className="text-center">
                                            {`${currencySymbol} ${formatNumberWithCommas(a.price?.toString()!)}`}
                                          </td>
                                          <td style={{ color: '#000' }} className="text-center">{`${a.bookingsFee} %`}</td>
                                          <td style={{ color: '#000' }} className="text-center">
                                            {`${currencySymbol} ${formatNumberWithCommas(a.bookingsFeePrice.toString())}`}
                                          </td>
                                        </>
                                      }
                                      <td style={{ color: '#000', display: 'block', whiteSpace: 'pre' }} className="text-center">
                                        {`${currencySymbol} ${formatNumberWithCommas(a.total.toString())}`}
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
                                  homeRoleName == 'doctors' && <>
                                    <th>Total Price:</th>
                                    <td style={{ padding: '10px 20px', color: "#000" }}>
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
                                  homeRoleName == 'doctors' ? <>
                                    <th>Total Fee Price:</th>
                                    <td style={{ padding: '10px 20px', color: "#000" }}>
                                      <span>
                                        {currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          bookingsFeePrice
                                        )}
                                      </span>
                                    </td>
                                  </> :
                                    <>
                                      <th>Total:</th>
                                      <td style={{ padding: '10px 70px', color: "#000" }}>
                                        <span>{currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          total
                                        )}</span>
                                      </td>
                                    </>
                                }
                              </tr>
                              <tr>
                                {
                                  homeRoleName == 'doctors' && <>
                                    <th>Total:</th>
                                    <td style={{ padding: '10px 20px', color: "#000" }}>
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
  const { bounce, muiVar } = useScssVar();
  const router = useRouter();
  const { classes, theme } = dataGridStyle({});
  const [rows, setRows] = useState<BillingType[] | []>([])
  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowCount, setRowCount] = useState<number>(0)
  const [printProps, setPrintProps] = useState<any>({})
  const printRef = useRef(null);
  const dataGridRef = useRef<any>(null)
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
  const perPage = 5
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
        field: 'invoiceId',
        headerName: 'Invoice ID',
        width: 200,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell(params: GridRenderCellParams) {
          const { value, row } = params
          return <Link href={`/patient/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
        }
      },
      userType == 'patient' ? {
        field: 'doctorProfile.fullName',
        headerName: "Doctor",
        width: 200,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.doctorProfile?.fullName
        },
        sortComparator: (v1: any, v2: any) => v1.toLowerCase() > v2.toLowerCase() ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
          const { row, } = params;

          const doctorName = `Dr. ${row?.doctorProfile?.fullName}`
          return (
            <>
              <Link aria-label='link' className="avatar mx-2" href={`/doctors/profile/${btoa(row?.doctorId)}`} target='_blank'>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={row?.doctorProfile?.online}
                >
                  <Avatar alt="" src={`${row?.doctorProfile?.profileImage}`} >
                    <img src={doctors_profile} alt="" className="avatar avatar-in-schedule-table" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Stack >
                <Link href={`/doctors/profile/${btoa(row?.doctorId)}`}
                  target='_blank'
                  style={{ marginBottom: -20, zIndex: 1 }}>
                  {doctorName}
                </Link><br />
                <small> {row?.doctorProfile?.specialities[0]?.specialities}</small>
              </Stack>
            </>
          )
        },
      } : null,
      userType == 'doctor' ? {
        field: 'patientProfile.fullName',
        headerName: "Patient",
        width: 200,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.patientProfile?.fullName
        },
        sortComparator: (v1: any, v2: any) => v1.toLowerCase() > v2.toLowerCase() ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
          const online = row?.patientProfile?.online || false;
          return (
            <>
              <Link className="avatar mx-2" target='_blank' href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                >
                  <Avatar alt="" src={profileImage} />
                </StyledBadge>
              </Link>
              <Stack>
                <Link target='_blank'
                  href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}
                  style={{ color: theme.palette.secondary.main, maxWidth: '100%', minWidth: '100%' }}>
                  {`${row?.patientProfile?.gender == '' ? '' : row?.patientProfile?.gender + '.'}`}{row?.patientProfile?.fullName}
                </Link>
                <small>{row?.patientProfile?.userName}</small>
              </Stack>
            </>
          )
        },
      } : null,
      userType == 'doctor' ? {
        field: 'price',
        headerName: "Price",
        width: 100,
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
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(params?.row?.price)}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      } : null,
      userType == 'doctor' ? {
        field: 'bookingsFee',
        headerName: "Fee",
        width: 100,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params
          return `${row?.bookingsFee} %`
        }
      } : null,
      userType == 'doctor' ? {
        field: 'bookingsFeePrice',
        headerName: "Fee Price",
        width: 100,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
                params?.row?.bookingsFeePrice
              )}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      } : null,
      {
        field: 'total',
        headerName: "Total",
        width: 100,
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
                params?.row?.total
              )}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: 'dueDate',
        headerName: "Due Date",
        width: 200,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row.dueDate ? dayjs(row.dueDate).toDate() : null;
        },
        renderCell: (params: GridRenderCellParams) => {
          const currentDate = dayjs();
          const { row } = params;
          const isDue = row?.status !== 'Paid' && (dayjs(row?.dueDate).isBefore(currentDate, 'day') || dayjs(row?.dueDate).isSame(currentDate, 'day'))

          return (
            <>
              <span className={`user-name ${isDue ? 'due-date' : ''}`}
                style={{ justifyContent: 'center', display: 'flex', }}>
                {dayjs(row.dueDate).format(`DD MMM YYYY`)}
              </span>
            </>
          )
        }
      },
      {
        field: 'billDetailsArray',
        headerName: "Items",
        width: 100,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        type: 'string',
        searchAble: false,
        sortable: false,
        filterable: false,
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
              .map(([key, val]: [string, any]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${key == "title" ? val :
                `${formatNumberWithCommas(val.toString())}${key == 'bookingsFee' ? '%' : " " + params?.row?.currencySymbol
                }`
                }`)
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
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <>
              <Chip
                label={row?.status}
                size="small"
                sx={{
                  color: theme.palette.primary.contrastText,
                  backgroundColor: row.status == 'Paid' ? '#5BC236' : '#ffa500'
                }} />
            </>
          )
        }
      },
      {
        field: 'createdAt',
        headerName: "Create",
        width: 200,
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row.createdAt ? dayjs(row.createdAt).toDate() : null;
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(`DD MMM YYYY`)}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(`HH:mm`)}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: 'updateAt',
        headerName: "Update",
        width: 200,
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row.updateAt ? dayjs(row.updateAt).toDate() : null;
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(`DD MMM YYYY`)}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdAt).format(`HH:mm`)}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center' as GridAlignment,
        align: "center" as GridAlignment,
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
                router.push(`/patient/dashboard/see-billing/${btoa(params?.row?._id)}`)
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
                onClick={() => {
                  setDeleteId([params.row._id])
                  setShowDelete(true)
                }}
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
                  router.push(`/doctors/dashboard/edit-billing/${btoa(params?.row?._id)}`)

                }} label="Edit" />,

            ]
          }
        }
      }
    ].filter(isNotNull);
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
        homeSocket?.current.emit('getBillingRecord', { patientId: patientId, doctorId: doctorId, paginationModel, sortModel, mongoFilterModel, });
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
              toastId: 'billing-toast',
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              onClose: () => {
                setIsLoading(false)
                toast.dismiss()
              }
            });
          } else {
            setRows(billingRecords)
            setRowCount(totalBilling)
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
  }, [homeSocket, patientId, reload, paginationModel, sortModel, mongoFilterModel,])

  const [deleteId, setDeleteId] = useState<GridRowId[]>([])
  const [showDelete, setShowDelete] = useState<boolean>(false);

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
              setDeleteId([])
            }
          });
        } else {
          dispatch(updateHomeFormSubmit(false))
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setDeleteId([])
            setShowDelete(false)
          }, 500);
        }
      })
    }

  }


  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintBillComponent ref={printRef} printProps={printProps} />}
      </iframe>
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
                      `Total Bills: ${rowCount}` :
                      `Not any Bills yet`
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
                        deleteId: deleteId,
                        deleteClicked: () => { setShowDelete(true) },
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
                    checkboxSelection
                    isRowSelectable={(params) => {
                      if (params.row.status !== "Pending") {
                        return false;
                      } else {
                        return true;
                      }
                    }}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      const { page, pageSize } = paginationModel
                      let start = page == 0 ? page : page * pageSize
                      let end = pageSize * (1 + page)
                      let currrenPageId = newRowSelectionModel.slice(start, end)
                      setDeleteId(() => {
                        let newState = currrenPageId.length > 0 ? [...currrenPageId] : [...newRowSelectionModel]
                        return newState
                      });
                    }}
                    rowSelectionModel={deleteId}
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
      {showDelete && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setDeleteId([])
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
              setDeleteId([])
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