import { FC, Fragment, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Calendar as BigCalendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import FeatherIcon from "feather-icons-react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


const AvailableTiming: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const [currentDay, setCurrentDay] = useState(new Date())


  var nextTenDays = new Date();
  nextTenDays.setDate(nextTenDays.getDate() + 10)
  var twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7)

  var nextTwoWeek = new Date();
  nextTwoWeek.setDate(nextTwoWeek.getDate() + 14)

  const localizer = dayjsLocalizer(dayjs)

  const [myEventsList, setMyEventsList] = useState(
    [
      {
        start: dayjs().toDate(),
        end: dayjs()
          .add(1, "hours")
          .toDate(),
        title: "sevenHoursAgo"
      },
      {
        start: dayjs().toDate(),
        end: dayjs()
          .add(1, "hours")
          .toDate(),
        title: "now"
      },
      {
        start: dayjs().toDate(),
        end: dayjs()
          .add(1, "hours")
          .toDate(),
        title: "twoHourFromNow"
      },
      {
        start: dayjs(nextTenDays.toString()).toDate(),
        end: dayjs(nextTenDays.toString())
          .add(2, "hours")
          .toDate(),
        title: "nextTenDays"
      },
      {
        start: dayjs(twoDaysAgo.toString()).toDate(),
        end: dayjs(twoDaysAgo.toString())
          .add(2, "hours")
          .toDate(),
        title: "Two days ago"
      },
      {
        start: dayjs(nextWeek.toString()).toDate(),
        end: dayjs(nextWeek.toString())
          .add(2, "hours")
          .toDate(),
        title: "Next week"
      },
      {
        start: dayjs(nextTwoWeek.toString()).toDate(),
        end: dayjs(nextTwoWeek.toString())
          .add(2, "hours")
          .toDate(),
        title: "nextTwoWeek"
      }
    ]
  )

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Schedule Timings</h4>
                <div className="profile-box">
                  <div className="row">
                    <div className="col-sm-6 col-12 avail-time">
                      <div className="mb-3">
                        <div className="schedule-calendar-col justify-content-start">
                          <form className="d-flex flex-wrap">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <MobileDatePicker
                                format="DD MMM YYYY"
                                closeOnSelect
                                defaultValue={dayjs(currentDay)}
                                disablePast
                                sx={{ width: { lg: 250, md: '100%', sm: '100%', xs: '100%' }, }}
                                onChange={(value: any, context: any) => {
                                  setCurrentDay(value)
                                }}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    InputLabelProps: { shrink: true },
                                    InputProps: {
                                      startAdornment: <InputAdornment position="start">
                                        <i ><FeatherIcon icon="calendar" style={{ width: "16px", color: theme.palette.secondary.main }} /></i>
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

                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <BigCalendar
                      localizer={localizer}
                      events={myEventsList}
                      startAccessor="start"
                      endAccessor="end"
                      onNavigate={() => currentDay}
                      date={currentDay}
                      views={['month', 'week', 'work_week', 'day', 'agenda']}
                      defaultView='day'
                      style={{
                        height: 500,
                        background: theme.palette.background.default,
                        color: theme.palette.text.color,
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 15,
                        padding: 20
                      }}
                      eventPropGetter={(event) => {
                        return {
                          style: {
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.primary.contrastText,
                          }
                        }
                      }}
                    />
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

export default AvailableTiming;