/* eslint-disable @next/next/no-img-element */
import React, { FC, forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { doctors_profile, logo, patient_profile } from '@/public/assets/imagepath';
import { useRouter } from 'next/router';
import useScssVar from '@/hooks/useScssVar';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { PrescriptionsArrayType, PrescriptionsType } from '../DoctorDashboardSections/AddPrescription';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { DeleteForever } from '@mui/icons-material';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { DialogContent } from '@mui/material';

import { BootstrapDialog, Transition, BootstrapDialogTitle } from '../shared/Dialog';
import { PatientProfile } from '../DoctorDashboardSections/MyPtients';

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
                          <strong>Order:</strong> #{_id} <br />
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
                  <div className="col-md-6 col-xl-4 ms-auto" style={{ minHeight: '350px' }}></div>
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
  const theme = useTheme()
  const presRef = useRef<any>(null)
  const [prisRecords, setPrisRecords] = useState<PrescriptionsType[] | []>([])
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowPrisCount, setRowPrisCount] = useState<number>(0)
  const perPage = 5;
  const [dataGridPrisFilters, setDataGridPrisFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [prisPaginationModel, setPrisPaginationModel] = useState({
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

  const prisColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'doctorProfile',
      headerName: "Doctor Name",
      width: 290,
      headerAlign: 'center',
      align: 'center',
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
                  <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Stack>
              <Link href={`/doctors/profile/${btoa(row?.doctorId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }} target='_blank'>
                {`Dr.${row?.doctorProfile?.fullName}`}
              </Link>
            </Stack>
          </>
        )
      }
    }, {
      field: 'patientProfile',
      headerName: "Patient Name",
      width: 290,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const profileImage = row?.patientProfile?.profileImage == '' ? doctors_profile : row?.patientProfile?.profileImage
        const online = row?.patientProfile?.online || false;

        return (
          <>

            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              online={online}
            >
              <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
              </Avatar>
            </StyledBadge> &nbsp; &nbsp;
            <span
              style={{ color: theme.palette.primary.main, maxWidth: '70%', minWidth: '70%' }} >
              {`${row?.patientProfile?.gender !== '' ? `${row?.patientProfile?.gender}.` : ""}${row?.patientProfile?.fullName}`}
            </span>
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
      field: 'prescriptionsArray',
      headerName: "Medicine",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
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
                    {value.map((a: any) => {
                      let keys = Object.keys(a)
                      return `
                    ${keys[0]}: 
                    ${a?.[keys[0]]}
                  `
                    })}
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
              deleteClicked(params);
            }}
            icon={
              <DeleteForever sx={{ color: 'crimson' }} />
            }
            label="View"
          />
        ) : <></>,
        <GridActionsCellItem
          key="view-action"
          onClick={() => {
            let isPatientPanel = router.asPath.startsWith('/patient')
            const encodedId = btoa(params.row?._id);
            window.open(isPatientPanel ? `/patient/dashboard/see-prescription/${encodedId}` : `/doctors/dashboard/editprescription/${encodedId}`, '_blank');
          }}
          icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
      ]
    }
  ]

  const printButtonClicked = (row: any) => {

    const { doctorProfile } = row
    const { firstName, lastName, country, city, state, address1, address2 } = doctorProfile
    const { gender, firstName: paFirstName, lastName: paLastName, country: paCountry, city: paCity, state: paState, address1: paAddress1, address2: paAddress2 } = patientProfile

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
        prescriptionKeys: Object.keys(row.prescriptionsArray[0]),
        prescriptionsArray: row.prescriptionsArray
      }
      return newState
    })
    handlePrint(null, () => printRef.current);
  }

  const handleChangePrisRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrisPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowPrisCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowPrisCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowPrisCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridPrisFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowPrisCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowPrisCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowPrisCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        limit: parseInt(event.target.value, 10),
        skip: maximuPage <= 0 ? 0 : maximuPage
      }
    })
  };

  const handleChangePrisPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridPrisFilters((prevState) => {
      return {
        limit: perPage !== prisPaginationModel.pageSize ? prisPaginationModel.pageSize : perPage * value,
        skip: (value - 1) * perPage,
      }
    })
    setPrisPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      let userId = patientProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket?.current.emit('getPrescriptionRecord', { userId: userId, ...dataGridPrisFilters });
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
              onClose: () => { }
            });
          } else {
            setPrisRecords(priscriptionRecords)
            setRowPrisCount(totalPrescriptions)
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
  }, [homeSocket, patientProfile?._id, dataGridPrisFilters, reload])

  const [deleteId, setDeleteId] = useState<string>()
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row._id))
    setShowDelete(true)

  }
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
                  <h4 className="card-title float-start">Prescription Records</h4>
                </div>
                <div className="card-body ">
                  <div className="card card-table mb-0">
                    <div className="card-body">
                      <div className="table-responsive" style={{ height: 580, width: '100%' }}>
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
                              handleChangePage: handleChangePrisPage,
                              handleChangeRowsPerPage: handleChangePrisRowsPerPage,
                              count: rowPrisCount,
                              SelectProps: {
                                inputProps: {
                                  id: 'pagination-select',
                                  name: 'pagination-select',
                                },
                              },
                            },
                          }}
                          rowHeight={screen.height / 15.2}
                          rows={prisRecords}
                          getRowId={(params) => params._id}
                          rowCount={rowPrisCount}
                          ref={presRef}
                          columns={prisColumns}
                          paginationModel={prisPaginationModel}
                          pageSizeOptions={[5, 10]}
                          disableRowSelectionOnClick
                          onPaginationModelChange={setPrisPaginationModel}
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
          </>
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
