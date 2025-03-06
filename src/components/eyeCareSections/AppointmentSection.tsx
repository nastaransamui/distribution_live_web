/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { appoint_bg } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';


const AppointmentSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const [nameShrink, setNameShrink] = useState<boolean>(false)
  const [mailShrink, setMailShrink] = useState<boolean>(false)
  const [phoneShrink, setPhoneShrink] = useState<boolean>(false)

  const [hospital, setHospital] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [consult, setConsult] = useState('');
  const [appointment, setAppointment] = useState('');


  const handleChange = (event: SelectChangeEvent) => {
    setHospital(event.target.value as string);
  };

  const handleChangeDoctor = (event: SelectChangeEvent) => {
    setDoctorName(event.target.value as string);
  };
  const handleChangeConsult = (event: SelectChangeEvent) => {
    setConsult(event.target.value as string);
  };
  const handleChangeAppointment = (event: SelectChangeEvent) => {
    setAppointment(event.target.value as string);
  };

  return (
    <Fragment>
      <section className="appointment-section" style={muiVar}>
        <div className="appointment-form">
          <div className="container">
            <div className="row">
              <div className="col-md-12 aos" data-aos="fade-up">
                <div className="section-heading text-center sec-heading-eye">
                  <EyeIconSvg />
                  <h2 style={{ color: theme.palette.text.color }}>Book an appointment</h2>
                </div>
              </div>
            </div>
            <form >
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <TextField
                        required
                        id="outlined-required"
                        label="Name"
                        defaultValue=""
                        size="small"
                        fullWidth
                        onFocus={() => setNameShrink(() => true)}
                        InputLabelProps={{
                          shrink: nameShrink,
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value == '') {
                            setNameShrink(() => false)
                          }
                        }}
                        classes={{
                          root: 'adornedStart'
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          startAdornment: <InputAdornment position="start">
                            <i className="feather-user" style={{ width: "16px", color: theme.palette.primary.main }} />
                          </InputAdornment>,
                          classes: {
                            adornedStart: 'adornedStart',
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <TextField
                        required
                        id="outlined-required"
                        label="Email"
                        defaultValue=""
                        size="small"
                        fullWidth
                        onFocus={() => setMailShrink(() => true)}
                        InputLabelProps={{
                          shrink: mailShrink,
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value == '') {
                            setMailShrink(() => false)
                          }
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          startAdornment: <InputAdornment position="start">
                            <i className="feather-mail" style={{ width: "16px", color: theme.palette.primary.main }} />
                          </InputAdornment>,
                          classes: {
                            adornedStart: 'adornedStart',
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <TextField
                        required
                        id="outlined-required"
                        label="Phone Number"
                        defaultValue=""
                        size="small"
                        fullWidth
                        onFocus={() => setPhoneShrink(() => true)}
                        InputLabelProps={{
                          shrink: phoneShrink,
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value == '') {
                            setPhoneShrink(() => false)
                          }
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          startAdornment: <InputAdornment position="start">
                            <i className="feather-phone" style={{ width: "16px", color: theme.palette.primary.main }} />
                          </InputAdornment>,
                          classes: {
                            adornedStart: 'adornedStart',
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <FormControl fullWidth>
                        <InputLabel
                          required size='small' id="demo-simple-select-label">Hospital</InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={hospital}
                          label="Hospital"
                          onChange={handleChange} size='small'
                          className='adornedStart'
                        >
                          <MenuItem value="Online">Online</MenuItem>
                          <MenuItem value="Offline">Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <FormControl fullWidth>
                        <InputLabel
                          required size='small' id="demo-simple-select-label">Doctor Name</InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={doctorName}
                          label="Doctor Name"
                          onChange={handleChangeDoctor} size='small'
                          className='adornedStart'
                        >
                          <MenuItem value="George">George</MenuItem>
                          <MenuItem value="Matthew">Matthew</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <FormControl fullWidth>
                        <InputLabel
                          required size='small' id="demo-simple-select-label">Online Consultation</InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={consult}
                          label="Online Consultation"
                          onChange={handleChangeConsult} size='small'
                          className='adornedStart'
                        >
                          <MenuItem value="Online">Online</MenuItem>
                          <MenuItem value="Offline">Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          format="DD MMM YYYY"
                          closeOnSelect
                          disablePast
                          onChange={(event) => { }}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputLabelProps: { shrink: true },
                              InputProps: {
                                startAdornment: <InputAdornment position="start">
                                  <i className="feather-calendar" style={{ width: "16px", color: theme.palette.primary.main }} />
                                </InputAdornment>,
                                classes: {
                                  adornedStart: 'adornedStart',
                                }
                              },
                              placeholder: 'Date'
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                          closeOnSelect
                          disablePast
                          format="HH:mm"
                          views={['hours', 'minutes']}
                          onChange={(value) => {
                            if (value && dayjs.isDayjs(value)) {
                              // console.log("Selected Time:", value.format('HH:mm'));
                            }
                          }}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputLabelProps: { shrink: true },
                              required: true,
                              error: false,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <i className="feather-clock" style={{ width: "16px", color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                                classes: {
                                  adornedStart: 'adornedStart',
                                },
                              },
                              placeholder: 'Select Time',
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="form-custom">
                      <FormControl fullWidth>
                        <InputLabel
                          required size='small' id="demo-simple-select-label">Appointment Type</InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={appointment}
                          label="Appointment Type"
                          onChange={handleChangeAppointment} size='small'
                          className='adornedStart'
                        >
                          <MenuItem value="Online">Online</MenuItem>
                          <MenuItem value="Offline">Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  <Link href="/doctors" className="btn btn-light-blue app-btn" style={{ lineHeight: `20px`, color: "#000" }}>
                    Book an Appointment
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <div className="ban-bg">
            <img
              src={appoint_bg}
              alt=""
              className="img-fluid bg-09"
            />
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default AppointmentSection;