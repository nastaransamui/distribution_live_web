/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { daughter, father, mother, son } from '@/public/assets/imagepath';

//Mui
import IconButton from '@mui/material/IconButton';
import Edit from "@mui/icons-material/Edit";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
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
import { UploadFile } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip'

export interface ValueType {
  id: number;
  name: string;
  relationShip: string;
  gender: 'Male' | 'Female';
  Dob: string;
  Photo: string;
  bloodGroup: string;
  disabled: boolean;
}

const initialState: ValueType = {
  id: 0,
  name: "",
  relationShip: "",
  gender: "Male",
  Dob: '',
  Photo: '',
  bloodGroup: '',
  disabled: true,
}

const Dependent: FC = (() => {
  const { muiVar } = useScssVar();
  const [open, setOpen] = useState(false);
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const [data, setData] = useState<ValueType[]>([
    {
      id: 0, name: "Christopher", relationShip: "Son", gender: 'Male', Dob: dayjs('27 Sep 2019').format('DD MMM YYYY'), Photo: son, bloodGroup: 'AB+', disabled: false
    },
    { id: 1, name: "Tressie", relationShip: "Daughter", gender: 'Female', Dob: dayjs("1 Nov 2019").format('DD MMM YYYY'), Photo: daughter, bloodGroup: 'B+', disabled: true },
    { id: 2, name: "Champagne", relationShip: "Father", gender: 'Male', Dob: dayjs("3 Nov 2019").format('DD MMM YYYY'), Photo: father, bloodGroup: 'B+', disabled: false },
    { id: 3, name: "Vena", relationShip: "Mother", gender: 'Female', Dob: dayjs("16 Jun 2019").format('DD MMM YYYY'), Photo: mother, bloodGroup: 'A+', disabled: true },

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
  const deactiveClicked = (params: GridRowParams) => {
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
      headerName: "Dependent",
      width: 210,
      headerAlign: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="avatar avatar-sm me-2">
              <img className="avatar-img rounded-circle" src={row.Photo} alt="User Image" />
            </span>
            {row.name}
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
      field: 'Dob',
      headerName: "Date of Birth",
      flex: matches ? 0 : 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>{dayjs(row.Dob).format(`MMMM D, YYYY`)}</>
        )
      }
    },
    {
      field: 'bloodGroup',
      headerName: "Blood Group",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={
          params.row.disabled ?
            <Tooltip arrow title="Active">
              <ToggleOffIcon sx={{ color: theme.palette.text.disabled }} fontSize='small' />
            </Tooltip> :
            <Tooltip arrow title="Deactive">
              <ToggleOnIcon sx={{ color: 'crimson' }} fontSize='small' />
            </Tooltip>} onClick={() => { deactiveClicked(params) }} label="Deactive" />,
        <GridActionsCellItem icon={<Edit color="secondary" />} onClick={() => { editClicked(params) }} label="Edit" />,
      ]
    }
  ]

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-sm-6">
                <h3 className="card-title">Dependent</h3>
              </div>
              <div className="col-sm-6">
                <button type="button"
                  className="btnLogin  float-end mt-2" style={muiVar}
                  onClick={() => {
                    setEdit(true)
                    setEditValues((prevState: ValueType) => {
                      return {
                        ...prevState,
                        Photo: '/assets/images/patients/patient.webp',
                        Dob: dayjs(new Date()).format('DD MMM YYYY')
                      }
                    })
                  }}
                >Add Dependent</button>
              </div>
            </div>
          </div>
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
          {editValues.Photo !== '' && <Avatar
            alt=""
            src={editValues.Photo as string}
            sx={{ mr: 1 }} />}
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
                    value={editValues.name}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="relation"
                    label={`Relationship`}
                    value={editValues.relationShip}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      closeOnSelect
                      disableFuture
                      format="DD MMM YYYY"
                      onChange={(event: any) => {
                        setEditValues((prevState: ValueType) => ({
                          ...prevState,
                          Dob: dayjs(event).format('DD MMM YYYY')
                        }))
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          required: true,
                          label: 'Date of Birth'
                        },

                      }}
                      value={dayjs(editValues.Dob)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <FormControl fullWidth>
                  <InputLabel size='small' id="demo-simple-select-label">Select</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={editValues.gender}
                    label="Select"
                    // onChange={handleChange} 
                    size='small'
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-sm-6">
                <FormControl fullWidth>
                  <InputLabel size='small' id="demo-simple-select-label">Select</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={editValues.bloodGroup}
                    label="Select"
                    // onChange={handleChange} 
                    size='small'
                  >
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="BA-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-12">
                <Fragment>
                  <TextField
                    variant='outlined'
                    fullWidth
                    size="small"
                    required
                    value={imageName}
                    sx={{ mt: 3 }}
                    // error={createErrors.image == undefined ? false : true}
                    // helperText={createErrors?.image && createErrors['image'][`message`] as ReactNode}
                    // InputLabelProps={{ shrink: true }}
                    // onChange={onChange}
                    // onBlur={onBlur}
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
                </Fragment>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} onClick={(e) => {
              e.preventDefault();
              setEdit(false)
            }}>
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
                <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Deactive</h4>
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to {data[data.findIndex((a) => a.id == deleteId)]?.['disabled'] ? 'Active' : 'Deactive'}  this dependent?</p>
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
                      setData(() => {
                        let newData = data;
                        let index = newData.findIndex((a) => a.id == deleteId)
                        if (index !== -1) {
                          newData[index]['disabled'] = !newData[index]['disabled']
                        }
                        return [...newData]
                      })
                    }, 500);

                  }}>{data[data.findIndex((a) => a.id == deleteId)]?.['disabled'] ? 'Active' : 'Deactive'} </button>
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


