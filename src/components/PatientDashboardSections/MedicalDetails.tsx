/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, SyntheticEvent } from 'react'
import useScssVar from '@/hooks/useScssVar'

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
import InputAdornment from '@mui/material/InputAdornment';
import DeleteForever from '@mui/icons-material/DeleteForever'
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Edit from '@mui/icons-material/Edit';

export interface ValueType {
  id: number;
  name: string;
  bmi: string;
  heartRate: string;
  fbc: string;
  weight: string;
  orderDate: string;
}


const initialState: ValueType = {
  id: 0,
  name: '',
  bmi: '',
  heartRate: '',
  fbc: '',
  weight: '',
  orderDate: '',
}

const MedicalDetails: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const [data, setData] = useState<ValueType[]>([
    { id: 0, name: "Richard Wilson", bmi: '23.7', heartRate: '89', fbc: '140', weight: '74', orderDate: dayjs('27 Sep 2019').format('DD MMM YYYY') },
    { id: 1, name: "Vena", bmi: '25.2', heartRate: '92', fbc: '135', weight: '73', orderDate: dayjs("1 Nov 2019").format('DD MMM YYYY') },
    { id: 2, name: "Champagne", bmi: '24.5', heartRate: '90', fbc: '125', weight: '73.5', orderDate: dayjs("3 Nov 2019").format('DD MMM YYYY') },
    { id: 3, name: "Tressie", bmi: '24.2', heartRate: '95', fbc: '128', weight: '10.2', orderDate: dayjs("16 Jun 2019").format('DD MMM YYYY') },
    { id: 4, name: "Christopher", bmi: '24.7', heartRate: '99', fbc: '122', weight: '12.8', orderDate: dayjs("16 Jun 2019").format('DD MMM YYYY') },

  ])

  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState<ValueType>(initialState)

  const editClicked = (params: GridRowParams) => {
    setEdit(true)
    setEditValues((prevState) => {
      return {
        ...prevState,
        id: params.row.id,
        name: params.row.name,
        bmi: params.row.bmi,
        heartRate: params.row.heartRate,
        fbc: params.row.fbc,
        weight: params.row.weight,
        orderDate: params.row.orderDate,
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
      width: 150,
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
      field: 'bmi',
      headerName: "Bmi",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'heartRate',
      headerName: "Heart Rate",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'fbc',
      headerName: "FBC Status",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'weight',
      headerName: "Weight",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {row.weight + " Kg"}
          </>
        )
      }
    },
    {
      field: 'orderDate',
      headerName: "Order Date",
      flex: matches ? 0 : 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.orderDate).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.orderDate).format(` h:mm A`)}</span>
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
        <GridActionsCellItem icon={<Edit color='secondary' />} onClick={() => { editClicked(params) }} label="Edit" />,
        <GridActionsCellItem icon={<DeleteForever sx={{ color: 'crimson' }} />} onClick={() => { deleteClicked(params) }} label="Delete" />,
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
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title float-start">Medical details</h4>
                <Link href=""
                  style={{ lineHeight: `25px` }}
                  className="btn btn-primary float-end" onClick={(e) => {
                    e.preventDefault();
                    setEdit(true)
                  }} >Add Details</Link>
              </div>
              <div className="card-body ">
                <div className="card card-table mb-0">
                  <div className="card-body">
                    <div className="table-responsive">
                      <DataGrid
                        experimentalFeatures={{ ariaV7: true }}
                        slotProps={{
                          pagination: {
                            SelectProps: {
                              inputProps: {
                                id: 'pagination-select',
                                name: 'pagination-select',
                              },
                            },
                          },
                        }}
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
              </div>
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
          {editValues.name == '' ? "Add new data" : editValues.name}
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
                    inputProps={{
                      autoComplete: 'name'
                    }}
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
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="bmi"
                    name="bmi"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`BMI`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          bmi: e.target.value
                        }
                      })
                    }}
                    value={editValues.bmi}
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
                    id="heart-rate"
                    name='heart-rate'
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Heart rate`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          heartRate: e.target.value
                        }
                      })
                    }}
                    value={editValues.heartRate}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    fullWidth
                    size="small"
                    required
                    id="weight"
                    name='weight'
                    inputProps={{
                      autoComplete: "off"
                    }}
                    disabled
                    label={'Weight'}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          weight: e.target.value
                        }
                      })
                    }}
                    value={editValues.weight}
                    InputProps={{
                      endAdornment:
                        <InputAdornment position="start"  >
                          Kg
                        </InputAdornment>,
                    }}
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
                    id="fbc"
                    name='fbc'
                    inputProps={{
                      autoComplete: "off"
                    }}
                    label={`FBC`}
                    value={editValues.fbc}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          fbc: e.target.value
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
                          orderDate: dayjs(event).format('DD MMM YYYY')
                        }))
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          required: true,
                          label: 'Order Date'
                        },

                      }}
                      value={dayjs(editValues.orderDate)}
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

export default MedicalDetails;


