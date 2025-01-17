/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, useMemo, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteForever from '@mui/icons-material/DeleteForever'
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { ExtendedVitalSignTypes } from './ClinicalSignsHistory';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';
import { Dashboard1, Dashboard2, Dashboard5, Dashboard6 } from '@/public/assets/imagepath';

import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
export interface VitalTypeObjectForm {
  value: string;
  id: number;
  userId: string;
  name: string;
  date: Date;
}

const initialState: VitalTypeObjectForm = {
  value: '',
  id: 0,
  userId: '',
  name: '',
  date: new Date(),
}


const MedicalDetails: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const router = useRouter();
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const [vitalSign, setvitalSign] = useState<ExtendedVitalSignTypes[]>([])
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stepName, setStepName] = useState<'bodyTemp' | 'heartRate' | 'height' | 'weight'>('heartRate')

  const [reload, setReload] = useState<boolean>(false);
  const perPage = 5;

  const [dataGridBodyTempFilters, setDataGridBodyTempFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [rowBodyTempCount, setRowBodyTempCount] = useState<number>(0)
  const [paginationBodyTempModel, setPaginationBodyTempModel] = useState({
    pageSize: 5,
    page: 0,
  });


  const [dataGridHeartRateFilters, setDataGridHeartRateFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [rowHeartRateCount, setRowHeartRateCount] = useState<number>(0)
  const [paginationHeartRateModel, setPaginationHeartRateModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [dataGridHeightFilters, setDataGridHeightFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [rowHeightCount, setRowHeightCount] = useState<number>(0)
  const [paginationHeightModel, setPaginationHeightModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [dataGridWeightFilters, setDataGridWeightFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [rowWeightCount, setRowWeightCount] = useState<number>(0)
  const [paginationWeightModel, setPaginationWeightModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const {
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    control,
    register,
    setValue: setFormValue,
    getValues: getFormValues,
    watch,
  } = useForm({
    defaultValues: {
      ...initialState,
      userId: userProfile?._id
    }
  })

  const theme = useTheme()
  const grdiRefBodyTemp = useRef<any>(null)
  const grdiRefHeartRate = useRef<any>(null)
  const grdiRefHeight = useRef<any>(null)
  const grdiRefweight = useRef<any>(null)

  useEffect(() => {
    if (homeSocket.current !== undefined) {
      let userId = userProfile?._id
      // Get vital sing on entrance of page
      let skipLimit =
        stepName == 'bodyTemp' ? dataGridBodyTempFilters :
          stepName == 'heartRate' ? dataGridHeartRateFilters :
            stepName == 'height' ? dataGridHeightFilters :
              dataGridWeightFilters;
      homeSocket.current.emit('getVitalSign', { userId, limit: skipLimit.limit, skip: skipLimit.skip, sort: { date: -1 } })
      homeSocket.current.once('getVitalSignReturn', (msg: { status: number, message?: string, vitalSign: ExtendedVitalSignTypes[] }) => {
        const { status, message, vitalSign } = msg;
        if (status !== 200) {
          setIsLoading(false)
          toast.error(message || `Error ${status} find Vital signs`, {
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
          if (vitalSign) {
            setvitalSign(vitalSign)
            vitalSign[0]?.totalBodyTemp !== undefined && setRowBodyTempCount(vitalSign[0].totalBodyTemp);
            vitalSign[0]?.totalHeartRate !== undefined && setRowHeartRateCount(vitalSign[0].totalHeartRate);
            vitalSign[0]?.totalHeight !== undefined && setRowHeightCount(vitalSign[0].totalHeight);
            vitalSign[0]?.totalWeight !== undefined && setRowWeightCount(vitalSign[0].totalWeight);
          }
          setIsLoading(false)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, userProfile?._id, reload, stepName, dataGridBodyTempFilters, dataGridHeartRateFilters, dataGridHeightFilters, dataGridWeightFilters])


  const [edit, setEdit] = useState(false);


  const [deleteId, setDeleteId] = useState<number>()
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row.id))
    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
  }

  useEffect(() => {
    let decodedParams = { name: '' };
    if (typeof window !== 'undefined') {
      if (router.asPath.includes("?")) {
        const encodedParams = router.asPath.split("?")[1]; // Extract query string
        decodedParams = JSON.parse(atob(encodedParams)); // Decode and parse JSON
      }
    }
    setStepName(decodedParams?.name as 'bodyTemp' | 'heartRate' | 'height' | 'weight')
  }, [router])

  const columns: GridColDef[] = useMemo(() => {
    let unit =
      stepName == "heartRate" ? 'bpm'
        : stepName == "bodyTemp" ? '℃'
          : stepName == 'weight' ? '㎏'
            : '㎝'
    let formatTitle =
      stepName == 'heartRate' ? ` Heart Rate /bpm `
        : stepName == 'bodyTemp' ? `Body tempreture /℃ `
          : stepName == 'weight' ? `Weight /㎏ `
            : `Height /㎝ `


    return [
      {
        field: 'id',
        headerName: "ID",
        width: 90,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'value',
        headerName: `${formatTitle}`,
        width: 250,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold' }}>{row?.value}</span>&nbsp;
              <span style={{ justifyContent: 'center', display: 'flex', color: theme.palette.secondary.main, fontWeight: 'bolder' }}>{unit}</span>
            </>
          )
        }
      },
      {
        field: 'date',
        headerName: "Submit Date",
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Stack >
                <span className="user-name" style={{ justifyContent: 'center', display: 'flex', color: theme.palette.primary.main }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
                <span style={{ justifyContent: 'center', color: theme.palette.secondary.main, display: 'flex' }}>{dayjs(row.date).format(` h:mm:ss A`)}</span>
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
        align: 'center',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem icon={<DeleteForever sx={{ color: 'crimson' }} />} onClick={() => { deleteClicked(params) }} label="Delete" />,
        ]
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepName, userProfile?._id])

  const onSubmit = (data: any) => {
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('vitalSignsUpdate', { name: data.name, value: data.value, userId: data.userId })
      setReload(!reload)
    }
    document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
    setTimeout(() => {
      setEdit(false)
    }, 500);
  }


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    switch (stepName) {
      case 'bodyTemp':
        setPaginationBodyTempModel((prevState) => {
          var maximuPage: number = prevState.page;
          if (rowBodyTempCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowBodyTempCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowBodyTempCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            pageSize: parseInt(event.target.value, 10),
            page: maximuPage <= 0 ? 0 : maximuPage,
          }
        })
        setDataGridBodyTempFilters((prevState) => {
          var maximuPage: number = prevState.skip;
          if (rowBodyTempCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowBodyTempCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowBodyTempCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            limit: parseInt(event.target.value, 10),
            skip: maximuPage <= 0 ? 0 : maximuPage
          }
        })
        break;
      case 'heartRate':
        setPaginationHeartRateModel((prevState) => {
          var maximuPage: number = prevState.page;
          if (rowHeartRateCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowHeartRateCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowHeartRateCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            pageSize: parseInt(event.target.value, 10),
            page: maximuPage <= 0 ? 0 : maximuPage,
          }
        })
        setDataGridHeartRateFilters((prevState) => {
          var maximuPage: number = prevState.skip;
          if (rowHeartRateCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowHeartRateCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowHeartRateCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            limit: parseInt(event.target.value, 10),
            skip: maximuPage <= 0 ? 0 : maximuPage
          }
        })
        break;
      case 'height':
        setPaginationHeightModel((prevState) => {
          var maximuPage: number = prevState.page;
          if (rowHeightCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowHeightCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowHeightCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            pageSize: parseInt(event.target.value, 10),
            page: maximuPage <= 0 ? 0 : maximuPage,
          }
        })
        setDataGridHeightFilters((prevState) => {
          var maximuPage: number = prevState.skip;
          if (rowHeightCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowHeightCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowHeightCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            limit: parseInt(event.target.value, 10),
            skip: maximuPage <= 0 ? 0 : maximuPage
          }
        })
        break;
      default:

        setPaginationWeightModel((prevState) => {
          var maximuPage: number = prevState.page;
          if (rowWeightCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowWeightCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowWeightCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            pageSize: parseInt(event.target.value, 10),
            page: maximuPage <= 0 ? 0 : maximuPage,
          }
        })
        setDataGridWeightFilters((prevState) => {
          var maximuPage: number = prevState.skip;
          if (rowWeightCount !== 0) {
            if ((maximuPage + 1) >= (Math.floor(rowWeightCount / parseInt(event.target.value, 10)))) {
              maximuPage = (Math.floor(rowWeightCount / parseInt(event.target.value, 10))) - 1
            }
          }
          return {
            limit: parseInt(event.target.value, 10),
            skip: maximuPage <= 0 ? 0 : maximuPage
          }
        })
        break;
    }
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {

    switch (stepName) {
      case 'bodyTemp':
        setDataGridBodyTempFilters((prevState) => {
          return {
            limit: perPage !== paginationBodyTempModel.pageSize ? paginationBodyTempModel.pageSize : perPage * value,
            skip: (value - 1) * perPage,
          }
        })
        setPaginationBodyTempModel((prevState) => {
          return {
            ...prevState,
            page: value - 1
          }
        })
        break;
      case 'heartRate':
        setDataGridHeartRateFilters((prevState) => {
          return {
            limit: perPage !== paginationHeartRateModel.pageSize ? paginationHeartRateModel.pageSize : perPage * value,
            skip: (value - 1) * perPage,
          }
        })
        setPaginationHeartRateModel((prevState) => {
          return {
            ...prevState,
            page: value - 1
          }
        })
        break;
      case 'height':
        setDataGridHeightFilters((prevState) => {
          return {
            limit: perPage !== paginationHeightModel.pageSize ? paginationHeightModel.pageSize : perPage * value,
            skip: (value - 1) * perPage,
          }
        })
        setPaginationHeightModel((prevState) => {
          return {
            ...prevState,
            page: value - 1
          }
        })
        break;
      default:
        setDataGridWeightFilters((prevState) => {
          return {
            limit: perPage !== paginationWeightModel.pageSize ? paginationWeightModel.pageSize : perPage * value,
            skip: (value - 1) * perPage,
          }
        })
        setPaginationWeightModel((prevState) => {
          return {
            ...prevState,
            page: value - 1
          }
        })
        break;
    }
  }

  const confirmDelete = () => {


    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('vitalSignDelete', { userId: userProfile?._id, name: stepName, id: deleteId })
      homeSocket.current.once('vitalSignDeleteReturn', (msg: { status: number, message: string, }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} find Vital signs`, {
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
          setReload(!reload)
          document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            window.$('#delete_modal').modal("hide")
          }, 500);
        }
      })
    }
  }

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          {
            isLoading ?
              <CircleToBlockLoading color={theme.palette.primary.main} size="small"
                style={{
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }} /> :
              <>
                <MuiSwipeableTabs steps={
                  [
                    {
                      stepName: 'Heart Rate',
                      stepComponent: <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 className="card-title float-start">Heart Rate details</h4>
                            <Link href=""
                              style={{ lineHeight: `25px` }}
                              className="btn btn-primary float-end" onClick={(e) => {
                                e.preventDefault();
                                setEdit(true)
                                setFormValue("value", initialState.value);
                                setFormValue("id", initialState.id);
                                setFormValue("userId", userProfile?._id);
                                setFormValue("name", stepName);
                                setFormValue("date", initialState.date);
                              }} >Add Heart Rate</Link>
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
                                        handleChangePage: handleChangePage,
                                        handleChangeRowsPerPage: handleChangeRowsPerPage,
                                        count: rowHeartRateCount,
                                        SelectProps: {
                                          inputProps: {
                                            id: 'pagination-select',
                                            name: 'pagination-select',
                                          },
                                        },
                                      },
                                    }}
                                    rowHeight={screen.height / 15.2}
                                    rows={vitalSign.length > 0 && vitalSign[0]?.heartRate ? vitalSign[0]?.heartRate : []}
                                    rowCount={rowHeartRateCount}
                                    ref={grdiRefHeartRate}
                                    columns={columns}
                                    paginationModel={paginationHeartRateModel}
                                    pageSizeOptions={[5, 10]}
                                    disableRowSelectionOnClick
                                    onPaginationModelChange={setPaginationHeartRateModel}
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
                      </div>,
                      stepId: <Stack sx={{ alignItems: 'center' }}>
                        <img src={Dashboard1} width={35} alt='' />
                        <span>Heart Rate</span>
                      </Stack>,
                      isValidated: () => true,
                      isDisable: false,
                      hasParams: true,
                      paramsObj: {
                        name: 'heartRate'
                      },
                    },
                    {
                      stepName: 'Body Tempreture',
                      stepComponent: <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 className="card-title float-start">Body Tempreture details</h4>
                            <Link href=""
                              style={{ lineHeight: `25px` }}
                              className="btn btn-primary float-end" onClick={(e) => {
                                e.preventDefault();
                                setEdit(true)
                                setFormValue("value", initialState.value);
                                setFormValue("id", initialState.id);
                                setFormValue("userId", userProfile?._id);
                                setFormValue("name", stepName);
                                setFormValue("date", initialState.date);
                              }} >Add Body Tempreture</Link>
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
                                        handleChangePage: handleChangePage,
                                        handleChangeRowsPerPage: handleChangeRowsPerPage,
                                        count: rowBodyTempCount,
                                        SelectProps: {
                                          inputProps: {
                                            id: 'pagination-select',
                                            name: 'pagination-select',
                                          },
                                        },
                                      },
                                    }}
                                    rowHeight={screen.height / 15.2}
                                    rows={vitalSign.length > 0 && vitalSign[0]?.bodyTemp ? vitalSign[0]?.bodyTemp : []}
                                    rowCount={rowBodyTempCount}
                                    ref={grdiRefBodyTemp}
                                    columns={columns}
                                    paginationModel={paginationBodyTempModel}
                                    pageSizeOptions={[5, 10]}
                                    disableRowSelectionOnClick
                                    onPaginationModelChange={setPaginationBodyTempModel}
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
                      </div>,
                      stepId: <Stack sx={{ alignItems: 'center' }}>
                        <img src={Dashboard2} width={35} alt='' />
                        <span>Body Tempreture</span>
                      </Stack>,
                      isValidated: () => true,
                      isDisable: false,
                      hasParams: true,
                      paramsObj: {
                        name: 'bodyTemp'
                      },
                    },
                    {
                      stepName: 'Weight',
                      stepComponent: <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 className="card-title float-start">Weight details</h4>
                            <Link href=""
                              style={{ lineHeight: `25px` }}
                              className="btn btn-primary float-end" onClick={(e) => {
                                e.preventDefault();
                                setEdit(true)
                                setFormValue("value", initialState.value);
                                setFormValue("id", initialState.id);
                                setFormValue("userId", userProfile?._id);
                                setFormValue("name", stepName);
                                setFormValue("date", initialState.date);
                              }} >Add Weight </Link>
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
                                        handleChangePage: handleChangePage,
                                        handleChangeRowsPerPage: handleChangeRowsPerPage,
                                        count: rowWeightCount,
                                        SelectProps: {
                                          inputProps: {
                                            id: 'pagination-select',
                                            name: 'pagination-select',
                                          },
                                        },
                                      },
                                    }}
                                    rowHeight={screen.height / 15.2}
                                    rows={vitalSign.length > 0 && vitalSign[0]?.weight ? vitalSign[0]?.weight : []}
                                    rowCount={rowWeightCount}
                                    ref={grdiRefweight}
                                    columns={columns}
                                    paginationModel={paginationWeightModel}
                                    pageSizeOptions={[5, 10]}
                                    disableRowSelectionOnClick
                                    onPaginationModelChange={setPaginationWeightModel}
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
                      </div>,
                      stepId: <Stack sx={{ alignItems: 'center' }}>
                        <img src={Dashboard5} width={35} alt='' />
                        <span>Weight</span>
                      </Stack>,
                      isValidated: () => true,
                      isDisable: false,
                      hasParams: true,
                      paramsObj: {
                        name: 'weight'
                      },
                    },
                    {
                      stepName: 'Height',
                      stepComponent: <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 className="card-title float-start">Height details</h4>
                            <Link href=""
                              style={{ lineHeight: `25px` }}
                              className="btn btn-primary float-end" onClick={(e) => {
                                e.preventDefault();
                                setFormValue("value", initialState.value);
                                setFormValue("id", initialState.id);
                                setFormValue("userId", userProfile?._id);
                                setFormValue("name", stepName);
                                setFormValue("date", initialState.date);
                                setEdit(true)
                              }} >Add Height</Link>
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
                                        handleChangePage: handleChangePage,
                                        handleChangeRowsPerPage: handleChangeRowsPerPage,
                                        count: rowHeightCount,
                                        SelectProps: {
                                          inputProps: {
                                            id: 'pagination-select',
                                            name: 'pagination-select',
                                          },
                                        },
                                      },
                                    }}
                                    rowHeight={screen.height / 15.2}
                                    rows={vitalSign.length > 0 && vitalSign[0]?.height ? vitalSign[0]?.height : []}
                                    rowCount={rowHeightCount}
                                    ref={grdiRefHeight}
                                    columns={columns}
                                    paginationModel={paginationHeightModel}
                                    pageSizeOptions={[5, 10]}
                                    disableRowSelectionOnClick
                                    onPaginationModelChange={setPaginationHeightModel}
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
                      </div>,
                      stepId: <Stack sx={{ alignItems: 'center' }}>
                        <img src={Dashboard6} width={35} alt='' />
                        <span>Height</span>
                      </Stack>,
                      isValidated: () => true,
                      isDisable: false,
                      hasParams: true,
                      paramsObj: {
                        name: 'height'
                      },
                    },
                  ]
                } activeTab={stepName == 'heartRate' ? 0 : stepName == 'bodyTemp' ? 1 : stepName == 'weight' ? 2 : 3} />
              </>
          }

        </div>
      </div>
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            reset();
            setEdit(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={edit}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              reset();
              setEdit(false)
            }, 500);
          }}>
          {
            stepName == "heartRate" ? <img src={Dashboard1} width={35} alt='' />
              : stepName == "bodyTemp" ? <img src={Dashboard2} width={35} alt='' />
                : stepName == 'weight' ? <img src={Dashboard5} width={35} alt='' />
                  : <img src={Dashboard6} width={35} alt='' />
          }&nbsp;
          {getFormValues('value') == '' ? `Add new ${stepName}` : `Edit ${stepName}`}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="row form-row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <TextField
                    required
                    size="small"
                    label="Value"
                    variant='outlined'
                    fullWidth
                    id="name"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    onKeyDown={(e) => {
                      const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab']
                      if (!allowKeys.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    error={errors.value == undefined ? false : true}
                    helperText={errors.value && errors['value']['message'] as ReactNode}
                    {...register("value", {
                      required: "This field is required",
                    })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">
                        {
                          stepName == "heartRate" ? 'bpm'
                            : stepName == "bodyTemp" ? '℃'
                              : stepName == 'weight' ? '㎏'
                                : '㎝'
                        }
                      </InputAdornment>
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <Controller
                    rules={{
                      required: "This field is required",
                    }}
                    name='date'
                    control={control}
                    render={(props: any) => {
                      const { field, } = props;
                      const { value } = field;
                      const { ref, onChange } = field;
                      return (
                        <TextField
                          disabled
                          required
                          id='date'
                          label="Date"
                          size='small'
                          value={`${value ? `${dayjs(value).tz(process.env.TZ).format('YYYY MMM DD HH:mm:ss')}` : ''}`}
                          error={errors.date == undefined ? false : true}
                          helperText={errors.date && errors['date']['message'] as ReactNode}
                          fullWidth
                          ref={ref}
                          inputProps={{ style: { textTransform: 'lowercase' }, autoComplete: 'date' }}
                          onChange={(e: any) => {
                            onChange(e)
                          }}
                        />
                      )
                    }} />
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} >
              Submit
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
      <div className="modal fade  animate__animated animate__backInDown" id="delete_modal" aria-hidden="true" role="dialog" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document" >
          <div className="modal-content" >
            <div className="modal-body">
              <div className="form-content p-2">
                <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Delete</h4>
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
                <span style={{ display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
                  onClick={() => {
                    confirmDelete();
                  }}>Delete </button>
                  <button type="button" className="btnLogout" style={muiVar}
                    onClick={() => {
                      document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                      setTimeout(() => {
                        window.$('#delete_modal').modal("hide")
                      }, 500);

                    }}>Cancell</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default MedicalDetails;


