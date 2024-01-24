
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

export interface VitalTypeObject {
  value: string;
  date: string;
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

  const [vitalSign, setvitalSign] = useState<VitalSignTypes[]>([])
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const { muiVar } = useScssVar();
  const theme = useTheme();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
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
      homeSocket.current.emit('getVitalSign', { userId })
      homeSocket.current.once('getVitalSignReturn', (msg: any) => {
        setvitalSign(msg)
      })
    }
  }, [homeSocket, userProfile?._id])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
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
                  title == 'heartRate' ? " Heart Rate /bpm"
                    : title == 'bodyTemp' ? "Body tempreture /℃"
                      : title == 'weight' ? "Weight /㎏"
                        : 'Height /㎝'
                let dataArray: VitalTypeObject[] = vitalSign[0]?.[title as keyof typeof vitalSign[0]] as VitalTypeObject[]
                return (
                  <Fragment key={index}>
                    <h3 >{formatTitle}</h3>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table sx={{ minWidth: 650, }} size="small">
                        <TableHead>
                          <StyledTableRow>
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
                                    <TableCell component="th" scope="row" align='center'>{a.value} {unit}</TableCell>
                                    <TableCell align="center">{dayjs(a.date).tz(process.env.TZ).format('YY MMM DD HH:mm')}</TableCell>
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