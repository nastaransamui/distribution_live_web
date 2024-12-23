/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment, useState, useMemo, useRef, forwardRef, ReactNode, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { PatientSidebarDoctorTypes } from '../DoctorDashboardSections/PatientProfileTabs';
import { useReactToPrint } from 'react-to-print';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { StyledBadge, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import { doctors_profile, logo } from '@/public/assets/imagepath';
import { DoctorPatientInitialLimitsAndSkipsTypes } from '../DoctorPatientProfile/DoctorPatientProfile';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import { PrescriptionsArrayType } from '../DoctorDashboardSections/AddPrescription';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import _ from 'lodash'
interface Props {
  printProps: any
}


const PrintComponent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { muiVar } = useScssVar();
  const { printProps } = props
  const {
    title,
    _id,
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
    prescriptionsArray,
    prescriptionKeys
  } = printProps
  return (
    <div ref={ref}>
      <Fragment >
        <div className="content" style={muiVar}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="invoice-content" style={{ background: '#fff' }}>
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-logo">
                          <img src={logo} alt="logo" className='imgColorPrimary' />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p className="invoice-details" style={{ color: '#000' }}>
                          <strong>Order:</strong> #{_id} <br />
                          <strong>Issued:</strong> {issueDay}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Invoice Item */}
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-info">
                          <strong className="customer-text">{title}</strong>
                          <p className="invoice-details invoice-details-two" style={{ color: '#000' }}>
                            {drName} <br />
                            {drAddress}
                            <br />
                            {`${drCity} ${drState} ${drCountry}`} <br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="invoice-info invoice-info2">
                          <strong className="customer-text">{title} To</strong>
                          <p className="invoice-details" style={{ color: '#000' }}>
                            {paName} <br />
                            {paAddress}<br />
                            {`${paCity} ${paState} ${paCountry}`}  <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice Item */}
                  {/* Invoice Item */}
                  {/* <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="invoice-info">
                          <strong className="customer-text">Payment Method</strong>
                          <p className="invoice-details invoice-details-two" style={{ color: '#000' }}>
                            Debit Card <br />
                            XXXXXXXXXXXX-2541 <br />
                            HDFC Bank
                            <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice Item */}
                  {/* Invoice Item */}
                  <div className="invoice-item invoice-table-wrap">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="invoice-table table table-bordered" style={{ color: '#000' }}>
                            <thead style={{ borderBottom: "none" }}>
                              <tr>
                                {
                                  prescriptionKeys.map((pres: string, index: number) => {
                                    return (
                                      <th className={index !== 0 ? "text-center" : ''} key={index}>{`${pres.charAt(0).toLocaleUpperCase()}${pres.slice(1)}`}</th>
                                    )
                                  })
                                }
                                {/* <th >Description</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">VAT</th>
                                <th className="text-end">Total</th> */}
                              </tr>
                            </thead>
                            <tbody style={{ borderTop: "none" }}>
                              {
                                prescriptionsArray.map((a: PrescriptionsArrayType, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ color: '#000' }} >{a.medicine}</td>
                                      <td style={{ color: '#000' }} className="text-center">#{a.medicine_id}</td>
                                      <td style={{ color: '#000' }} className="text-center">{a.quantity}</td>
                                      <td style={{ color: '#000', display: 'block', whiteSpace: 'pre' }} className="text-center" dangerouslySetInnerHTML={{ __html: a.description }}></td>
                                    </tr>
                                  )
                                })
                              }
                              {/* <tr>
                                <td style={{ color: '#000' }} >General Consultation</td>
                                <td style={{ color: '#000' }} className="text-center">1</td>
                                <td style={{ color: '#000' }} className="text-center">$0</td>
                                <td style={{ color: '#000' }} className="text-end">$100</td>
                              </tr>
                              <tr>
                                <td style={{ color: '#000' }}>Video Call Booking</td>
                                <td style={{ color: '#000' }} className="text-center">1</td>
                                <td style={{ color: '#000' }} className="text-center">$0</td>
                                <td style={{ color: '#000' }} className="text-end">$250</td>
                              </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* <div className="col-md-6 col-xl-4 ms-auto">
                        <div className="table-responsive">
                          <table className="invoice-table-two table">
                            <tbody>
                              <tr>
                                <th>Subtotal:</th>
                                <td>
                                  <span style={{ color: '#000' }}>$350</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Discount:</th>
                                <td>
                                  <span style={{ color: '#000' }}>-10%</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Total Amount:</th>
                                <td>
                                  <span style={{ color: '#000' }}>$315</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  {/* /Invoice Item */}
                  {/* Invoice Information */}
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
PrintComponent.displayName = "PrintComponent"
const perPage = 5
const PatientPrescription: FC<PatientSidebarDoctorTypes> = (({ userType, doctorPatientProfile, setDataGridFilters, dataGridFilters, isMobile }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const [printProps, setPrintProps] = useState<any>({})
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '70vh'
      }} />
  )



  const router = useRouter();
  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: "Date",
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
        field: 'prescriptionsArray',
        headerName: "Medicine Name",
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueFormatter(params: GridValueFormatterParams) {
          const { value } = params;
          return value.map((a: PrescriptionsArrayType) => a?.medicine).join(',\n')
        }
      },
      {
        field: 'prescriptionsArrayQuantity',
        headerName: "Quantity",
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          const { prescriptionsArray } = row;
          return prescriptionsArray
        },
        valueFormatter(params: GridValueFormatterParams) {
          const { value } = params;
          return value.map((a: PrescriptionsArrayType) => a?.quantity!.toString()).join(',\n')
        }
      },
      {
        field: 'doctorProfile',
        headerName: `Doctor Name`,
        width: 250,
        align: 'center',
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
              <Link className="mx-2" target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`}>
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
              <Link target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
            </>
          )
        }
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        flex: isMobile ? 0 : 1,
        getActions: (params: GridRowParams) => {
          const { row } = params;
          if (userType == 'patient') {
            return [
              <GridActionsCellItem key={params.row.toString()} onClick={() => {
                printButtonClicked(row)
              }} icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
              <GridActionsCellItem onClick={() => {
                router.push(`/patient/dashboard/see-prescription/${btoa(params.row?._id)}`)
              }} key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
            ]
          } else {
            return [
              <GridActionsCellItem key={params.row.toString()}
                onClick={() => {
                  printButtonClicked(row)
                }}
                icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
              userProfile?._id == params?.row?.doctorId &&
              <GridActionsCellItem key={params.row.toString()} icon={
                <Edit sx={{ color: theme.palette.primary.main }} />} onClick={() => {
                  router.push(`/doctors/dashboard/editprescription/${btoa(params.row?._id)}`)
                }} label="Edit" />,
              userProfile?._id !== params?.row?.doctorId && <GridActionsCellItem onClick={() => {
                router.push(`/doctors/dashboard/see-prescription/${btoa(params.row?._id)}`)
              }} key={params.row.toString()} icon={
                <i className="far fa-eye"
                  style={{ color: theme.palette.secondary.main }}></i>}
                label="View" />,
            ].filter(Boolean)
          }
        }
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, router, theme.palette.primary.main, theme.palette.secondary.main, userType, userProfile])

  const printButtonClicked = (row: any) => {

    const { doctorProfile } = row
    const { firstName, lastName, country, city, state, address1, address2 } = doctorProfile
    const { gender, firstName: paFirstName, lastName: paLastName, country: paCountry, city: paCity, state: paState, address1: paAddress1, address2: paAddress2 } = doctorPatientProfile
    setPrintProps(() => {
      let newState = {}
      newState = {
        title: 'Presciption',
        _id: row?._id,
        issueDay: dayjs(row.createdAt).format('DD/MMM/YYYY'),
        drName: `Dr. ${firstName} ${lastName}`,
        drAddress: `${address1}, ${address2}`,
        drCity: city,
        drState: state,
        drCountry: country,
        paName: `${gender}. ${paFirstName} ${paLastName}`,
        paAddress: `${paAddress1}, ${paAddress2}`,
        paCity: paCity,
        paState: paState,
        paCountry: paCountry,
        prescriptionKeys: Object.keys(row.prescriptionsArray[0]),
        prescriptionsArray: row.prescriptionsArray
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }

  const prescriptionComponents = () => {
    return (
      <DataGrid
        autoHeight
        hideFooter
        getRowId={(params) => params._id}
        // rowHeight={typeof window == 'undefined' ? 12 : screen.height / 15.2}
        rows={doctorPatientProfile?.prescriptions}
        columns={columns}
        // getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        disableRowSelectionOnClick
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters((prevState: DoctorPatientInitialLimitsAndSkipsTypes) => {

      return {
        ...prevState,
        prescriptionLimit: perPage * value,
        prescriptionSkip: (value - 1) * perPage
      }
    })
  };

  const [isPrinting, setIsPrinting] = useState<any>(false);
  const printRef = useRef(null);

  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef<any>(null);

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
  return (
    <Fragment>
      {userType == 'doctor' && <div className="text-end">
        <Link href={`/doctors/dashboard/add-prescription/${btoa(doctorPatientProfile._id)}`} className="add-new-btn">
          Add Prescription
        </Link>
      </div>}
      <div className="tab-content pt-0" style={muiVar}>

        <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
          {isPrinting && <PrintComponent ref={printRef} printProps={printProps} />}
        </iframe>
        {
          doctorPatientProfile == undefined ?
            <LoadingCompoenent /> :
            <>
              {doctorPatientProfile?.prescriptions !== undefined &&
                doctorPatientProfile?.prescriptions.length !== 0 ?
                <div className="card card-table mb-0">
                  <div className="card-body">
                    <div className="table-responsive" >
                      {prescriptionComponents()}
                    </div>
                  </div>
                  <Pagination
                    showFirstButton
                    showLastButton
                    hideNextButton
                    hidePrevButton
                    boundaryCount={1}
                    variant="outlined"
                    color="secondary"
                    count={Math.ceil(doctorPatientProfile?.prescriptions_id?.length / perPage) || 0}
                    page={dataGridFilters.prescriptionLimit / perPage}
                    sx={{
                      justifyContent: 'center',
                      display: 'flex',
                      minHeight: 70
                    }}
                    onChange={handlePageChange}
                  />
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

export default PatientPrescription;