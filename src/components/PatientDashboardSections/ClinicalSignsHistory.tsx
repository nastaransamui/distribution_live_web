
import { FC, Fragment, useState, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'


//Mui
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { toast } from 'react-toastify';

export interface VitalTypeObject {
  value: string;
  date: Date;
  id: number;
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
export interface ExtendedVitalSignTypes extends VitalSignTypes {
  totalBodyTemp: number;
  totalHeartRate: number;
  totalHeight: number;
  totalWeight: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRight: `1px solid rgba(81, 81, 81, 1)`
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));


const ClinicalSignsHistory: FC = (() => {

  const [vitalSign, setvitalSign] = useState<ExtendedVitalSignTypes[]>([])
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)


  let lengths = useMemo(() => {
    return {
      heartRate: vitalSign[0]?.heartRate?.length || 0,
      bodyTemp: vitalSign[0]?.bodyTemp?.length || 0,
      weight: vitalSign[0]?.weight?.length || 0,
      height: vitalSign[0]?.height?.length || 0,
    }
  }, [vitalSign])
  let values = useMemo(() => {
    return {
      heartRate: vitalSign[0]?.heartRate?.[lengths['heartRate' as keyof typeof lengths] - 1]['value'],
      bodyTemp: vitalSign[0]?.bodyTemp?.[lengths['bodyTemp' as keyof typeof lengths] - 1]['value'],
      weight: vitalSign[0]?.weight?.[lengths['weight' as keyof typeof lengths] - 1]['value'],
      height: vitalSign[0]?.height?.[lengths['height' as keyof typeof lengths] - 1]['value'],
    }
  }, [lengths, vitalSign])

  useEffect(() => {
    if (homeSocket.current !== undefined) {
      //Get vital Sign on change database
      homeSocket.current.on('getVitalSignFromAdmin', (msg: any) => {
        setvitalSign(msg)
      })
      let userId = userProfile?._id
      // Get vital sing on entrance of page
      homeSocket.current.emit('getVitalSign', { userId, limit: 5, skip: 0, sort: { date: -1 } })
      homeSocket.current.once('getVitalSignReturn', (msg: { status: number, message?: string, vitalSign: ExtendedVitalSignTypes[] }) => {
        const { status, message, vitalSign } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} find Vital signs`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {

            }
          });
        } else {
          setvitalSign(vitalSign)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, userProfile?._id])
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9 animate__animated animate__backInUp">
        <div className="card">
          <div className="card-body ">
            {
              Object.keys(values).map((title, index) => {
                let unit =
                  title == "heartRate" ? 'bpm'
                    : title == "bodyTemp" ? '℃'
                      : title == 'weight' ? '㎏'
                        : '㎝'
                let formatTitle =
                  title == 'heartRate' ? ` Heart Rate /bpm ${vitalSign.length > 0 && vitalSign[0]?.totalHeartRate} record${vitalSign[0]?.totalHeartRate > 1 ? 's' : ''}`
                    : title == 'bodyTemp' ? `Body tempreture /℃ ${vitalSign.length > 0 && vitalSign[0]?.totalBodyTemp} record${vitalSign[0]?.totalBodyTemp > 1 ? 's' : ''}`
                      : title == 'weight' ? `Weight /㎏ ${vitalSign.length > 0 && vitalSign[0]?.totalWeight} record${vitalSign[0]?.totalWeight > 1 ? 's' : ''}`
                        : `Height /㎝ ${vitalSign.length > 0 && vitalSign[0]?.totalHeight} record${vitalSign[0]?.totalHeight > 1 ? 's' : ''}`
                let dataArray: VitalTypeObject[] = vitalSign[0]?.[title as keyof typeof vitalSign[0]] as VitalTypeObject[]
                return (
                  <Fragment key={index}>
                    <h3 >{formatTitle}</h3>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table sx={{ minWidth: 650, }} size="small">
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell align="center">id</StyledTableCell>
                            <StyledTableCell align="center">Value / {unit}</StyledTableCell>
                            <StyledTableCell align="center">Date</StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {
                            dataArray == undefined ?
                              <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} /> :
                              dataArray.map((a, i) => {
                                return (
                                  <StyledTableRow key={i + index} sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                                    <TableCell component="th" scope="row" align='center'>{a.id}</TableCell>
                                    <TableCell component="th" scope="row" align='center'>{a.value} {unit}</TableCell>
                                    <TableCell align="center">{dayjs(a.date).tz(process.env.TZ).format('YY MMM DD HH:mm:ss')}</TableCell>
                                  </StyledTableRow>
                                )
                              })
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {index + 1 < Object.keys(values).length && <Divider sx={{ color: theme.palette.secondary.main, m: 2 }} />}
                  </Fragment>
                )
              })
            }
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default ClinicalSignsHistory;