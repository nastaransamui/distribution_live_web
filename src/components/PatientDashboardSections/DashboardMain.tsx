/* eslint-disable @next/next/no-img-element */
import { FocusEvent, FC, Fragment, useEffect, useState, ChangeEvent } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { Dashboard1, Dashboard2, Dashboard6, Dashboard5, Graph1, Graph2, Graph3, Graph4, } from '@/public/assets/imagepath';

import PatientProfile from '@/components/DoctorDashboardSections/PatientProfile';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useRouter } from 'next/router';

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
export interface VitalTypeObject {
  value: string;
  date: Date;
}

export interface VitalSignTypes {
  _id?: string;
  userId: string;
  heartRate: VitalTypeObject[];
  bodyTemp: VitalTypeObject[];
  weight: VitalTypeObject[];
  height: VitalTypeObject[];
  createdAt: Date;
  updateAt: Date;
}

const DashboardMain: FC = (() => {
  const { muiVar } = useScssVar();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const router = useRouter();
  dayjs.extend(duration)

  const [vitalSign, setvitalSign] = useState<VitalSignTypes[]>([])

  const onBlurTex = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let userId = userProfile?._id
    if (value !== '') {
      homeSocket.current.emit('vitalSignsUpdate', { name, value, userId })
    }
  }

  let lengths = {
    heartRate: vitalSign[0]?.heartRate?.length || 0,
    bodyTemp: vitalSign[0]?.bodyTemp?.length || 0,
    weight: vitalSign[0]?.weight?.length || 0,
    height: vitalSign[0]?.height?.length || 0,
  }
  let values = {
    heartRate: vitalSign[0]?.heartRate?.[lengths['heartRate' as keyof typeof lengths] - 1]['value'],
    bodyTemp: vitalSign[0]?.bodyTemp?.[lengths['bodyTemp' as keyof typeof lengths] - 1]['value'],
    weight: vitalSign[0]?.weight?.[lengths['weight' as keyof typeof lengths] - 1]['value'],
    height: vitalSign[0]?.height?.[lengths['height' as keyof typeof lengths] - 1]['value'],
  }
  const vitalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setvitalSign((prevState) => {
      //Clone prevstate for update
      let newState: any[] = [...prevState]
      //create object for value and date
      let m = {
        value: value,
        date: new Date(),
      };
      //if not any vital available push to new state
      if (newState.length == 0) {
        newState.push({ [name]: [] })
        newState[0][name].push(m)
      } else {
        //if prev vital availbe but not current vital
        if (newState[0][name] !== undefined) {
          newState[0][name].push(m)
        } else {
          newState[0][name] = []
          newState[0][name].push(m)
        }
      }
      prevState = [...newState]
      return prevState
    })
  }

  useEffect(() => {
    if (homeSocket.current !== undefined) {
      //Get vital Sign on change database
      homeSocket.current.on('getVitalSignFromAdmin', (msg: any) => {
        setvitalSign(msg)
      })
      let userId = userProfile?._id
      // Get vital sing on entrance of page
      homeSocket.current.emit('getVitalSign', { userId })
      homeSocket.current.once('getVitalSignReturn', (msg: any) => {
        setvitalSign(msg)
      })
    }
  }, [router, homeSocket, userProfile])



  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <img src={Dashboard1} width={55} alt='' />
                  </div>
                  <h5>Heart Rate</h5>
                  <h6>
                    <TextField
                      name='heartRate'
                      onBlur={onBlurTex}
                      value={values.heartRate || ''}
                      onChange={vitalChange}
                      size='small'
                      variant="standard"
                      autoComplete='off'
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      placeholder={values?.heartRate == undefined || values?.heartRate == '' ? '--' : ''}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        style: {
                          marginRight: -30,
                        }
                      }}
                      sx={{ maxWidth: 35, input: { fontSize: `18px`, color: muiVar['--secondaryLight'], cursor: 'pointer', fontWeight: 900, } }} />
                    <sub style={{ marginLeft: 4 }}>bpm</sub></h6>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <img src={Dashboard2} width={55} alt='' />
                  </div>
                  <h5>Body Temperature</h5>
                  <h6>
                    <TextField
                      name='bodyTemp'
                      onBlur={onBlurTex}
                      value={values?.bodyTemp || ''}
                      onChange={vitalChange}
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      size='small'
                      variant="standard"
                      placeholder={values?.bodyTemp == undefined || values?.bodyTemp == '' ? '--' : ''}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ maxWidth: 30, input: { fontSize: `18px`, color: muiVar['--secondaryLight'], cursor: 'pointer', fontWeight: 900 } }} /> <sub>C</sub></h6>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <img src={Dashboard5} width={55} alt='' />
                  </div>
                  <h5>Weight</h5>
                  <h6>
                    <TextField
                      name='weight'
                      onBlur={onBlurTex}
                      value={values?.weight || ''}
                      onChange={vitalChange}
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      size='small'
                      variant="standard"
                      placeholder={values?.weight == undefined || values?.weight == '' ? '--' : ''}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ maxWidth: 30, input: { fontSize: `18px`, color: muiVar['--secondaryLight'], cursor: 'pointer', fontWeight: 900 } }} />
                    <sub>Kg</sub>
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <img src={Dashboard6} width={55} alt='' />
                  </div>
                  <h5>Height</h5>
                  <h6>
                    <TextField
                      name='height'
                      onBlur={onBlurTex}
                      value={values?.height || ''}
                      onChange={vitalChange}
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      size='small'
                      variant="standard"
                      placeholder={values?.height == undefined || values?.height == '' ? '--' : ''}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ maxWidth: 30, input: { fontSize: `18px`, color: muiVar['--secondaryLight'], cursor: 'pointer', fontWeight: 900 } }} />
                    <sub>cm</sub>
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row patient-graph-col">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Graph Status</h4>
                </div>
                <div className="card-body pt-2 pb-2 mt-1 mb-1">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 col-xl-6 patient-graph-box">
                      <Link href="/patient/dashboard/bmi-status" className="graph-box" data-bs-target="#graph1">
                        <div>
                          <h4>BMI Status</h4>
                        </div>
                        <div className="graph-img imgColorSecondary">
                          <img src={Graph1} alt='' />
                        </div>
                        <div className="graph-status-result mt-3">
                        </div>
                      </Link>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-6 patient-graph-box">
                      <Link href="/patient/dashboard/clinical-signs-history" className="graph-box pink-graph" data-bs-target="#graph2">
                        <div>
                          <h4>Clinical Signs History</h4>
                        </div>
                        <div className="graph-img imgColorPrimary">
                          <img src={Graph2} alt='' />
                        </div>
                        <div className="graph-status-result mt-3">
                        </div>
                      </Link>
                    </div>
                    {/* <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-graph-box">
                      <Link href="#" onClick={(e) => e.preventDefault()} className="graph-box sky-blue-graph" data-bs-target="#graph3">
                        <div>
                          <h4>FBC Status</h4>
                        </div>
                        <div className="graph-img imgColorSecondary">
                          <img src={Graph3} alt='' />
                        </div>
                        <div className="graph-status-result mt-3">
                        </div>
                      </Link>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-graph-box">
                      <Link href="#" onClick={(e) => e.preventDefault()} className="graph-box orange-graph" data-bs-target="#graph4">
                        <div>
                          <h4>Weight Status</h4>
                        </div>
                        <div className="graph-img imgColorPrimary">
                          <img src={Graph4} alt='' />
                        </div>
                        <div className="graph-status-result mt-3">
                        </div>
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PatientProfile userType='patient' />
      </div>
    </Fragment>
  )
});

export default DashboardMain;