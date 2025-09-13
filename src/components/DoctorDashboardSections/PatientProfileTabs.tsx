import { FC, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import PatientAppointment from '../shared/PatientAppointment';
import Link from 'next/link';
import PatientBillingRecords from '../shared/PatientBillingRecords';


//Mui
import { BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import UploadFile from '@mui/icons-material/UploadFile';
import { PatientProfileExtendType } from '../DoctorPatientProfile/DoctorPatientProfile';
import MedicalRecords from '../PatientDashboardSections/MedicalRecords';
import MedicalRecordsPriscription from '../PatientDashboardSections/MedicalRecordsPriscription';

import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';
if (typeof window !== 'undefined') {
  window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
}
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
  name: "",
  date: '',
  description: "",
  attachment: "",
  orderBy: '',
  doctorName: ''
}

export interface PatientSidebarDoctorTypes {
  doctorPatientProfile: PatientProfileExtendType;
  userType: 'patient' | 'doctor'
}
const PatientProfileTabs: FC<PatientSidebarDoctorTypes> = (({ doctorPatientProfile, userType }) => {
  const { muiVar } = useScssVar();

  const [edit, setEdit] = useState(false);

  const [editValues, setEditValues] = useState<ValueType>(initialState)
  const [imageName, setImageName] = useState("")
  const inputFileRef = useRef<any>(null)
  const handleChangeInputFile = (e: any) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name)
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

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])

  return (
    <Fragment>
      <div className={`card ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
        <MuiSwipeableTabs
          steps={
            [
              {
                stepName: "Appointments",
                stepComponent:
                  <PatientAppointment
                    userType={userType}
                    patientId={doctorPatientProfile?._id}
                  />,
                stepId: 'Appointments',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Prescription",
                stepComponent:
                  <MedicalRecordsPriscription
                    patientProfile={doctorPatientProfile}
                    userType={userType}
                  />,
                stepId: 'Prescription',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Medical Records",
                stepComponent:
                  <MedicalRecords
                    patientProfile={doctorPatientProfile}
                  />,
                stepId: 'Medical Records',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Billing",
                stepComponent:
                  <PatientBillingRecords
                    userType={userType}
                    patientId={doctorPatientProfile?._id}
                  />,
                stepId: 'Billing',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
            ]
          }
          activeTab={0}
        />
      </div>

      {edit && <BootstrapDialog
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
                    inputProps={{
                      autoComplete: 'off'
                    }}
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
                    id="doctorName"
                    inputProps={{
                      autoComplete: 'off'
                    }}
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

                    inputProps={{
                      autoComplete: 'off'
                    }}
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
                    id="symptoms"

                    inputProps={{
                      autoComplete: 'off'
                    }}
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
                          label: 'Date',
                          error: false
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

export default PatientProfileTabs;

