/* eslint-disable @next/next/no-img-element */
import React, { FC, forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { doctors_profile, logo, patient_profile } from '@/public/assets/imagepath';
import { useRouter } from 'next/router';
import useScssVar from '@/hooks/useScssVar';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridColumnVisibilityModel, GridAlignment, GridFilterModel, GridSortModel, GridValueFormatterParams } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { PrescriptionsArrayType, PrescriptionsType } from '../DoctorDashboardSections/AddPrescription';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import DialogContent from '@mui/material/DialogContent';

import { BootstrapDialog, Transition, BootstrapDialogTitle } from '../shared/Dialog';
import { PatientProfile } from '../DoctorDashboardSections/MyPtients';
import { useTheme } from '@mui/material/styles';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface MedicalRecordsPriscriptionType {
  patientProfile: PatientProfile;
}

interface Props {
  printProps: any
}


export const PrintComponent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { muiVar } = useScssVar();
  const { printProps } = props
  const {
    id,
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
                          <strong>Order:</strong> #{id} <br />
                          <strong>Issued:</strong> {issueDay}
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
                                  prescriptionKeys.map((pres: string, index: number) => {
                                    return (
                                      <th className={index !== 0 ? "text-center" : ''} key={index}>{`${pres.charAt(0).toLocaleUpperCase()}${pres.slice(1)}`}</th>
                                    )
                                  })
                                }
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
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4 ms-auto" style={{ minHeight: '200px' }}></div>
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

const MedicalRecordsPriscription: FC<MedicalRecordsPriscriptionType> = (({ patientProfile }) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const { muiVar, bounce } = useScssVar();
  const router = useRouter();
  const theme = useTheme();
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const dataGridRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRow] = useState<PrescriptionsType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
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

    const { doctorProfile } = row
    const { firstName, lastName, country, city, state, address1, address2 } = doctorProfile
    const { gender, firstName: paFirstName, lastName: paLastName, country: paCountry, city: paCity, state: paState, address1: paAddress1, address2: paAddress2 } = patientProfile

    setPrintProps(() => {
      let newState = {}
      newState = {
        id: row?.id,
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
        prescriptionKeys: Object.keys(row.prescriptionsArray[0]),
        prescriptionsArray: row.prescriptionsArray
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }

  const [deleteId, setDeleteId] = useState<string>()
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row._id))
    setShowDelete(true)

  }
  const perPage = 5;
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
        field: 'doctorProfile.fullName',
        headerName: `Doctor Name`,
        width: 250,
        minWidth: 250,
        align: 'center' as GridAlignment,
        headerAlign: 'center' as GridAlignment,
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueFormatter(params: GridValueFormatterParams) {
          const { api, id } = params;
          let fullName = api.getCellValue(id as string, 'doctorProfile')?.fullName
          return ` Dr. ${fullName}`
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
                  idle={row?.doctorProfile?.lastLogin?.idle}
                  online={online}
                >
                  <Avatar alt="" src={`${profileImage}`} >
                    <img src={doctors_profile} alt="" className="avatar" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Stack>
                <Link aria-label='profile' target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`}
                  style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                  {formattedValue}
                </Link>
                <small>{row?.doctorProfile?.specialities[0]?.specialities}</small>
              </Stack>
            </>
          )
        }
      },
      {
        field: 'patientProfile.fullName',
        headerName: `Patient Name`,
        width: 200,
        headerAlign: 'center',
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
          const online = row?.patientProfile?.online || false
          return (
            <>
              <Link className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                  idle={row?.patientProfile?.lastLogin?.idle}
                >
                  <Avatar alt="" src={profileImage} />
                </StyledBadge>
              </Link>
              <Link onClick={(e) => e.preventDefault()} href={`/doctors/dashboard/patient-profile/${btoa(row.patientId)}`} >{`${row?.patientProfile?.gender == '' ? '' : row?.patientProfile?.gender + '.'}`}{row?.patientProfile?.fullName}</Link></>
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
        field: 'prescriptionsArray',
        headerName: "Medicine",
        width: 200,
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        searchAble: false,
        sortable: false,
        filterable: false,
        valueGetter: (params) => {
          const prescriptionsArray = params?.row?.prescriptionsArray;
          return prescriptionsArray.length;
        },
        sortComparator: (v1: any, v2: any) => {
          return v1 > v2 ? -1 : 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { prescriptionsArray: value } = params?.row;
          const tooltipText = value.map((obj: any) => {
            // Map over each key-value pair in the object
            const formattedEntries = Object.entries(obj)
              .map(([key, val]) => `${key}: ${val}`)
              .join("\n"); // Join each key-value pair with a newline

            // Add a separator after each object
            return `${formattedEntries}\n------------------------------------`;
          }).join("\n\n"); // Separate each object's result with double newlines

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
                      {`${value.length} medicine${value.length <= 1 ? '' : "s"}`}
                    </span>
                  </Tooltip>
                </> :
                <>
                  <span style={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                    --
                  </span></>
              }
            </>
          )
        },
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        align: 'center',
        width: 200,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="print-action"
            onClick={() => {
              printButtonClicked(params.row)
            }}
            icon={
              <i className="fas fa-print"
                style={{ color: theme.palette.primary.main }}>

              </i>} label="Print" />,
          router.asPath.startsWith('/doctors') ? (
            <GridActionsCellItem
              key="view-action"
              onClick={() => {
                if (params.row?._id == patientProfile?._id) {
                  deleteClicked(params);
                }
              }}
              icon={
                <DeleteForever sx={{ color: 'crimson' }} />
              }
              disabled={params.row?._id !== patientProfile?._id}
              label="View"
            />
          ) : <></>,
          <GridActionsCellItem
            key="view-action"
            onClick={() => {
              let isPatientPanel = router.asPath.startsWith('/patient')
              const encodedId = btoa(params.row?._id);
              router.push(isPatientPanel
                ? `/patient/dashboard/see-prescription/${encodedId}` :
                `/doctors/dashboard/editprescription/${encodedId}`)
            }}
            icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
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
    if (isActive) {
      let userId = patientProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket?.current.emit('getPrescriptionRecord', { userId: userId, paginationModel, sortModel, mongoFilterModel });
        homeSocket.current.once('getPrescriptionRecordReturn', (msg: {
          status: number,
          message?: string,
          priscriptionRecords: PrescriptionsType[],
          totalPrescriptions: number
        }) => {
          const { status, message, priscriptionRecords, totalPrescriptions } = msg;
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
              toastId: "prescription-toast",
              onClose: () => {
                setIsLoading(false)
                toast.dismiss('prescription-toast')
              }
            });
          } else {
            setRow(priscriptionRecords)
            setRowCount(totalPrescriptions)
            homeSocket.current.once(`updateGetPrescriptionRecord`, () => {
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
  }, [homeSocket, patientProfile?._id, paginationModel, sortModel, mongoFilterModel, reload])

  const deleteSubmited = () => {
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('deletePriscriptionRecord', { doctorId: userProfile?._id, deleteId })
      homeSocket.current.once('deletePriscriptionRecordReturn', (msg: { status: number, message?: string, }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} delete Priscription Record`, {
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

  return (
    <Fragment>
      <iframe style={{ height: 0, width: 0, position: 'absolute' }}>
        {isPrinting && <PrintComponent ref={printRef} printProps={printProps} />}
      </iframe>
      {
        isLoading ?
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Box sx={{ minHeight: boxMinHeight }} className="dataGridOuterBox">
                  <LoadingComponent boxMinHeight={boxMinHeight} />
                </Box>
              </div>
            </div>
          </div> :
          <div className="card">
            <div ref={dataGridRef} className="tab-content schedule-cont">
              <Box className="dataGridOuterBox" >
                <Typography className="totalTypo"
                  variant='h5' align='center' gutterBottom >
                  {
                    rowCount !== 0 ?
                      `Total Priscription: ${rowCount}` :
                      `Not any Priscription yet`
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
                    isRowSelectable={(params) => false}
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
            <span>Delete Prescription</span>
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
  );
})

export default MedicalRecordsPriscription;
