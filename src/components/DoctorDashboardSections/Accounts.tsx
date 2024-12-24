/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, SyntheticEvent, useState, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6 } from '@/public/assets/imagepath';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';

export interface ValueType {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountName: string;
}
const initialState: ValueType = {
  bankName: "Wells Fargo & Co",
  branchName: 'Lenexa',
  accountNumber: "5396 5250 1908 3838",
  accountName: "Dr. Darren Elder",
}

export interface AccountsValue {
  id: number;
  patientName: string;
  patientId: string;
  patientImage: string;
  paidAmount: string;
  paidOn: string;
  status: string;
}
const Accounts: FC = (() => {
  const { muiVar } = useScssVar();
  const [value, setValue] = useState('1');
  const theme = useTheme();
  const router = useRouter();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const presRef = useRef<any>(null)
  const [edit, setEdit] = useState(false);
  const [req, setReq] = useState(false);
  const [editValues, setEditValues] = useState<ValueType>(initialState)
  const [data, setData] = useState<AccountsValue[]>([
    {
      id: 1,
      status: "paid",
      patientName: "Richard Wilson",
      patientId: '#PT0016',
      patientImage: PatientImg1,
      paidAmount: '450',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 2,
      status: "paid",
      patientName: "Charlene Reed",
      patientId: '#PT0001',
      patientImage: PatientImg2,
      paidAmount: '200',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 3,
      status: "paid",
      patientName: "Travis Trimble",
      patientId: '#PT0002',
      patientImage: PatientImg3,
      paidAmount: '100',
      paidOn: dayjs('13 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 4,
      status: "pending",
      patientName: "Carl Kelly",
      patientId: '#PT0003',
      patientImage: PatientImg4,
      paidAmount: '350',
      paidOn: dayjs('15 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 5,
      status: "pending",
      patientName: "Michelle Fairfax",
      patientId: '#PT0004',
      patientImage: PatientImg5,
      paidAmount: '275',
      paidOn: dayjs('20 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 6,
      status: "refunded",
      patientName: "Gina Moore",
      patientId: '#PT0005',
      patientImage: PatientImg6,
      paidAmount: '600',
      paidOn: dayjs('23 Jul 2023').format('DD MMM YYYY')
    },
  ])
  const [prisData, setPrisData] = useState<AccountsValue[]>([
    {
      id: 1,
      status: "paid",
      patientName: "Richard Wilson",
      patientId: '#PT0016',
      patientImage: PatientImg1,
      paidAmount: '450',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 2,
      status: "paid",
      patientName: "Charlene Reed",
      patientId: '#PT0001',
      patientImage: PatientImg2,
      paidAmount: '200',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 3,
      status: "paid",
      patientName: "Travis Trimble",
      patientId: '#PT0002',
      patientImage: PatientImg3,
      paidAmount: '100',
      paidOn: dayjs('13 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 4,
      status: "pending",
      patientName: "Carl Kelly",
      patientId: '#PT0003',
      patientImage: PatientImg4,
      paidAmount: '350',
      paidOn: dayjs('15 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 5,
      status: "pending",
      patientName: "Michelle Fairfax",
      patientId: '#PT0004',
      patientImage: PatientImg5,
      paidAmount: '275',
      paidOn: dayjs('20 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 6,
      status: "refunded",
      patientName: "Gina Moore",
      patientId: '#PT0005',
      patientImage: PatientImg6,
      paidAmount: '600',
      paidOn: dayjs('23 Jul 2023').format('DD MMM YYYY')
    },
  ])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'paidOn',
      headerName: "Paid On",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.paidOn).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.paidOn).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'patientName',
      headerName: "Patient",
      width: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="avatar avatar-sm me-2">
              <img className="avatar-img rounded-circle" src={row.patientImage} alt="User Image" />
            </span>
            <Stack >
              <Link href="/doctors/dashboard/patient-profile" style={{ marginBottom: -20, zIndex: 1 }}>{row.patientName}</Link><br />
              <small>  {row.patientId}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: 'paidAmount',
      headerName: "Amount",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {"$ " + row.paidAmount}
          </>
        )
      }
    },
    {
      field: 'status',
      headerName: "Status",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Chip color={
              row.status == 'paid' ? "success"
                : row.status == 'refunded' ? 'error'
                  : 'primary'
            } label={row.status.charAt(0).toUpperCase() + row.status.slice(1)} size="small" />
          </>
        )
      }
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      flex: matches ? 0 : 1,
      align: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem key={params.row.toString()} disableFocusRipple disableRipple disableTouchRipple icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
        <GridActionsCellItem key={params.row.toString()} disableFocusRipple disableRipple disableTouchRipple icon={<DoneIcon sx={{ color: theme.palette.success.main }} />} label="Accept" />,
        <GridActionsCellItem key={params.row.toString()} disableFocusRipple disableRipple disableTouchRipple icon={<CloseIcon sx={{ color: theme.palette.warning.main }} />} label="Cancel" />,
      ]
    }
  ]

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Fragment>

      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          <div className="col-lg-5 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="card-title">Account</h3>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-end">
                      <Link
                        title="Edit Details"
                        className="btn view-btn"
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setEdit(true)
                        }}
                      >
                        <i className="fas fa-pencil" /> Edit Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="profile-view-bottom">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="info-list">
                        <div className="title">Bank Name</div>
                        <div className="text" id="bank_name">
                          Wells Fargo &amp; Co
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="info-list">
                        <div className="title">Branch Name</div>
                        <div className="text" id="branch_name">
                          Lenexa
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="info-list">
                        <div className="title">Account Number</div>
                        <div className="text" id="account_no">
                          5396 5250 1908 3838
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="info-list">
                        <div className="title">Account Name</div>
                        <div className="text" id="account_name">
                          Dr. Darren Elder
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 d-flex">
            <div className="card flex-fill">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="account-card bg-success-light">
                      <span>$90.48</span> Earned
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="account-card bg-warning-light">
                      <span>$0.00</span> Requested
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="account-card bg-purple-light">
                      <span>$90.48</span> Balance
                    </div>
                  </div>
                  <div className="col-md-12 text-center">
                    <Link
                      href=""
                      className="btn btn-primary request_btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setReq(true)
                      }}
                    >
                      Payment Request
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row" >
          <div className="col-sm-12">
            <div className="card">
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" textColor="secondary"
                      indicatorColor="secondary" >
                      <Tab label="Accounts" value="1" sx={{ minWidth: '50%' }} />
                      <Tab label="Patients Refund Request" value="2" sx={{ minWidth: '50%' }} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <div className="card card-table mb-0">
                      <div className="card-body" >
                        <div className="table-responsive" style={{ height: 480, width: '100%' }}>
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
                  </TabPanel>
                  <TabPanel value="2">
                    <div className="card card-table mb-0">
                      <div className="card-body" >
                        <div className="table-responsive" style={{ height: 480, width: '100%' }}>
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
          Account Details
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>
          <form noValidate>
            <div className="row form-row">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="bankName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Bank Name`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          bankName: e.target.value
                        }
                      })
                    }}
                    value={editValues.bankName}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="branchName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Branch Name`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          branchName: e.target.value
                        }
                      })
                    }}
                    value={editValues.branchName}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="accountNumber"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Account Number`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          accountNumber: e.target.value
                        }
                      })
                    }}
                    value={editValues.accountNumber}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="accountName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Account Name`}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          accountName: e.target.value
                        }
                      })
                    }}
                    value={editValues.accountName}
                  />
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
      {req && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setReq(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={req}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setReq(false)
            }, 500);
          }}>
          Payment Request
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>
          <form noValidate>
            <div className="row form-row">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="requestAmount"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Request Amount`}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                <div className="form-group">
                  <TextField
                    variant='outlined'
                    size="small"
                    fullWidth
                    required
                    id="description"
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    label={`Description (Optional)`}
                    multiline
                    minRows={3}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} onClick={(e) => {
              e.preventDefault();

              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setReq(false)
              }, 500);
            }}>
              Submit
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
    </Fragment>
  )
});


export default Accounts;