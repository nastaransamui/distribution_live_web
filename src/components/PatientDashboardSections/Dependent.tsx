/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, ReactNode, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { patient_profile } from '@/public/assets/imagepath';

//Mui

import Edit from "@mui/icons-material/Edit";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRowId, GridValueFormatterParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
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
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import FormHelperText from '@mui/material/FormHelperText';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';



export interface DependentsTypes {
  _id?: string | undefined;
  createdAt: Date;
  firstName: string;
  lastName: string;
  dob: string;
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
  const { muiVar, bounce } = useScssVar();
  const [edit, setEdit] = useState(false);
  const theme = useTheme()
  const grdiRef = useRef<any>(null)
  const [dependents, setDependents] = useState<DependentsTypes[] | []>([])
  const dispatch = useDispatch();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowCount, setRowCount] = useState<number>(0)
  const perPage = 5;
  const [uploadImage, setUploadImage] = useState(patient_profile)
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

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
      // createSetValue('image', e.target.files[0])
      // createClearErrors('image')
      // setEditValues((prevState) => {
      //   return {
      //     ...prevState,
      //     profileImage: URL.createObjectURL(e.target.files[0])
      //   }
      // })
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
    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
  }

  const columns: GridColDef[] = useMemo(() => {
    const editClicked = (params: GridRowParams) => {
      setEdit(true)

      if (params?.row?.profileImage == '') {
        setImageName('')
      } else {
        const url = params?.row?.profileImage
        const fileName = url.split('/').pop();
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
        width: 20,
        align: 'center',
        headerAlign: 'center'
      },
      {
        field: 'name',
        headerName: "Dependent",
        width: 210,
        headerAlign: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          const { profileImage } = row;
          const src = profileImage == '' ? patient_profile : `${row.profileImage}?random=${new Date().getTime()}`
          return (
            <>
              <Avatar alt="" src={src} >
                <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
              </Avatar>&nbsp; &nbsp;
              {row.firstName} {" "} {row.lastName}
            </>
          )
        },
      },
      {
        field: 'gender',
        headerName: 'Gender',
        width: 100,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'relationShip',
        headerName: 'Relation ',
        width: 100,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'dob',
        headerName: "Date of Birth",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>{row.dob == "" ? "MMMM D, YYYY" : dayjs(row.dob).format(`MMMM D, YYYY`)}</>
          )
        }
      },
      {
        field: 'bloodG',
        headerName: "Blood Group",
        width: 100,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          return params.value == '' ? '--' : `🩸${params.value}`
        },
      },

      {
        field: 'createdAt',
        headerName: "Created",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>{dayjs(row.createdAt).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD HH:mm')}</>
          )
        }
      },
      {
        field: 'updateAt',
        headerName: "Last update",
        width: 200,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>{dayjs(row.updateAt).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD HH:mm')}</>
          )
        }
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
          <GridActionsCellItem icon={<DeleteForever color="error" />} onClick={() => { deleteClicked(params) }} label="Edit" />
        ]
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependents, reload])
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
  useEffect(() => {
    let isActive = true;
    if (isActive) {
      let userId = userProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket.current.emit('getPatientDependent', { userId: userId, ...dataGridFilters })
        homeSocket.current.once('getPatientDependentReturn', (msg: { status: number, message?: string, dependents: DependentsTypes[], totalDepends: number }) => {
          const { status, message, dependents, totalDepends } = msg;
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
            setDependents(dependents)
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
  }, [homeSocket, userProfile?._id, reload, dataGridFilters])


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
        skip: maximuPage <= 0 ? 0 : maximuPage
      }
    })
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {

    setDataGridFilters((prevState) => {
      return {
        limit: perPage !== paginationModel.pageSize ? paginationModel.pageSize : perPage * value,
        skip: (value - 1) * perPage,
      }
    })
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }

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
          document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setDeleteId('')
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
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-sm-6" style={{ display: "flex", alignItems: 'center' }}>
                <h3 className="card-title">Dependent</h3>
              </div>
              <div className="col-sm-6">
                <button type="button"
                  className="btnLogin  float-end mt-2" style={muiVar}
                  onClick={() => {
                    setEdit(true)
                  }}
                >Add Dependent</button>
              </div>
            </div>
          </div>
          {isLoading ?
            <CircleToBlockLoading color={theme.palette.primary.main} size="small"
              style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} />
            :
            <div className="table-responsive" style={{ height: 580, width: '100%' }}>
              <DataGrid
                paginationMode='server'
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
                rows={dependents}
                rowCount={rowCount}
                ref={grdiRef}
                columns={columns}
                paginationModel={paginationModel}
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
            </div>
          }

        </div>
      </div>
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
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
                    // rules={{ required: 'This field is required' }}
                    name='dob'
                    control={control}
                    render={(props: any) => {
                      const { field, fieldState, formState } = props;
                      const { ref, onChange, value } = field;
                      const { defaultValues } = formState;
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            closeOnSelect
                            disableFuture
                            format="DD MMM YYYY"
                            onChange={(event) => {
                              onChange(dayjs(event).format(`YYYY-MM-DDTHH:mm:ss`));
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

                            value={dayjs(defaultValues.dob)}
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
                      const { field, fieldState, formState } = props;
                      const { ref, onChange, value } = field;
                      const { defaultValues } = formState;
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
                    // rules={{ required: 'This field is required' }}
                    name='bloodG'
                    control={control}
                    render={(props: any) => {
                      const { field, fieldState, formState } = props;
                      const { ref, onChange, value } = field;
                      const { defaultValues } = formState;
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
                      const { onChange, value: formValue } = field;
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
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete {dependents[dependents.findIndex((a) => a._id == deleteId)]?.['firstName']}  from your dependents?</p>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="button" className="btnLogin mx-1"
                    onClick={() => {
                      deleteSubmited()
                    }}> Confirm </button>
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

export default Dependent;


