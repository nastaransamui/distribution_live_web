/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import { DoctorProfileType, } from '@/components/SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import { AvailableType, formatNumberWithCommas, TimeType, } from '@/components/DoctorDashboardSections/ScheduleTiming';



export interface DoctorPublicProfileBusinessHoursType {
  profile: DoctorProfileType
}

const DoctorPublicProfileBusinessHoursTap: FC<DoctorPublicProfileBusinessHoursType> = (({ profile }) => {

  dayjs.extend(isBetween);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>

      <div className="card-body pt-0">
        <div className="tab-content pt-0">
          <div >
            <div className="row">
              <div className={`col-md-12   ${isClient ? 'animate__animated animate__slideInRight' : 'pre-anim-hidden'}`}>
                <div className="widget business-widget">
                  <div className="widget-content">
                    <div className="listing-hours">
                      <div className="listing-day current">
                        <div className="day">
                          Today <span>{dayjs().format('DD MMM YYYY')}</span>
                        </div>
                        <div className="time-items" style={{ width: '60%' }}>
                          {
                            profile?.timeslots?.length > 0 &&
                              profile?.timeslots[0]?.isTodayAvailable ?
                              <>
                                {
                                  profile?.timeslots[0]?.availableSlots?.map((availables: AvailableType, index: number) => {
                                    // Ensure startDate and finishDate are valid
                                    const startDate = availables?.startDate
                                      ? dayjs(availables.startDate, "DD MMM YYYY")
                                      : null;
                                    const finishDate = availables?.finishDate
                                      ? dayjs(availables.finishDate, "DD MMM YYYY")
                                      : null;

                                    // Only proceed if startDate and finishDate are valid
                                    if (startDate && finishDate) {
                                      // Check if today's date is within the range
                                      const today = dayjs();
                                      const isTodayInRange = today.isBetween(startDate, finishDate, null, "[]");
                                      if (isTodayInRange) {
                                        // Combine all periods into a single array
                                        const allPeriods = [
                                          ...(availables?.morning || []),
                                          ...(availables?.afternoon || []),
                                          ...(availables?.evening || []),
                                        ];
                                        // Ensure allPeriods is not empty
                                        if (allPeriods.length > 0) {
                                          return allPeriods.map((time: TimeType, j: number) => {
                                            let isTodayReserved = false
                                            if (time.isReserved) {
                                              const reservationsDaysArray = time?.reservations?.map((a) => a.selectedDate);
                                              const today = dayjs();
                                              isTodayReserved = reservationsDaysArray?.some(date =>
                                                dayjs(date).isSame(today, 'day')
                                              ) ?? false;

                                            }
                                            return (
                                              <Fragment key={`${index}-${j}`}>
                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                                  <span className="time">{time?.period}</span>
                                                  <span className="open-status">
                                                    {!time?.isReserved ?
                                                      <span className="badge bg-success-light">Available</span> :
                                                      <>
                                                        {isTodayReserved ? <span className="badge bg-danger-light">Not Available</span> : <span className="badge bg-success-light">Available</span>}
                                                      </>
                                                    }
                                                  </span>
                                                  <span className="time">{formatNumberWithCommas(time?.total.toString())}{" "} {time?.currencySymbol}</span>
                                                </div>
                                              </Fragment>
                                            )
                                          });
                                        }
                                      }
                                    }

                                    return null;
                                  })
                                }
                              </>
                              :
                              <>
                                <span className="open-status"><span className="badge bg-danger-light">Not Available</span></span>
                              </>
                          }
                        </div>
                      </div>
                      <div className="listing-day current">
                        <div className="day">
                          Tommorow <span>{dayjs().add(1, 'day').format('DD MMM YYYY')}</span>
                        </div>
                        <div className="time-items" style={{ width: '60%' }}>
                          {
                            profile?.timeslots?.length > 0 &&
                              profile?.timeslots[0]?.isTommorowAvailable ?
                              <>
                                {
                                  profile?.timeslots[0]?.availableSlots?.map((availables: AvailableType, index: number) => {
                                    // Ensure startDate and finishDate are valid
                                    const startDate = availables?.startDate
                                      ? dayjs(availables.startDate, "DD MMM YYYY")
                                      : null;
                                    const finishDate = availables?.finishDate
                                      ? dayjs(availables.finishDate, "DD MMM YYYY")
                                      : null;

                                    // Only proceed if startDate and finishDate are valid
                                    if (startDate && finishDate) {
                                      const today = dayjs();
                                      const tomorrow = today.add(1, 'day');
                                      const isTommorowInRange = tomorrow.isBetween(startDate, finishDate, null, "[]");

                                      if (isTommorowInRange) {
                                        // Combine all periods into a single array
                                        const allPeriods = [
                                          ...(availables?.morning || []),
                                          ...(availables?.afternoon || []),
                                          ...(availables?.evening || []),
                                        ];

                                        // Ensure allPeriods is not empty
                                        if (allPeriods.length > 0) {
                                          return allPeriods.map((time: TimeType, j: number) => {
                                            let isTommorowReserved = false
                                            if (time.isReserved) {
                                              const reservationsDaysArray = time?.reservations?.map((a) => a.selectedDate)
                                              const tomorrow = dayjs().add(1, 'day');
                                              if (reservationsDaysArray) {
                                                isTommorowReserved = reservationsDaysArray.some(date => dayjs(date).isSame(tomorrow, 'day'));
                                              }

                                            }
                                            return (
                                              <Fragment key={`${index}-${j}`}>
                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                                  <span className="time">{time?.period}</span>
                                                  <span className="open-status">
                                                    {!time?.isReserved ?
                                                      <span className="badge bg-success-light">Available</span> :
                                                      <>
                                                        {isTommorowReserved ? <span className="badge bg-danger-light">Not Available</span> : <span className="badge bg-success-light">Available</span>}
                                                      </>
                                                    }
                                                  </span>
                                                  <span className="time">{formatNumberWithCommas(time?.total.toString())}{" "} {time?.currencySymbol}</span>
                                                </div>
                                              </Fragment>
                                            )
                                          });
                                        }
                                      }
                                    }

                                    return null;
                                  })
                                }
                              </>
                              :
                              <>
                                <span className="open-status"><span className="badge bg-danger-light">Not Available</span></span>
                              </>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
});

export default DoctorPublicProfileBusinessHoursTap