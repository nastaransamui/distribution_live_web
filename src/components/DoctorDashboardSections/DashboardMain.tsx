/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import ProgressBar from "react-customizable-progressbar";
import { Icon01, Icon02, Icon03 } from '@/public/assets/imagepath';
import { useTheme } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import SwipeableViews from 'react-swipeable-views';
import DashboardAppoinment from './AppointmentTab';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import dayjs from 'dayjs';

const DashboardMain: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const [value, setValue] = useState('1');
  const [index, setIndex] = useState(0);
  const userProfile = useSelector((state: AppState) => state.userProfile.value)

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          <div className="col-md-12">
            <div className="card dash-card">
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
                        <h3>{userProfile !== null && userProfile?.patients_id?.length}</h3>
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
                        <h6>Today Patient</h6>
                        <h3>160</h3>
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
                        <h6>Reservations</h6>
                        <h3>{userProfile !== null && userProfile?.reservations_id?.length}</h3>
                        <p className="text-muted">{dayjs().format('DD, MMM YYYY')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h4 className="mb-4">Patient Appoinment</h4>
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
                        setIndex(0)
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
                        setIndex(1)
                      }}
                    >
                      Today
                    </Link>
                  </li>
                </ul>
                <div className="card card-table mb-0">
                  <div className="card-body">
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={index} onChangeIndex={(index: number) => {
                        setIndex(index);
                        setValue(index.toString())
                      }}>
                      <TabPanel value="1">
                        <DashboardAppoinment isToday={false} />
                      </TabPanel>
                      <TabPanel value="2">
                        <DashboardAppoinment isToday />
                      </TabPanel>
                    </SwipeableViews>
                  </div>
                </div>
              </div>
            </TabContext>
          </div>
        </div>
      </div>
    </Fragment>
  );
})

export default DashboardMain;