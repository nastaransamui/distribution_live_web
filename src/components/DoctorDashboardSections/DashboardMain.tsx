/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import ProgressBar from "react-customizable-progressbar";
import { Icon01, Icon02, Icon03 } from '@/public/assets/imagepath';
import { useTheme } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import DashboardAppoinment from './AppointmentTab';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import dayjs from 'dayjs';
import AnimationWrapper from '@/shared/AnimationWrapper';
import BeatLoader from 'react-spinners/BeatLoader';

const DashboardMain: FC = (() => {
  const theme = useTheme();
  const [value, setValue] = useState('1');
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
                            <ProgressBar
                              // width={8}
                              radius={40}
                              progress={75}
                              rotate={-183}
                              strokeWidth={6}
                              strokeColor={theme.palette.secondary.main}
                              strokeLinecap="square"
                              trackStrokeWidth={8}
                              trackStrokeColor={theme.palette.background.paper}
                              trackStrokeLinecap="square"
                              pointerRadius={0}
                              initialAnimation={true}
                              transition="1.5s ease 0.5s"
                              trackTransition="0s ease"
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon01}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                  style={{
                                    position: "relative",
                                    top: "-83px",
                                    left: "45px",
                                  }}
                                />
                              </div>
                            </ProgressBar>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative", top: "-18px" }}
                            >
                              <h6>Total Patient</h6>
                              <h3>{userProfile !== null && userDoctorProfile?.patients_id?.length}</h3>
                              <p className="text-muted">Till Today</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                          <div className="dash-widget dct-border-rht">
                            <ProgressBar
                              // width={8}
                              radius={40}
                              progress={65}
                              rotate={-183}
                              strokeWidth={6}
                              strokeColor={theme.palette.secondary.light}
                              strokeLinecap="square"
                              trackStrokeWidth={8}
                              trackStrokeColor={theme.palette.background.paper}
                              trackStrokeLinecap="square"
                              pointerRadius={0}
                              initialAnimation={true}
                              transition="1.5s ease 0.5s"
                              trackTransition="0s ease"
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon02}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                  style={{
                                    position: "relative",
                                    top: "-83px",
                                    left: "45px",
                                  }}
                                />
                              </div>
                            </ProgressBar>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative", top: "-18px" }}
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
                            <ProgressBar
                              // width={8}
                              radius={40}
                              progress={30}
                              rotate={-183}
                              strokeWidth={6}
                              strokeColor={theme.palette.secondary.dark}
                              strokeLinecap="square"
                              trackStrokeWidth={8}
                              trackStrokeColor={theme.palette.background.paper}
                              trackStrokeLinecap="square"
                              pointerRadius={0}
                              initialAnimation={true}
                              transition="1.5s ease 0.5s"
                              trackTransition="0s ease"
                            >
                              <div className="indicator-volume">
                                <img
                                  src={Icon03}
                                  className="img-fluid colorFill"
                                  alt="Patient"
                                  style={{
                                    position: "relative",
                                    top: "-83px",
                                    left: "45px",
                                  }}
                                />
                              </div>
                            </ProgressBar>
                            <div
                              className="dash-widget-info"
                              style={{ position: "relative", top: "-18px" }}
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
                  <TabContext value={value}>
                    <div className="appointment-tab">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded">
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${value == '1' ? 'active' : ''}`}
                            href="#upcoming-appointments"
                            data-bs-toggle="tab"
                            onClick={(e) => {
                              e.preventDefault();
                              setValue('1')
                              setIsToday(false)
                            }}
                          >
                            Upcoming
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${value == '2' ? 'active' : ''}`}
                            href="#today-appointments"
                            data-bs-toggle="tab"
                            onClick={(e) => {
                              e.preventDefault();
                              setValue('2')
                              setIsToday(true)
                            }}
                          >
                            Today
                          </Link>
                        </li>
                      </ul>
                      <div className="card card-table mb-0">
                        <div className="card-body">
                          <TabPanel value="1" className={`${!isToday && value == "1" ? "animate__animated animate__backInLeft" : ""}`}>
                            <DashboardAppoinment isLoading={isLoading} setIsLoading={setIsLoading} total={total} setTotal={setTotal} isToday={isToday} />
                          </TabPanel>
                          <TabPanel value="2" className={`${isToday && value == "2" ? "animate__animated animate__backInRight" : ""}`}>
                            <DashboardAppoinment isLoading={isLoading} setIsLoading={setIsLoading} total={total} setTotal={setTotal} isToday={isToday} />
                          </TabPanel>
                        </div>
                      </div>
                    </div>
                  </TabContext>
                </div>
              </div>
          }
        </AnimationWrapper>
      </div>
    </Fragment>
  );
})

export default DashboardMain;