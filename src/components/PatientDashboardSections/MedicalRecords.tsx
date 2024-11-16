/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, SyntheticEvent } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, daughter, father, mother, son } from '@/public/assets/imagepath';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
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
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useRouter } from 'next/router';

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

const initialState: ValueType = {
  id: 0,
  name: "",
  date: '',
  description: "",
  attachment: "",
  orderBy: '',
  hospitalName: ''
}

const MedicalRecords: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const presRef = useRef<any>(null)
  const router = useRouter();
  const [data, setData] = useState<ValueType[]>([
    { id: 0, name: "Richard Wilson", date: dayjs('27 Sep 2019').format('DD MMM YYYY'), description: "Acetrace Amionel", orderBy: 'Your Self', attachment: '' },
    { id: 1, name: "Vena", date: dayjs("1 Nov 2019").format('DD MMM YYYY'), description: 'Benzaxapine Croplex', orderBy: 'Your Self', attachment: '' },
    { id: 2, name: "Tressie", date: dayjs("3 Nov 2019").format('DD MMM YYYY'), description: 'Rapalac Neuronium', orderBy: 'Your Self', attachment: '' },
    { id: 3, name: "Richard Wilson", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), description: 'Ombinazol Bonibamol', orderBy: 'Your Self', attachment: '' },
    { id: 4, name: "Christopher", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), description: 'Dantotate Dantodazole', orderBy: 'Your Self', attachment: '' },

  ])
  const [prisData, setPrisData] = useState<PrisValueType[]>([
    { id: 0, name: "Prescription", date: dayjs('27 Sep 2019').format('DD MMM YYYY'), doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, speciality: 'Dental' },
    { id: 1, name: "Prescription", date: dayjs("1 Nov 2019").format('DD MMM YYYY'), doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, speciality: 'Dental' },
    { id: 2, name: "Prescription", date: dayjs("3 Nov 2019").format('DD MMM YYYY'), doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, speciality: 'Cardiology' },
    { id: 3, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, speciality: 'Urology' },
    { id: 4, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Marvin Campbell', doctorImage: DoctThumb2, speciality: 'Ophthalmology' },
    { id: 5, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Katharine Berthold', doctorImage: DoctThumb8, speciality: 'Orthopaedics' },
  ])
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState<ValueType>(initialState)
  const [imageName, setImageName] = useState("")
  const inputFileRef = useRef<any>(null)
  const handleChangeInputFile = (e: any) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name)
      // createSetValue('image', e.target.files[0])
      // createClearErrors('image')
      setEditValues((prevState) => {
        return {
          ...prevState,
          Photo: URL.createObjectURL(e.target.files[0])
        }
      })
    }
  }
  const handleClickInputFile = () => {
    if (inputFileRef.current !== null) {
      inputFileRef.current.click()
    }

  }
  const editClicked = (params: GridRowParams) => {
    setEdit(true)
    async function createFile() {
      let response = await fetch(params.row.Photo);
      let data = await response.blob();
      let metadata = {
        type: 'image/jpeg'
      };
      let file = new File([data], `${params.row.name}.webp`, metadata);
      setImageName(file.name)
    }
    createFile();
    setEditValues((prevState) => {
      return {
        ...prevState,
        id: params.row.id,
        name: params.row.name,
        relationShip: params.row.relationShip,
        gender: params.row.gender,
        Dob: params.row.Dob,
        Photo: params.row.Photo,
        bloodGroup: params.row.bloodGroup,
        disabled: params.row.disabled,
      }
    })
  }
  const [deleteId, setDeleteId] = useState<number>()
  const deleteClicked = (params: GridRowParams) => {
    setDeleteId(() => (params.row.id))
    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
  }
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: "Name",
      width: 190,
      headerAlign: 'left',
      align: 'left',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {row.name}
          </>
        )
      },
    },
    {
      field: 'date',
      headerName: "Date",
      width: 190,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'description',
      headerName: "Description",
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'attachment',
      headerName: "Attachment",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <IconButton disableFocusRipple disableRipple disableTouchRipple >
              <GetAppIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
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
        <GridActionsCellItem icon={<DeleteForever sx={{ color: 'crimson' }} />} onClick={() => { deleteClicked(params) }} label="Edit" />,
      ]
    }
  ]

  const handleChange = (event: SelectChangeEvent) => {
    setEditValues((prevState) => {
      return {
        ...prevState,
        orderBy: event.target.value
      }
    })
  }

  const prisColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'date',
      headerName: "Date",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: "Name",
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'doctorName',
      headerName: "Doctor Name",
      width: 290,
      headerAlign: 'left',
      align: 'left',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="avatar avatar-sm me-2">
              <img className="avatar-img rounded-circle" src={row.doctorImage} alt="User Image" />
            </span>
            <Stack >
              <Link href="/doctors/profile" style={{ marginBottom: -20, zIndex: 1 }}>{row.doctorName}</Link><br />
              <small>  {row.speciality}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      flex: matches ? 0 : 1,
      align: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
        <GridActionsCellItem onClick={() => { router.push('/patient/dashboard/see-prescription') }} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
      ]
    }
  ]

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [prisPaginationModel, setPrisPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [value, setValue] = useState('1');

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row" style={{ height: 380, width: '100%' }}>
          <div className="col-sm-12">
            <div className="card">
              {/* <div className="card-body pt-0"> */}
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" textColor="secondary"
                      indicatorColor="secondary" >
                      <Tab label="Medical Records" value="1" sx={{ minWidth: '50%' }} />
                      <Tab label="Prescription" value="2" sx={{ minWidth: '50%' }} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <div className="text-end">
                      <Link href="" className="add-new-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setEdit(true)
                        }} data-bs-target="#add_medical_records_modal">Add Medical Records</Link> </div>
                    <div className="card card-table mb-0">
                      <div className="card-body" style={{ height: 375, width: '100%' }}>
                        <div className="table-responsive" style={{ height: 375, width: '100%' }}>
                          <DataGrid
                            rows={data}
                            rowCount={data.length}
                            ref={grdiRef}
                            // localeText={muiLocaleText()}
                            columns={columns}
                            disableRowSelectionOnClick
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            showCellVerticalBorder
                            isRowSelectable={(params: GridRowParams) => params.row.disabled}
                            showColumnVerticalBorder
                            sx={{
                              ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                                "marginTop": "1em",
                                "marginBottom": "1em"
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="2">
                    <DataGrid
                      rows={prisData}
                      rowCount={prisData.length}
                      ref={presRef}
                      // localeText={muiLocaleText()}
                      columns={prisColumns}
                      disableRowSelectionOnClick
                      paginationModel={prisPaginationModel}
                      onPaginationModelChange={setPrisPaginationModel}
                      pageSizeOptions={[5, 10]}
                      showCellVerticalBorder
                      isRowSelectable={(params: GridRowParams) => params.row.disabled}
                      showColumnVerticalBorder
                      sx={{
                        ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                          "marginTop": "1em",
                          "marginBottom": "1em"
                        }
                      }}
                    />
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </div>
        </div>
      </div>
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
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
              setEdit(false)
            }, 500);
          }}>
          {editValues.name}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form noValidate>
            <div className="row form-row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="name"
                    label={`Name`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          name: e.target.value
                        }
                      })
                    }}
                    value={editValues.name}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <FormControl fullWidth>
                    <InputLabel size='small' id="demo-simple-select-label">Patient</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editValues.orderBy}
                      label="Patient"
                      onChange={handleChange}
                      size='small'
                    >
                      <MenuItem value="YourSelf">Your Self</MenuItem>
                      <MenuItem value="Child">Child</MenuItem>
                      <MenuItem value="Mother">Mother</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="name"
                    label={`Hospital name`}
                    value={editValues.hospitalName}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          hospitalName: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
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
                  <input type="file" ref={inputFileRef} onChange={handleChangeInputFile} style={{ display: "none" }} />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="name"
                    label={`Symptoms`}
                    value={editValues.symptoms}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          symptoms: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      closeOnSelect
                      format="DD MMM YYYY"
                      onChange={(event: any) => {
                        setEditValues((prevState: ValueType) => ({
                          ...prevState,
                          date: dayjs(event).format('DD MMM YYYY')
                        }))
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          required: true,
                          label: 'Date'
                        },

                      }}
                      value={dayjs(editValues.date)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} onClick={(e) => {
              e.preventDefault();

              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setEdit(false)
              }, 500);
            }}>
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
                <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Deactive</h4>
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
                <span style={{ display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
                  onClick={() => {
                    document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                    if (data.filter((a) => a.id !== deleteId).length > 0) {
                      if (paginationModel.pageSize > data.filter((a) => a.id !== deleteId).length / paginationModel.pageSize) {
                        if (Math.ceil(data.filter((a) => a.id !== deleteId).length / paginationModel.pageSize) == paginationModel.page) {
                          setPaginationModel((prevState) => ({
                            ...prevState, page:
                              Math.ceil(data.filter((a) => a.id !== deleteId).length / paginationModel.pageSize) - paginationModel.page
                          }))
                        }

                      }
                    }

                    setTimeout(() => {
                      window.$('#delete_modal').modal("hide")
                      setData(() => (data.filter((a) => a.id !== deleteId)))
                    }, 500);

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

export default MedicalRecords;


