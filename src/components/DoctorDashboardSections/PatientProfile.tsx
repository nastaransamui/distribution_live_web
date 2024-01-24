import { FC, Fragment, SyntheticEvent, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material';
import PatientAppointment from '../shared/PatientAppointment';
import PatientPrescription from '../shared/PatientPrescription';
import Link from 'next/link';
import PatientMedicalRecords from '../shared/PatientMedicalRecords';
import PatientBillingRecords from '../shared/PatientBillingRecords';


//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent';
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

export interface ValueType {
  id: number;
  name: string;
  date: string;
  description: string;
  attachment: string;
  orderBy: string;
  doctorName?: string;
  symptoms?: string;
}
const initialState: ValueType = {
  id: 0,
  name: "Richard Wilson",
  date: '',
  description: "",
  attachment: "",
  orderBy: '',
  doctorName: 'Dr. Darren Elder'
}
const PatientProfile: FC<{ userType: 'patient' | 'doctor' }> = (({ userType }) => {
  const { muiVar } = useScssVar();
  const [value, setValue] = useState('0');
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [edit, setEdit] = useState(false);
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setIndex(Number(newValue))
    setValue(newValue);
  };

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

  const handleChange = (event: SelectChangeEvent) => {
    setEditValues((prevState) => {
      return {
        ...prevState,
        orderBy: event.target.value
      }
    })
  }

  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body pt-0">
          <div className="user-tabs">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChangeTab} aria-label="lab API tabs example" textColor="secondary"
                    indicatorColor="secondary" >
                    <Tab label="Appointments" value="0" sx={{ minWidth: '25%' }} />
                    <Tab label="Prescription" value="1" sx={{ minWidth: '25%' }} />
                    <Tab label="Medical Records" value="2" sx={{ minWidth: '25%' }} />
                    <Tab label="Billing" value="3" sx={{ minWidth: '25%' }} />
                  </TabList>
                </Box>

                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={index}>
                  <TabPanel value="0"><PatientAppointment userType={userType} /></TabPanel>
                  <TabPanel value="1">
                    {userType == 'doctor' && <div className="text-end">
                      <Link href="/doctors/dashboard/add-prescription" className="add-new-btn">
                        Add Prescription
                      </Link>
                    </div>}
                    <PatientPrescription userType={userType} />
                  </TabPanel>
                  <TabPanel value="2">
                    {userType == 'doctor' && <div className="text-end">
                      <Link href="" onClick={(e) => {
                        e.preventDefault();
                        setEdit(true)
                      }} className="add-new-btn">
                        Add Medical Records
                      </Link>
                    </div>}
                    <PatientMedicalRecords userType={userType} />
                  </TabPanel>
                  <TabPanel value="3">
                    {userType == 'doctor' && <div className="text-end">
                      <Link href="/doctors/dashboard/add-billing" className="add-new-btn">
                        Add Billing
                      </Link>
                    </div>}
                    <PatientBillingRecords userType={userType} />
                  </TabPanel>
                </SwipeableViews>


              </TabContext>
            </Box>
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
                    disabled
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
                    id="name"
                    label={`Doctor name`}
                    value={editValues.doctorName}
                    onChange={(e) => {
                      setEditValues((prevState) => {
                        return {
                          ...prevState,
                          doctorName: e.target.value
                        }
                      })
                    }}
                    disabled
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
    </Fragment>
  )
})

export default PatientProfile;

