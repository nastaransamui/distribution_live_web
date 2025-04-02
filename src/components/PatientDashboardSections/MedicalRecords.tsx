/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, ReactNode, useMemo, useCallback } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { patient_profile } from '@/public/assets/imagepath';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueFormatterParams, GridColumnVisibilityModel, GridAlignment, GridRenderCellParams, GridFilterModel, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import UploadFile from '@mui/icons-material/UploadFile';
import DeleteForever from '@mui/icons-material/DeleteForever'
import Stack from '@mui/material/Stack';
import GetAppIcon from '@mui/icons-material/GetApp';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { DependentsTypes } from './Dependent';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent } from '../DoctorDashboardSections/ScheduleTiming';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Avatar from '@mui/material/Avatar';
import FormHelperText from '@mui/material/FormHelperText';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { PatientProfile } from '../DoctorDashboardSections/MyPtients';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RenderExpandableCell from '../shared/RenderExpandableCell';


export interface ValueType {
  id: number;
  name: string;
  date: string;
  description: string;
  attachment: string;
  orderBy: string;
  hospitalName?: string;
  symptoms?: string;
}

export interface PrisValueType {
  id: number;
  date: string;
  name: string;
  doctorName: string;
  doctorImage: string;
  speciality: string;
}

const initialState: MedicalRecordsType = {
  id: 0,
  createdAt: new Date(),
  firstName: "",
  lastName: "",
  dependentId: "",
  userId: "",
  updateAt: new Date(),
  date: new Date(),
  hospitalName: '',
  symptoms: '',
  description: "",
  documentLink: "",
  isForDependent: false,
}
export interface MedicalRecordsType {
  id: number;
  _id?: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  dependentId: string;
  userId: string;
  updateAt: Date;
  date: Date;
  hospitalName: string;
  symptoms: string;
  documentLink: string;
  description: string;
  isForDependent: boolean;
}

export interface MedicalRecordsComponentType {
  patientProfile: PatientProfile;
}
const MedicalRecords: FC<MedicalRecordsComponentType> = (({ patientProfile }) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const { muiVar, bounce } = useScssVar();
  const [edit, setEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const [dependents, setDependents] = useState<DependentsTypes[] | []>([])
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)


  const dispatch = useDispatch();


  const [_uploadDoc, setUploadDoc] = useState('')

  const [docName, setDocName] = useState("")
  const inputFileRef = useRef<any>(null)
  const theme = useTheme();
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [isView, setIsView] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRow] = useState<MedicalRecordsType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
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
        field: 'isForDependent',
        headerName: "Dependent",
        align: 'center',
        headerAlign: 'center',
        width: 150,
        sortable: true,
        filterable: true,
        type: "boolean",
        filterOperators: createCustomOperators().boolean,
        renderCell: (data: any) => {
          const { row } = data;
          const { isForDependent } = row;
          return (
            <>
              {isForDependent ? <DoneIcon sx={{ color: theme.palette.success.main }} /> : <CloseIcon sx={{ color: theme.palette.error.main }} />}
            </>
          )
        },
      },
      {
        field: "fullName",
        headerName: "Name",
        width: 210,
        sortable: true,
        filterable: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          const { isForDependent } = row;
          const src = isForDependent ? `${row?.dependentProfile?.profileImage}` : `${patientProfile?.profileImage}`
          return (
            <span style={{ minWidth: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar alt="" src={src} >
                <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
              </Avatar>&nbsp; &nbsp;
              {row.fullName}
            </span>
          )
        },
      },
      {
        field: 'date',
        headerName: "Date",
        align: 'center',
        type: 'dateTime',
        width: 190,
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.date ? dayjs(row.date).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Stack >
                <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
                <span style={{ justifyContent: 'center', display: 'flex', color: theme.palette.secondary.main }}>{dayjs(row.date).format(`HH:mm`)}</span>
              </Stack>
            </>
          )
        }
      },
      {
        field: 'description',
        headerName: "Description",
        width: 200,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.description == '' ? '===' : row?.description
        },
        renderCell(params: GridRenderCellParams) {
          return <RenderExpandableCell {...params} />
        }
      },
      {
        field: 'symptoms',
        headerName: "Symptoms",
        width: 200,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.symptoms == '' ? '===' : row?.symptoms
        },
        renderCell(params: GridRenderCellParams) {
          return <RenderExpandableCell {...params} />
        }
      },
      {
        field: 'hospitalName',
        headerName: "Hospital Name",
        width: 200,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.hospitalName == '' ? '===' : row?.hospitalName
        },
        renderCell(params: GridRenderCellParams) {
          return <RenderExpandableCell {...params} />
        }
      },
      {
        field: 'documentLink',
        headerName: "Attachment",
        width: 130,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        searchAble: false,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          return params.value == '' ? '--' : `${params.value}`
        },
        renderCell: (params: any) => {
          const { formattedValue } = params;
          return (
            <>

              {formattedValue == '--' ? `${formattedValue}` :
                <IconButton aria-label='download' onClick={() => {
                  if (formattedValue && formattedValue !== "--") {
                    const fileUrl = formattedValue;

                    // Open the URL in a new tab
                    const newTab = window.open(fileUrl, "_blank");
                    if (!newTab) {
                      alert("Pop-up blocked! Please allow pop-ups for this website.");
                    }
                  }
                }} disableFocusRipple disableRipple disableTouchRipple >
                  <GetAppIcon sx={{ color: theme.palette.primary.main }} />
                </IconButton>
              }
            </>
          )
        }
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.createdAt ? dayjs(row.createdAt).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
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
        headerName: "Last update",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter(params: GridValueGetterParams) {
          const { row } = params;
          return row.updateAt ? dayjs(row.updateAt).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.updateAt).format(`DD MMM YYYY`)}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.updateAt).format(`HH:mm`)}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        align: 'center',
        searchAble: false,
        sortable: false,
        filterable: false,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem icon={<DeleteForever sx={{ color: 'crimson' }} />} onClick={() => { deleteClicked(params) }} label="Edit" />,
          <GridActionsCellItem
            key="view-action"
            onClick={() => {
              Object.entries(params.row).forEach(([key, value]) => {
                setIsView(true)
                if (key !== "_id") {
                  setFormValue(key as keyof MedicalRecordsType, value as string | number | boolean | Date | undefined);
                }
                setEdit(true)
              })
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
        homeSocket?.current.emit('getMedicalRecordWithDependent', {
          userId: userId,
          paginationModel,
          sortModel,
          mongoFilterModel
        });
        homeSocket.current.once('getMedicalRecordWithDependentReturn', (msg: {
          status: number,
          message?: string,
          medicalRecords: MedicalRecordsType[],
          totalMedical: number
        }) => {
          const { status, message } = msg;
          if (status !== 200) {
            toast.error(message || `Error ${status} find medical`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: "medical",
              onClose: () => {
                setIsLoading(false)
                toast.dismiss('medical')
              }
            });
          } else {
            const { medicalRecords, totalMedical } = msg;
            setUploadDoc('')
            setRowCount(totalMedical)
            setRow(medicalRecords)
            setDocName('')
            homeSocket.current.once(`updateGetMedicalRecordWithDependent`, () => {
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


  const handleChangeInputFile = (e: any) => {
    var fileToRead: any = document.getElementById("profile");
    if (fileToRead !== null) {
      var file = fileToRead.files[0]
      if (file?.size > 2000000) {
        toast.error(`Image size should be less than 2 Mb`, {
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
        setUploadDoc(URL.createObjectURL(file))
        setDocName(e.target.files[0].name)
      }
    }

    if (e.target.files[0]) {
      setDocName(e.target.files[0].name)
    }
  }
  const handleClickInputFile = () => {
    if (inputFileRef.current !== null) {
      inputFileRef.current.click()
    }

  }
  const [deleteId, setDeleteId] = useState<string>()
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row._id))
    setShowDelete(true);
  }
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
  } = useForm<MedicalRecordsType>({
    defaultValues: {
      ...initialState,
      userId: patientProfile?._id,
      firstName: patientProfile?.firstName,
      lastName: patientProfile?.lastName
    }
  })



  const onSubmitCreateMedicalRecord = (data: any) => {
    var fileToRead: any = document.getElementById("profile");
    delete data.createdAt
    delete data.updateAt
    data.documentFiles = [];
    var file;
    if (fileToRead.files.length !== 0) {
      file = fileToRead.files[0]
      data.documentFiles.push({
        document: file,
        documentName: file.name,
        documentExtentionNoDot: file.name.slice(file.name.indexOf('.') + 1)
      });
    }
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('updateMedicalRecord', data)
      homeSocket.current.once('updateMedicalRecordReturn', (msg: { status: number, message?: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} udpate Medical Record`, {
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
              setDependents([])
            }
          });
        } else {
          dispatch(updateHomeFormSubmit(false))
          setDependents([])
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          reset();
          clearErrors();
          setTimeout(() => {
            setEdit(false)
          }, 500);
        }
      })

    }
  }

  const deleteSubmited = () => {
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('deleteMedicalRecord', { userId: patientProfile?._id, deleteId })
      homeSocket.current.once('deleteMedicalRecordReturn', (msg: { status: number, message?: string, }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} delete Medical Record`, {
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
          setDeleteId("")
          setTimeout(() => {
            setShowDelete(false)
          }, 500);
        }
      })
    }

  }

  const openMedicalModalWithGetDependents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/getDependents?_id=${patientProfile?._id}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${patientProfile?.accessToken}`
        }
      })
      const data = await res.json();
      if (data?.error) {
        toast.error(data?.error || `Error  find dependents`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          toastId: "dependents",
          onClose: () => {
            setIsLoading(false)
            toast.dismiss('dependents')
          }
        });
      }
      if (data?.success) {
        setDependents(data.dependents)
        setEdit(true);
        setIsView(false);
        setFormValue("id", 0);
        setFormValue('createdAt', new Date());
        setFormValue("firstName", patientProfile?.firstName);
        setFormValue("lastName", patientProfile?.lastName);
        setFormValue("dependentId", '');
        setFormValue("userId", patientProfile?._id);
        setFormValue('updateAt', new Date());

        setFormValue("hospitalName", '');
        setFormValue("symptoms", '');
        setFormValue("documentLink", '');
        setFormValue("description", '');
      }
    } catch (error: any) {
      toast.error(error.toString() || `Error  find dependents`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
        toastId: "dependents",
        onClose: () => {
          setIsLoading(false)
          toast.dismiss('dependents')
        }
      });
    }
  }


  return (
    <Fragment>

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
                <span style={{ position: "relative" }}>
                  <Typography className="totalTypo"
                    variant='h5' align='center' gutterBottom >
                    {
                      rowCount !== 0 ?
                        `Total Medical records: ${rowCount}` :
                        `Not  Medical records yet`
                    }
                  </Typography>
                  <Link href=""
                    style={{ lineHeight: `25px`, margin: 0, position: 'absolute', top: 0, right: 0 }}
                    className="add-new-btn float-end" onClick={(e) => {
                      e.preventDefault();
                      openMedicalModalWithGetDependents()
                    }} >Add Medical Records</Link>
                </span>
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
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          reset();
          clearErrors();
          setUploadDoc('')
          setDocName('')
          setDependents([])
          setTimeout(() => {
            setEdit(false)
            setIsView(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={edit}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            reset();
            clearErrors();
            setUploadDoc('')
            setDocName('')
            setDependents([])
            setTimeout(() => {
              setEdit(false)
              setIsView(false)
            }, 500);
          }}>
          <Stack>
            <span>{isView ? `View Medical Record` : `Add Medical Records`}</span>
            <Controller
              name="isForDependent"
              control={control}
              render={(props: any) => {
                const { field } = props;
                const { value: formValue } = field;
                window.mobileCheck = function () {
                  let check = false;
                  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                  return check;
                };
                let isMobile = window?.mobileCheck()
                return (
                  <FormControl>
                    {isMobile && <FormLabel id="isForDependent">{'isForDependent'}</FormLabel>}

                    <RadioGroup
                      row
                      aria-labelledby="isForDependent"
                      name="row-radio-buttons-group"
                      value={formValue}
                      onChange={(e) => {
                        const { value } = e.target
                        value == 'false' ? setFormValue('isForDependent', false) : setFormValue('isForDependent', true);
                        if (value == 'false') {
                          setFormValue('firstName', patientProfile?.firstName)
                          setFormValue('lastName', patientProfile?.lastName)
                        }
                      }}
                    >
                      <Tooltip
                        followCursor
                        title={isMobile ?
                          '' :
                          isView ?
                            '' : 'Add medical record for my dependnt'}
                        arrow>
                        <FormControlLabel
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: muiVar['--color']
                            }
                          }} value="true" name='active' control={
                            <Radio
                              disabled={isView || patientProfile?.dependentsArray.length == 0}
                              disableFocusRipple
                              disableRipple
                              disableTouchRipple color='secondary' />} label={'For my dependents'} />

                      </Tooltip>
                      <Tooltip followCursor
                        title={
                          isMobile ?
                            '' :
                            isView ?
                              '' :
                              'Add medical record for my self'
                        } arrow>
                        <FormControlLabel
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: muiVar['--color']
                            }
                          }} value="false" name='deactivate' control={
                            <Radio
                              disableFocusRipple
                              disableRipple
                              disableTouchRipple
                              disabled={isView || patientProfile?.dependentsArray.length == 0}
                              sx={{
                                color: isView ? theme.palette.text.disabled : 'crimson',
                                '&, &.Mui-checked': {
                                  color: isView ? theme.palette.text.disabled : 'crimson',
                                },
                              }} />} label={'For my self'} />
                      </Tooltip>
                    </RadioGroup>
                  </FormControl>
                )
              }}
            />
          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form noValidate onSubmit={handleSubmit(onSubmitCreateMedicalRecord)}>
            <div className="row form-row">
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    required
                    size="small"
                    variant='outlined'
                    label="First Name"
                    disabled={isView || getFormValues('isForDependent')}
                    fullWidth
                    id="firstName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.firstName == undefined ? false : true}
                    helperText={errors.firstName && errors['firstName']['message'] as ReactNode}
                    {...register("firstName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    required
                    disabled={isView || getFormValues('isForDependent')}
                    size="small"
                    variant='outlined'
                    label="Last Name"
                    fullWidth
                    id="lastName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.lastName == undefined ? false : true}
                    helperText={errors.lastName && errors['lastName']['message'] as ReactNode}
                    {...register("lastName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              {watch('isForDependent') && <div className="col-12 col-sm-6">
                <div className="form-group">
                  <Controller
                    rules={{ required: 'This field is required' }}
                    name='dependentId'
                    control={control}
                    render={(props: any) => {
                      const { field, } = props;
                      const { onChange, value } = field;
                      return (
                        <FormControl fullWidth >
                          <InputLabel id="dependent-label" htmlFor="dependent" size='small'>
                            Dependents
                          </InputLabel>
                          <Select
                            labelId="dependent"
                            disabled={isView}
                            inputProps={{
                              id: 'dependent',
                              name: 'dependent',
                              autoComplete: 'off'
                            }}
                            label="Dependents"
                            error={errors.dependentId == undefined ? false : true}
                            value={isView ? '' : value}
                            onChange={(e: SelectChangeEvent) => {
                              setFormValue('firstName', dependents.filter((a) => a._id == e.target.value)[0]?.firstName)
                              setFormValue('lastName', dependents.filter((a) => a._id == e.target.value)[0]?.lastName)
                              onChange(e)
                            }}
                            size='small'
                            renderValue={(selected) => dependents.filter((a) => a._id == selected)[0]?.id}
                          >
                            {
                              dependents.map((dependent, index) => {
                                return (
                                  <MenuItem key={dependent._id} value={dependent._id}>
                                    {
                                      <>
                                        <Avatar alt="" src={dependent.profileImage} >
                                          <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                                        </Avatar>&nbsp; &nbsp;
                                        {dependent.firstName} {" "} {dependent.lastName}
                                      </>
                                    }
                                  </MenuItem>
                                )
                              })
                            }
                          </Select>
                          {
                            errors.dependentId &&
                            <FormHelperText error>{errors.dependentId && errors['dependentId']['message'] as ReactNode}</FormHelperText>
                          }
                        </FormControl>
                      )
                    }}
                  />
                </div>
              </div>}
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    required
                    size="small"
                    variant='outlined'
                    label="Hospital Name"
                    fullWidth
                    disabled={isView}
                    id="hospital"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.hospitalName == undefined ? false : true}
                    helperText={errors.hospitalName && errors['hospitalName']['message'] as ReactNode}
                    {...register("hospitalName", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>

              <div className={`col-12 ${watch('isForDependent') ? '' : 'col-sm-6'}`}>
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <Controller
                    rules={{ required: 'This field is required' }}
                    name='date'
                    control={control}
                    render={(props: any) => {
                      const { field } = props;
                      const { onChange, value } = field;
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDateTimePicker
                            value={value ? dayjs(value) : null}
                            ampm={false}
                            closeOnSelect
                            disableFuture
                            format="DD MMM YYYY HH:mm"
                            onChange={(event: Dayjs | null) => {
                              onChange(new Date(dayjs(event).format(`YYYY-MM-DD HH:mm`)));
                            }}
                            slotProps={{
                              textField: {
                                inputProps: { value: value == '' ? 'Date' : dayjs(value).format('DD MMM YYYY HH:mm') },
                                fullWidth: true,
                                required: true,
                                label: 'Date',
                                error: errors.date == undefined ? false : true,
                                helperText: errors.date && errors['date']['message'] as ReactNode,
                                size: 'small',
                                disabled: isView
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )
                    }}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    variant='outlined'
                    multiline
                    minRows={5}
                    size="small"
                    fullWidth
                    required
                    disabled={isView}
                    id="symptoms"
                    inputProps={{
                      autoComplete: "off"
                    }}
                    label={`Symptoms`}
                    error={errors.symptoms == undefined ? false : true}
                    helperText={errors.symptoms && errors['symptoms']['message'] as ReactNode}
                    {...register("symptoms", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    variant='outlined'
                    multiline
                    minRows={5}
                    size="small"
                    fullWidth
                    required
                    disabled={isView}
                    id="description"
                    inputProps={{
                      autoComplete: "off"
                    }}
                    label={`Description`}
                    error={errors.description == undefined ? false : true}
                    helperText={errors.description && errors['description']['message'] as ReactNode}
                    {...register("description", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    size="small"
                    required
                    value={docName}
                    id="docName"
                    inputProps={{
                      autoComplete: "off"
                    }}
                    disabled
                    label={'Document'}
                    InputProps={{
                      endAdornment:
                        <InputAdornment position="start" onClick={() => {
                          if (!isView) {
                            handleClickInputFile()
                          }
                        }} style={{ cursor: isView ? 'unset' : "pointer" }}>
                          <UploadFile sx={{
                            color: isView ? theme.palette.text.disabled : theme.palette.primary.main
                          }} />
                        </InputAdornment>,
                    }}
                  />
                  <input
                    type="file"
                    id='profile'
                    accept="
                          image/png,
                          image/jpg,
                          image/jpeg,
                          application/msword,
                          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                          application/pdf,
                          text/plain,
                          application/vnd.ms-excel,
                          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                          application/vnd.ms-powerpoint,
                          application/vnd.openxmlformats-officedocument.presentationml.presentation,
                          application/vnd.oasis.opendocument.text,
                          application/vnd.oasis.opendocument.spreadsheet,
                          application/vnd.oasis.opendocument.presentation
                      "
                    ref={inputFileRef}
                    onChange={handleChangeInputFile}
                    style={{ display: "none" }} />
                </div>
              </div>
            </div>
            {!isView && <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} >
              Submit
            </button>}
          </form>
        </DialogContent>
      </BootstrapDialog>}
      {showDelete && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setDeleteId("")
          setTimeout(() => {
            setShowDelete(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={showDelete}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setDeleteId("")
            setTimeout(() => {
              setShowDelete(false)
            }, 500);
          }}>
          <Stack>
            <span>Delete</span>

          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Delete</h4>
          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
          <span style={{ ...muiVar, display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              deleteSubmited()
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                setDeleteId("")
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

export default MedicalRecords;


