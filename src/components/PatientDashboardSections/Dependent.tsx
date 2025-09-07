/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, ReactNode, useMemo, useCallback } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { patient_profile } from '@/public/assets/imagepath';

//Mui

import Edit from "@mui/icons-material/Edit";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRowId, GridValueFormatterParams, GridColumnVisibilityModel, GridRenderCellParams, GridFilterModel, GridSortModel } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { DeleteForever, UploadFile } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormHelperText from '@mui/material/FormHelperText';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent } from '../DoctorDashboardSections/ScheduleTiming';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from 'next/link';



export interface DependentsTypes {
  _id?: string | undefined;
  createdAt: Date;
  firstName: string;
  lastName: string;
  dob: Date | "";
  bloodG: string;
  profileImage: string;
  gender: string;
  isActive: boolean;
  relationShip: string;
  id: number;
  updateAt: Date;
  userId: string;
}
const initialState: DependentsTypes = {
  userId: "",
  createdAt: new Date(),
  firstName: "",
  lastName: "",
  dob: '',
  bloodG: '',
  profileImage: "",
  gender: "",
  isActive: true,
  relationShip: "",
  id: 0,
  updateAt: new Date(),
}

const Dependent: FC = (() => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const { bounce, muiVar } = useScssVar();
  const theme = useTheme();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [rows, setRows] = useState<DependentsTypes[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [reload, setReload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const perPage = 5
  const [edit, setEdit] = useState(false);
  const dataGridRef = useRef<any>(null)
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')

  const dispatch = useDispatch();

  const [uploadImage, setUploadImage] = useState(patient_profile)


  const [imageName, setImageName] = useState("")
  const inputFileRef = useRef<any>(null)
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
        setUploadImage(URL.createObjectURL(file))
        setImageName(e.target.files[0].name)
      }
    }

    if (e.target.files[0]) {
      setImageName(e.target.files[0].name)
    }
  }
  const handleClickInputFile = () => {
    if (inputFileRef.current !== null) {
      inputFileRef.current.click()
    }

  }

  const [deleteId, setDeleteId] = useState<GridRowId[]>([])
  const deleteClicked = () => {

    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
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
    const editClicked = (params: GridRowParams) => {
      setEdit(true)

      if (params?.row?.profileImage == '') {
        setImageName('')
      } else {
        const url = params?.row?.profileImage
        const fileName = url.split('/').pop()?.split('?')[0];
        setImageName(fileName)
        setUploadImage(url);
      }

      const profileEntries = Object.entries(params.row) as [keyof DependentsTypes, DependentsTypes[keyof DependentsTypes]][]; // Explicitly type the entries

      profileEntries.forEach(([key, value]) => {
        setFormValue(key, value); // Ensure key is passed as a string
      });
    }
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
        field: 'fullName',
        headerName: "Dependent",
        width: 210,
        headerAlign: 'center',
        align: 'center',
        filterable: true,
        searchAble: true,
        sortable: true,
        type: 'string',
        filterOperators: createCustomOperators().string,
        renderCell: (data: any) => {
          const { row } = data;
          const { profileImage } = row;
          const src = profileImage == '' ? patient_profile : `${row.profileImage}`
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
        field: 'gender',
        headerName: 'Gender',
        width: 150,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter(params: GridRenderCellParams) {
          const { row } = params;
          return row?.gender == '' ? '===' : row?.gender
        },
      },
      {
        field: 'relationShip',
        headerName: 'Relation ',
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
          return row?.relationShip == '' ? '===' : row?.relationShip
        },
      },
      {
        field: 'dob',
        headerName: "Date of Birth",
        width: 190,
        align: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter: (params) => {
          const { row } = params;
          return row?.dob ? dayjs(row?.dob).toDate() : null;
        },
        sortComparator: (v1, v2) => {
          if (typeof v1 !== 'string' && typeof v2 !== 'string') {
            return dayjs(v1).isAfter(dayjs(v2)) ? 1 : -1
          }
          return 1
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const { dob } = row;
          //@ts-ignore
          let { years, months, days } = dayjs.preciseDiff(dob, dayjs(), true)
          return (
            <Stack direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}>
              <Link href="#" onClick={(e) => e.preventDefault()} >
                {dob !== '' ? dayjs(dob).format('DD MMM YYYY') : '---- -- --'}
              </Link>
              {dob !== '' && <Link href="#" onClick={(e) => e.preventDefault()} >
                <i className="fas fa-birthday-cake"></i>{"  "}
                {`${isNaN(years) ? '--' : years} years`}
              </Link>}
            </Stack>
          )
        }
      },
      {
        field: 'bloodG',
        headerName: `Blood Group`,
        align: 'center',
        width: 140,
        type: 'string',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        headerAlign: 'center',
        valueGetter: (params) => {
          const { row } = params;
          return row?.bloodG == '' ? '===' : `🩸${row?.bloodG}`
        },
      },
      {
        field: 'createdAt',
        headerName: "Created",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter: (params) => {
          const { row } = params;
          return row?.createdAt ? dayjs(row?.createdAt).toDate() : null;
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
        valueGetter: (params) => {
          const { row } = params;
          return row?.updateAt ? dayjs(row?.updateAt).toDate() : null;
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
        field: 'medicalRecordsArray',
        headerName: "Medical Records",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: true,
        searchAble: false,
        valueGetter: (params) => {
          const medicalRecordsArray = params?.row?.medicalRecordsArray;
          return medicalRecordsArray.length;
        },
        sortComparator: (v1: any, v2: any) => {
          return v1 > v2 ? 1 : -1
        },
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          return `${params?.value} record${params?.value <= 1 ? "" : 's'}`
        },
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        width: 150,
        align: 'center',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem icon={
            !params.row.isActive ?
              <Tooltip arrow title="Deactive">
                <ToggleOffIcon sx={{ color: theme.palette.text.disabled }} fontSize='small' />
              </Tooltip> :
              <Tooltip arrow title="Active">
                <ToggleOnIcon sx={{ color: 'crimson' }} fontSize='small' />
              </Tooltip>} label="Deactive" />,
          <GridActionsCellItem icon={<Edit color="secondary" />} onClick={() => { editClicked(params) }} label="Edit" />,
          <GridActionsCellItem
            disabled={params.row?.medicalRecordsArray?.length !== 0}
            icon={
              <DeleteForever
                sx={{
                  color: params.row?.medicalRecordsArray?.length == 0 ?
                    'crimson' :
                    theme.palette.text.disabled
                }} />}
            onClick={() => {
              if (params.row?.medicalRecordsArray?.length == 0) {
                setDeleteId(() => [params?.row._id])
                deleteClicked()
              }
            }} label="Edit" />
        ]
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
      let userId = userProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket.current.emit('getPatientDependent', { userId: userId, paginationModel, sortModel, mongoFilterModel, })
        homeSocket.current.once('getPatientDependentReturn', (msg: { status: number, message?: string, dependents: DependentsTypes[], totalDepends: number }) => {
          const { status, message } = msg;
          if (status !== 200) {
            toast.error(message || `Error ${status} find Dependent`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: "dependent",
              onClose: () => {
                setIsLoading(false)
                toast.dismiss("dependent")
              }
            });
          } else {
            const { dependents, totalDepends } = msg;
            setRows(dependents)
            setUploadImage(patient_profile)
            setRowCount(totalDepends)
            setImageName('')
            homeSocket.current.once(`updateGetPatientDependent`, () => {
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
  }, [homeSocket, paginationModel, sortModel, mongoFilterModel, reload])


  const onSubmitCreateDependents = (data: any) => {
    var fileToRead: any = document.getElementById("profile");
    delete data.createdAt
    delete data.updateAt
    data.profileImageFiles = [];
    var file;
    if (fileToRead.files.length !== 0) {
      file = fileToRead.files[0]
      data.profileImageFiles.push({
        profileImage: file,
        profileImageName: file.name,
        profileImageExtentionNoDot: file.name.slice(file.name.indexOf('.') + 1)
      });
    }
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('updateDependent', data)
      homeSocket.current.once('updateDependentReturn', (msg: { status: number, message?: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} udpate Dependent`, {
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

          reset();
          clearErrors();
          setTimeout(() => {
            setEdit(false)
          }, 500);
        }
      })

    }
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
  } = useForm({
    defaultValues: {
      ...initialState,
      userId: userProfile?._id
    }
  })
  const deleteSubmited = () => {
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('deleteDependent', { userId: userProfile?._id, deleteId })
      homeSocket.current.once('deleteDependentReturn', (msg: { status: number, message?: string, }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} delete Dependent`, {
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
          setDeleteId([])
          const modal = document.getElementById('delete_modal');
          modal?.classList.replace('animate__backInDown', 'animate__backOutDown');

          if (document.activeElement && modal?.contains(document.activeElement)) {
            (document.activeElement as HTMLElement).blur();
          }

          // hide after animation ends
          setTimeout(() => {
            window.$('#delete_modal').modal("hide");
          }, 500);
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
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
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
                  <span style={{ position: "relative", display: 'block', marginBottom: '25px' }}>
                    <Typography className="totalTypo"
                      variant='h5' align='center' gutterBottom >
                      {
                        rowCount !== 0 ?
                          `Total Dependents: ${rowCount}` :
                          `Not any Dependents yet`
                      }
                    </Typography>
                    {rowCount <= 20 &&
                      <button type="button"
                        style={{ lineHeight: `25px`, margin: 0, position: 'absolute', top: 0, right: 0 }}
                        className="add-new-btn float-end" onClick={(e) => {
                          setEdit(true)
                        }} >Add Dependent</button>}
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
                          deleteId: deleteId,
                          deleteClicked: deleteClicked,
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
                        return params?.row?.medicalRecordsArray?.length == 0;
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
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(_event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          reset();
          clearErrors();
          setUploadImage(patient_profile)
          setImageName('')
          setTimeout(() => {
            setEdit(false)
          }, 500);

        }}
        aria-labelledby="edit_invoice_details"
        open={edit}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details"
          onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            reset();
            clearErrors();
            setUploadImage(patient_profile)
            setImageName('')
            setTimeout(() => {
              setEdit(false)
            }, 500);
          }}>
          {uploadImage !== '' && <Avatar
            alt=""
            src={uploadImage as string}
            sx={{ mr: 1 }} />}
          {watch("firstName")} {" "} {watch("lastName")}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form noValidate onSubmit={handleSubmit(onSubmitCreateDependents)}>
            <div className="row form-row">
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    required
                    size="small"
                    label="First Name"
                    variant='outlined'
                    fullWidth
                    id="name"
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
                    size="small"
                    label="Last Name"
                    variant='outlined'
                    fullWidth
                    id="name"
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
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    required
                    size="small"
                    label="Relation Ship"
                    variant='outlined'
                    fullWidth
                    id="name"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    error={errors.relationShip == undefined ? false : true}
                    helperText={errors.relationShip && errors['relationShip']['message'] as ReactNode}
                    {...register("relationShip", {
                      required: "This field is required",
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <Controller
                    name='dob'
                    control={control}
                    render={(props: any) => {
                      const { field } = props;
                      const { onChange, value } = field;
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            closeOnSelect
                            disableFuture
                            format="DD MMM YYYY"
                            onChange={(event: Dayjs | null) => {
                              onChange(new Date(dayjs(event).format(`YYYY-MM-DD`)));
                            }}
                            slotProps={{
                              textField: {
                                inputProps: { value: value == '' ? 'Date of Birth' : dayjs(value).format('DD MMM YYYY') },
                                fullWidth: true,
                                required: true,
                                label: 'Date of Birth',
                                error: errors.dob == undefined ? false : true,
                                helperText: errors.dob && errors['dob']['message'] as ReactNode,
                                size: 'small'
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <Controller
                    name='gender'
                    control={control}
                    render={(props: any) => {
                      const { field } = props;
                      const { onChange, value } = field;
                      return (
                        <FormControl fullWidth >
                          <InputLabel size='small' id="gender-label" htmlFor="gender">
                            Gender
                          </InputLabel>
                          <Select
                            labelId="gender-label"
                            inputProps={{
                              id: 'gender',
                              name: 'gender'
                            }}
                            label="Gender"
                            error={errors.gender == undefined ? false : true}
                            value={value}
                            onChange={(e: SelectChangeEvent) => {
                              onChange(e)
                            }}
                            renderValue={(value) => `${value == 'Mr' ? `👨` : `👩`} ${value}`}
                            size='small'
                          >
                            <MenuItem value="Mr">👨 Mr</MenuItem>
                            <MenuItem value="Mrs">👩 Mrs</MenuItem>
                            <MenuItem value="Ms">👩 Mss</MenuItem>
                          </Select>
                          {
                            errors.gender &&
                            <FormHelperText error>{errors.gender && errors['gender']['message'] as ReactNode}</FormHelperText>
                          }
                        </FormControl>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <Controller
                    name='bloodG'
                    control={control}
                    render={(props: any) => {
                      const { field } = props;
                      const { onChange, value } = field;
                      return (
                        <FormControl fullWidth >
                          <InputLabel size='small' id="bloodGLable" htmlFor="blood">
                            Blood Group
                          </InputLabel>
                          <Select
                            labelId="bloodGLable"
                            inputProps={{
                              id: "blood",
                              name: 'blood'
                            }}
                            label="Blood Group"
                            error={errors.bloodG == undefined ? false : true}
                            value={value}
                            onChange={(e: SelectChangeEvent) => {
                              onChange(e)
                            }}
                            renderValue={(value) => `🩸  - ${value}`}
                            size='small'
                          >
                            <MenuItem value="A+">🅰️ A+</MenuItem>
                            <MenuItem value="A-">🅰️ A-</MenuItem>
                            <MenuItem value="B+">🅱️ B+</MenuItem>
                            <MenuItem value="B-">🅱️ B-</MenuItem>
                            <MenuItem value="AB+">🆎 AB+</MenuItem>
                            <MenuItem value="BA-">🆎 AB-</MenuItem>
                            <MenuItem value="O+">🅾️ O+</MenuItem>
                            <MenuItem value="O-">🅾️ O-</MenuItem>
                          </Select>
                          {
                            errors.bloodG &&
                            <FormHelperText error>{errors.bloodG && errors['bloodG']['message'] as ReactNode}</FormHelperText>
                          }
                        </FormControl>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <Fragment>
                    <TextField
                      variant='outlined'
                      fullWidth
                      size="small"
                      required
                      value={imageName}
                      id="imageName"
                      disabled
                      label={'Photo'}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="start" onClick={handleClickInputFile} style={{ cursor: "pointer" }}>
                            <UploadFile color="primary" />
                          </InputAdornment>,
                      }}
                    />
                    <input type="file" id='profile' accept="image/png, image/jpg, image/jpeg" ref={inputFileRef} onChange={handleChangeInputFile} style={{ display: "none" }} />
                  </Fragment>
                </div>
              </div>
              <div className={`col-xl-12 col-md-12 col-sm-12`}>
                <div className="form-group">
                  <Controller
                    name='isActive'
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
                          {isMobile && <FormLabel id="isActive">{'isActive'}</FormLabel>}
                          <Tooltip followCursor title={isMobile ? '' : 'isActive'} arrow>
                            <RadioGroup
                              row
                              aria-labelledby="isActive"
                              name="row-radio-buttons-group"
                              value={formValue}
                              onChange={(e) => {
                                const { value } = e.target
                                value == 'false' ? setFormValue('isActive', false) : setFormValue('isActive', true);
                              }}
                            >
                              <FormControlLabel
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    color: muiVar['--color']
                                  }
                                }} value="true" name='active' control={<Radio color='secondary' />} label={'Active'} />
                              <FormControlLabel
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    color: muiVar['--color']
                                  }
                                }} value="false" name='deactivate' control={<Radio sx={{
                                  color: 'crimson',
                                  '&, &.Mui-checked': {
                                    color: 'crimson',
                                  },
                                }} />} label={'Deactive'} />
                            </RadioGroup>
                          </Tooltip>
                        </FormControl>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    size='small'
                    label="Created At"
                    id="createdAt"
                    value={dayjs(getFormValues('createdAt')).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD HH:mm')}
                    disabled
                    fullWidth
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <TextField
                    size='small'
                    label="Created At"
                    id="createdAt"
                    value={dayjs(getFormValues('updateAt')).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD HH:mm')}
                    disabled
                    fullWidth
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} >
              Save changes
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
      <div className="modal fade  animate__animated animate__backInDown" id="delete_modal" aria-hidden="true" role="dialog" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document" >
          <div className="modal-content" >
            <div className="modal-body">
              <div className="form-content p-2">
                <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>
                  Delete Dependent
                </h4>
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete {deleteId.length} {`dependent${deleteId.length == 1 ? '' : 's'}`}  from your dependents?</p>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="button" className="btnLogin mx-1"
                    onClick={() => {
                      deleteSubmited()
                    }}> Confirm </button>
                  <button type="button" className="btnLogout" style={muiVar}
                    onClick={() => {
                      const modal = document.getElementById('delete_modal');
                      modal?.classList.replace('animate__backInDown', 'animate__backOutDown');

                      if (document.activeElement && modal?.contains(document.activeElement)) {
                        (document.activeElement as HTMLElement).blur();
                      }

                      // hide after animation ends
                      setTimeout(() => {
                        window.$('#delete_modal').modal("hide");
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

export default Dependent;


