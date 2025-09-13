/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

import { Icon01, Icon02, Icon03 } from '@/public/assets/imagepath';
import { useTheme } from '@mui/material';
import DashboardAppoinment from './AppointmentTab';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import dayjs from 'dayjs';
import AnimationWrapper from '@/shared/AnimationWrapper';
import BeatLoader from 'react-spinners/BeatLoader';
import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';

const DashboardMain: FC = (() => {
  const theme = useTheme();
  const [isToday, setIsToday] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [total, setTotal] = useState(0);
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12">
        <AnimationWrapper fallbackMs={1500}>
          {
            !isClient ?
              <BeatLoader color={theme.palette.primary.main} style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} />
              :
              <div className="row">
                <div className="col-md-12">
                  <div className={`card dash-card  ${isClient ? 'animate__animated animate__backInDown' : 'pre-anim-hidden'}`}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12 col-lg-4">
                          <div className="dash-widget dct-border-rht">
                            <CircularProgressbarWithChildren
                              value={75}
                              strokeWidth={5}
                              styles={{
                                root: {
                                  width: '100px',
                                  padding: '10px'
                                },
                                path: {
                                  // Path color
                                  stroke: theme.palette.secondary.main,
                                  transition: 'stroke-dashoffset 0.5s ease 0s',
                                  // Rotate the path
                                  transform: 'rotate(-0.25turn)',
                                  transformOrigin: 'center center',
                                },
                                // Customize the circle behind the path, i.e. the "total progress"
                                trail: {
                                  // Trail color
                                  stroke: theme.palette.background.paper,
                                },
                              }}
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon01}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                />
                              </div>
                            </CircularProgressbarWithChildren>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative" }}
                            >
                              <h6>Total Patient</h6>
                              <h3>{userProfile !== null && userDoctorProfile?.patients_id?.length}</h3>
                              <p className="text-muted">Till Today</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                          <div className="dash-widget dct-border-rht">
                            <CircularProgressbarWithChildren
                              value={68}
                              strokeWidth={5}
                              styles={{
                                root: {
                                  width: '100px',
                                  padding: '10px'
                                },
                                path: {
                                  // Path color
                                  stroke: theme.palette.secondary.light,
                                  transition: 'stroke-dashoffset 0.5s ease 0s',
                                  // Rotate the path
                                  transform: 'rotate(-0.28turn)',
                                  transformOrigin: 'center center',
                                },
                                // Customize the circle behind the path, i.e. the "total progress"
                                trail: {
                                  // Trail color
                                  stroke: theme.palette.background.paper,
                                },
                              }}
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon02}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                />
                              </div>
                            </CircularProgressbarWithChildren>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative" }}
                            >
                              <h1>{isToday ? `Today Patients` : `This week Patients`}</h1>
                              <h2>{isLoading ? <BeatLoader color={theme.palette.primary.main} size={10}
                                style={{
                                  position: 'relative',
                                  maxHeight: 12,
                                }}
                              /> : total}</h2>
                              <p className="text-muted">{dayjs().format('DD, MMM YYYY')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                          <div className="dash-widget">
                            <CircularProgressbarWithChildren
                              value={30}
                              strokeWidth={5}
                              styles={{
                                root: {
                                  width: '100px',
                                  padding: '10px'
                                },
                                path: {
                                  // Path color
                                  stroke: theme.palette.secondary.dark,
                                  transition: 'stroke-dashoffset 0.5s ease 0s',
                                  // Rotate the path
                                  transform: 'rotate(-0.28turn)',
                                  transformOrigin: 'center center',
                                },
                                // Customize the circle behind the path, i.e. the "total progress"
                                trail: {
                                  // Trail color
                                  stroke: theme.palette.background.paper,
                                },
                              }}
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon03}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                  style={{
                                    position: "relative",
                                  }}
                                />
                              </div>
                            </CircularProgressbarWithChildren>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative", }}
                            >
                              <h1>Reservations</h1>
                              <h2>{userProfile !== null && userProfile?.reservations_id?.length}</h2>
                              <p className="text-muted">{dayjs().format('DD, MMM YYYY')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
        </AnimationWrapper>
        <AnimationWrapper fallbackMs={1500}>
          {
            !isClient ?
              <></>
              :
              <div className="row">
                <div className={`col-md-12   ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
                  <h1 className="mb-4" style={{ color: theme.palette.secondary.main, fontSize: '18px' }}>{isToday ? `Today Patients` : `This week Patients`}</h1>
                  <MuiSwipeableTabs
                    steps={
                      [
                        {
                          stepName: "Upcoming",
                          stepComponent:
                            <DashboardAppoinment
                              isLoading={isLoading}
                              setIsLoading={setIsLoading}
                              total={total}
                              setTotal={setTotal}
                              isToday={false}
                              setIsToday={setIsToday} />,
                          stepId: 'Upcoming',
                          isValidated: () => true,
                          isDisable: false,
                          hasParams: false,
                          paramsObj: {}
                        },
                        {
                          stepName: "Today",
                          stepComponent:
                            <DashboardAppoinment
                              isLoading={isLoading}
                              setIsLoading={setIsLoading}
                              total={total}
                              setTotal={setTotal}
                              isToday={true}
                              setIsToday={setIsToday} />,
                          stepId: 'Today',
                          isValidated: () => true,
                          isDisable: false,
                          hasParams: false,
                          paramsObj: {}
                        },
                      ]
                    }
                    activeTab={0} />
                </div>
              </div>
          }
        </AnimationWrapper>
      </div>
    </Fragment>
  );
})

export default DashboardMain;