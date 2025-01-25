/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import Lightbox from "yet-another-react-lightbox";
import Link from 'next/link'

import Rating from '@mui/material/Rating';

import { useTheme } from "@mui/material/styles";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs';

import { AvailableType, DoctorsTimeSlotType, TimeType, afterNoonFinish, afterNoonStart, eveningFinish, eveningStart, formatNumberWithCommas, morningFinish, morningStart } from '@/components/DoctorDashboardSections/ScheduleTiming';

export interface DoctorPublicProfileAvailabilityType {
  profile: DoctorProfileType
}

const DoctorPublicProfileAvailabilityTap: FC<DoctorPublicProfileAvailabilityType> = (({ profile }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showPricePriod, setShowPricePeriod] = useState<string>('')
  const [showPrice, setShowPrice] = useState<{ morning: boolean, afternoon: boolean, evening: boolean }>({
    morning: false,
    afternoon: false,
    evening: false
  })
  return (
    <Fragment>

      <div className="card-body pt-0">
        <div className="tab-content pt-0">
          <div >
            <div className="location-list">
              <div className="row">
                <div className="col-md-5">
                  <div className="clinic-content">
                    <h1 className="clinic-name">
                      <Link href="" onClick={(e) => e.preventDefault()}>
                        {profile.clinicName}
                      </Link>
                    </h1>
                    <p className="doc-speciality">
                      {profile?.specialities?.[0]?.description}
                    </p>
                    <span style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                      <Rating name="read-only" precision={0.5} value={profile?.rate_array.length == 0 ? 0 : (profile?.rate_array.reduce((acc, num) => acc + num, 0) / profile?.rate_array.length)} readOnly size='small' />
                      <span className="d-inline-block average-rating" style={{ marginLeft: '6px' }}>({profile?.rate_array.length})</span>
                    </span>
                    <div className="clinic-details mb-0">
                      <h5 className="clinic-direction">
                        {" "}
                        <div className="doctor-widget-one">

                          <p className="doc-location" >
                            <i className="fas fa-map-marker-alt"> </i>
                            {profile?.clinicAddress}
                          </p>

                        </div>
                      </h5>
                      <ul className="clinic-gallery">
                        {profile?.clinicImages.length !== 0 &&
                          profile?.clinicImages.map((img, index) => {
                            return (
                              <li key={index}>
                                <Link href="" aria-label='clinic-gallery' onClick={(e) => {
                                  e.preventDefault();
                                  setOpen(true);
                                  setIndex(index)
                                }} >
                                  <img src={img.src} alt='' />
                                </Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="clinic-timing">
                    {
                      profile.timeslots &&
                      profile.timeslots.length > 0 &&
                      profile.timeslots[0].availableSlots.map((time: AvailableType, timeIndex: number) => {
                        return (
                          <div key={timeIndex}>
                            <p className="timings-days">
                              <span> {time.startDate} to {time.finishDate} </span>
                            </p>
                            {
                              time.morning.length > 0 &&
                              <>
                                <FormControlLabel sx={{
                                  "& .Mui-checked": {
                                    color: theme.palette.primary.main
                                  },
                                  "& .MuiFormControlLabel-label": {
                                    color: showPrice?.morning && showPricePriod == `${time.startDate} to ${time.finishDate}` ? `${theme.palette.secondary.main}` : `${theme.palette.text.color}`,
                                    transition: "color 0.3s ease", // Optional for smooth color change
                                  },
                                  "&:hover .MuiFormControlLabel-label": {
                                    color: `${theme.palette.secondary.main}`,
                                  },
                                }} control={<Checkbox defaultChecked name={dayjs(morningStart).minute(0).format('HH:mm')} />}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowPrice((prevState) => {
                                      return {
                                        afternoon: false,
                                        evening: false,
                                        morning: true
                                      }
                                    })
                                    setShowPricePeriod(`${time.startDate} to ${time.finishDate}`)
                                  }}
                                  label="Morning" />
                                <small >
                                  {dayjs(morningStart).minute(0).format('HH:mm')}{" "}
                                  to
                                  {dayjs(morningFinish).minute(0).format('HH:mm')}
                                </small><br />
                              </>
                            }
                            {
                              time.afternoon.length > 0 &&
                              <>
                                <FormControlLabel sx={{
                                  "& .Mui-checked": {
                                    color: theme.palette.primary.main
                                  },
                                  "& .MuiFormControlLabel-label": {
                                    color: showPrice?.afternoon && showPricePriod == `${time.startDate} to ${time.finishDate}` ? `${theme.palette.secondary.main}` : `${theme.palette.text.color}`,
                                    transition: "color 0.3s ease", // Optional for smooth color change
                                  },
                                  "&:hover .MuiFormControlLabel-label": {
                                    color: `${theme.palette.secondary.main}`,
                                  },
                                }} control={<Checkbox defaultChecked />} name={dayjs(afterNoonStart).minute(0).format('HH:mm')}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowPrice((prevState) => {
                                      return {
                                        morning: false,
                                        evening: false,
                                        afternoon: true
                                      }
                                    })
                                    setShowPricePeriod(`${time.startDate} to ${time.finishDate}`)
                                  }}
                                  label="Afternoon" />
                                <small >
                                  {dayjs(afterNoonStart).minute(0).format('HH:mm')}{" "}
                                  to
                                  {dayjs(afterNoonFinish).minute(0).format('HH:mm')}
                                </small><br />
                              </>
                            }
                            {
                              time.evening.length > 0 &&
                              <>
                                <FormControlLabel sx={{
                                  "& .Mui-checked": {
                                    color: theme.palette.primary.main
                                  },
                                  "& .MuiFormControlLabel-label": {
                                    color: showPrice?.evening && showPricePriod == `${time.startDate} to ${time.finishDate}` ? `${theme.palette.secondary.main}` : `${theme.palette.text.color}`,
                                    transition: "color 0.3s ease", // Optional for smooth color change
                                  },
                                  "&:hover .MuiFormControlLabel-label": {
                                    color: `${theme.palette.secondary.main}`,
                                  },
                                }} control={<Checkbox defaultChecked />}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowPrice((prevState) => {
                                      return {
                                        morning: false,
                                        afternoon: false,
                                        evening: true
                                      }
                                    })
                                    setShowPricePeriod(`${time.startDate} to ${time.finishDate}`)
                                  }}
                                  name={dayjs(eveningStart).minute(0).format('HH:mm')} label="Evening" />
                                <small>
                                  {dayjs(eveningStart).minute(0).format('HH:mm')}{" "}
                                  to
                                  {dayjs(eveningFinish).minute(0).format('HH:mm')}
                                </small><br />
                              </>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                {profile.timeslots &&
                  profile.timeslots.length > 0 &&
                  <div className="col-md-3 text-start">
                    {
                      Object.entries(showPrice).map(([key, value], index: number) => {
                        if (value) {
                          return (
                            <Fragment key={index}>
                              <p className="timings-days">
                                <span> {key.charAt(0).toUpperCase() + key.slice(1)} </span><br />
                                <small> {showPricePriod} </small>
                              </p>
                              {profile?.timeslots.map((slot: DoctorsTimeSlotType, i: number) => {
                                return slot.availableSlots.map((available: AvailableType, j: number) => {
                                  const periodTimeArray = available[key as keyof AvailableType] as TimeType[];
                                  if (`${available.startDate} to ${available.finishDate}` == showPricePriod) {
                                    return periodTimeArray.map((time: TimeType, h: number) => {
                                      return (
                                        time?.active && (
                                          <Fragment key={`${i}-${j}-${h}`}>
                                            <span style={{ color: theme.palette.text.color }}>
                                              <p>{time?.period} : {formatNumberWithCommas(time?.total)} {time?.currencySymbol} <br /></p>
                                            </span>
                                          </Fragment>
                                        )
                                      );
                                    });
                                  }
                                  return null;
                                });
                              })}
                            </Fragment>
                          );
                        }
                        return null;
                      })
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={profile?.clinicImages}
        index={index}
      />
    </Fragment>
  )
});

export default DoctorPublicProfileAvailabilityTap;