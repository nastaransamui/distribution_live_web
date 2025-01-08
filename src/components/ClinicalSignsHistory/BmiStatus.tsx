
import { FC, Fragment, ReactNode, useState, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'


//Mui
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText'



import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

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


const BmiStatus: FC = (() => {

  const [from, setFrom] = useState<string>('0 140 140')
  const [to, setTo] = useState<string>('')
  const [bmi, setBmi] = useState('')
  const [vitalSign, setvitalSign] = useState<VitalSignTypes[]>([])

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
  dayjs.extend(duration)
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    control,
    setValue,
    reset: resetForm,
    getValues,
    watch
  } = useForm({
    defaultValues: {
      age: dayjs().diff(userProfile?.dob, 'years') || '',
      height: parseFloat(values?.height) || '',
      weight: parseFloat(values?.weight) || '',
      gender: userProfile?.gender
        ? userProfile.gender === 'Mr'
          ? 'male'
          : 'female'
        : '',
    }
  })

  const calculate = (data: any) => {
    const { age, height, weight, gender } = data
    let animateNeedle = document.getElementById('animateNeedle') as any
    let BMI = (weight / ((height * height) / 10000)).toFixed(1);
    let bmiSvg = document.getElementById('bmiSvg')!;
    let bmiUL = document.getElementById('bmiUL')!
    let bigText = document.getElementById('bigText')!
    if (animateNeedle !== null) {
      let bmiType =
        parseFloat(BMI) <= 16 ? 'Severe Thinness'
          : parseFloat(BMI) > 16 && parseFloat(BMI) < 17 ? 'Moderate Thinness'
            : parseFloat(BMI) > 17 && parseFloat(BMI) < 18.5 ? 'Mild Thinness'
              : parseFloat(BMI) > 18.5 && parseFloat(BMI) < 25 ? 'Normal'
                : parseFloat(BMI) > 25 && parseFloat(BMI) < 30 ? 'Overweight'
                  : parseFloat(BMI) > 30 && parseFloat(BMI) < 35 ? 'Obese Class I'
                    : parseFloat(BMI) > 35 && parseFloat(BMI) < 40 ? 'Obese Class II'
                      : 'Obese Class III'
      let bmiColor =
        parseFloat(BMI) <= 16 ? '#bc2020'
          : parseFloat(BMI) > 16 && parseFloat(BMI) < 17 ? '#d38888'
            : parseFloat(BMI) > 17 && parseFloat(BMI) < 18.5 ? '#ffe400'
              : parseFloat(BMI) > 18.5 && parseFloat(BMI) < 25 ? '#008137'
                : parseFloat(BMI) > 25 && parseFloat(BMI) < 30 ? '#ffe400'
                  : parseFloat(BMI) > 30 && parseFloat(BMI) < 35 ? '#d38888'
                    : parseFloat(BMI) > 35 && parseFloat(BMI) < 40 ? '#bc2020'
                      : '#8a0101'
      bigText.innerHTML = `
      <b>${bmi !== '' ? `BMI = ${BMI}` : 'BMI'} kg/m
      <sup>2</sup>
      </b> &nbsp; &nbsp; 
      <font color=${bmiColor}><b >${bmiType}</b></font>`
      bigText.style.display = 'flex'
      if (parseFloat(BMI) > 13 && parseFloat(BMI) < 43) {
        let degreeToMove = (parseFloat(BMI) - 13) * 6
        bmiSvg.style.display = 'block'
        bmiSvg?.classList.replace('animate__backOutDown', 'animate__backInUp')
        setTo(`${degreeToMove} 140 140`)
        setFrom('0 140 140')
        setBmi(BMI.toString())
        animateNeedle.beginElement()
        bmiUL.innerHTML = `<ul style="margin-left:8px;padding-left:8px; color: ${muiVar['--color']}">
        <li>Healthy BMI range: 18.5 kg/m<sup>2</sup> - 25 kg/m<sup>2</sup></li>
        <li>Healthy weight for the height: ${gender == 'male' ? (22 * (height / 100)) * 2 : (22 * ((height - 10) / 100)) * 2} kgs</li>
      </ul>`
      } else {
        bmiSvg.style.display = 'none'
        bmiUL.style.display = 'block'
        bmiUL.innerHTML = `<ul style="margin-left:8px;padding-left:8px; color: ${muiVar['--color']}">
        <li>Healthy BMI range: 18.5 kg/m<sup>2</sup> - 25 kg/m<sup>2</sup></li>
        <li>Healthy weight for the height: ${gender == 'male' ? (22 * (height / 100)) * 2 : (22 * ((height - 10) / 100)) * 2} kgs</li>
      </ul>`
        setTimeout(() => {
          bmiSvg?.classList.add('animate__backOutDown')
        }, 500);
      }
    }
  }

  const reset = () => {

    let animateNeedle = document.getElementById('animateNeedle') as any
    let bmiUL = document.getElementById('bmiUL')!
    let bmiSvg = document.getElementById('bmiSvg')!;
    let bigText = document.getElementById('bigText')!
    if (animateNeedle !== null) {
      setTo('0 140 140')
      setFrom(`0 140 140`)
      animateNeedle.beginElement()
      setBmi('')
      resetForm()
      bmiSvg.style.display = 'block'
      bmiSvg?.classList.replace('animate__backOutDown', 'animate__backInUp')
      bmiUL.innerHTML = ``
      bigText.style.display = 'none'
    }

  }

  const onBmiSubmit = (data: any) => {
    calculate(data)
  }


  useEffect(() => {
    if (homeSocket.current !== undefined) {
      //Get vital Sign on change database
      homeSocket.current.emit('getVitalSignFromAdmin', (msg: any) => {
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

  useEffect(() => {
    if (values.height) {
      setValue('height', parseFloat(values.height), { shouldDirty: true })
    }
    if (values.weight) {
      setValue('weight', parseFloat(values.weight), { shouldDirty: true })
    }
  }, [setValue, values])



  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-body ">
            <form id='bmi' noValidate onSubmit={handleSubmit(onBmiSubmit)}>
              <div className="row form-row">
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <TextField
                      required
                      id="age"
                      label="Age"
                      size="small"
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">
                          yr
                        </InputAdornment>
                      }}
                      error={errors.age == undefined ? false : true}
                      helperText={errors.age && errors['age']['message'] as ReactNode}
                      {
                      ...register('age', {
                        valueAsNumber: true,
                        min: {
                          value: 2,
                          message: 'Age should be between 2 years and 120 years' // JS only: <p>error message</p> TS only support string
                        },
                        max: {
                          value: 120,
                          message: 'Age should be between 2 years and 120 years' // JS only: <p>error message</p> TS only support string
                        },
                        required: "This field is required",
                      })
                      }
                      fullWidth
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <TextField
                      required
                      id="height"
                      label="Height"
                      size='small'
                      InputLabelProps={{ shrink: !!watch('height') }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">
                          cm
                        </InputAdornment>
                      }}
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'Backspace', 'Enter', 'Delete']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      error={errors.height == undefined ? false : true}
                      helperText={errors.height && errors['height']['message'] as ReactNode}
                      {
                      ...register('height', {
                        valueAsNumber: true,
                        required: "This field is required",
                      })
                      }
                      fullWidth
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <TextField
                      required
                      id="weight"
                      label="Weight"
                      size='small'
                      InputLabelProps={{ shrink: !!watch('weight') }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">
                          kg
                        </InputAdornment>
                      }}
                      onKeyDown={(e) => {
                        const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'Backspace', 'Enter', 'Delete']
                        if (!allowKeys.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      error={errors.weight == undefined ? false : true}
                      helperText={errors.weight && errors['weight']['message'] as ReactNode}
                      {
                      ...register('weight', {
                        valueAsNumber: true,
                        required: "This field is required",
                      })
                      }
                      fullWidth
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <Controller
                      rules={{ required: "This field is required" }}
                      name='gender'
                      control={control}
                      render={(props) => {
                        const { field, fieldState, formState } = props;
                        const { ref, onChange, value } = field;
                        const { defaultValues } = formState;
                        return (
                          <FormControl
                            error={errors.gender == undefined ? false : true}
                            fullWidth
                            required
                          >
                            <RadioGroup
                              value={getValues('gender')}
                              row
                              sx={{ justifyContent: 'space-evenly' }}
                              onChange={(e) => {
                                onChange(e)
                                setValue('gender', e.target.value)
                                clearErrors('gender')
                              }}
                            >
                              <FormControlLabel sx={{ color: theme.palette.text.color }} value="male" control={<Radio />} label="Male" />
                              <FormControlLabel sx={{ color: theme.palette.text.color }} value="female" control={<Radio />} label="Female" />
                            </RadioGroup>
                            {errors.gender &&
                              <FormHelperText>{"You need to select Gender Type"}</FormHelperText>
                            }
                          </FormControl>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className='bmi-container'>
              <button type="submit"
                className="btnLogin  mt-2" style={muiVar} form="bmi">calculate</button>
              <button type="button"
                className="btnLogin float-end  mt-2" onClick={reset}>reset</button>
              <div className="bigtext" id='bigText' style={{ marginTop: 5, display: 'none', justifyContent: 'center' }}></div>
              <div style={{ paddingTop: 20, textAlign: 'center' }} id='bmiSvg' className='animate__animated '>

                <svg xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink" width="400px" height="268px" viewBox="0 0 300 168">
                  <g transform="translate(18,18)" style={{ fontSize: 12 }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7"></polygon>
                      </marker>
                      <path id="curvetxt1" d="M-4 140 A140 140, 0, 0, 1, 284 140" style={{ fill: 'none' }}></path>
                      <path id="curvetxt2" d="M33 43.6 A140 140, 0, 0, 1, 280 140" style={{ fill: 'none' }}></path>
                      <path id="curvetxt3" d="M95 3 A140 140, 0, 0, 1, 284 140" style={{ fill: 'none' }}></path>
                      <path id="curvetxt4" d="M235.4 33 A140 140, 0, 0, 1, 284 140" style={{ fill: 'none' }}></path>
                    </defs>
                    <path d="M0 140 A140 140, 0, 0, 1, 6.9 96.7 L140 140 Z" fill="#bc2020"></path>
                    <path d="M6.9 96.7 A140 140, 0, 0, 1, 12.1 83.1 L140 140 Z" fill="#d38888"></path>
                    <path d="M12.1 83.1 A140 140, 0, 0, 1, 22.6 63.8 L140 140 Z" fill="#ffe400"></path>
                    <path d="M22.6 63.8 A140 140, 0, 0, 1, 96.7 6.9 L140 140 Z" fill="#008137"></path>
                    <path d="M96.7 6.9 A140 140, 0, 0, 1, 169.1 3.1 L140 140 Z" fill="#ffe400"></path>
                    <path d="M169.1 3.1 A140 140, 0, 0, 1, 233.7 36 L140 140 Z" fill="#d38888"></path>
                    <path d="M233.7 36 A140 140, 0, 0, 1, 273.1 96.7 L140 140 Z" fill="#bc2020"></path>
                    <path d="M273.1 96.7 A140 140, 0, 0, 1, 280 140 L140 140 Z" fill="#8a0101"></path>
                    <path d="M45 140 A90 90, 0, 0, 1, 230 140 Z" fill={`${muiVar['--bgDefault']}`}></path>
                    <circle cx="140" cy="140" r="5" fill={`${muiVar['--color']}`}></circle>
                    <g style={{ paintOrder: "stroke", stroke: '#fff', strokeWidth: '2px' }}><text x="25" y="111"
                      transform="rotate(-72, 25, 111)">16</text><text x="30" y="96" transform="rotate(-66, 30, 96)">17</text><text
                        x="35" y="83" transform="rotate(-57, 35, 83)">18.5</text><text x="97" y="29"
                          transform="rotate(-18, 97, 29)">25</text><text x="157" y="20" transform="rotate(12, 157, 20)">30</text><text
                            x="214" y="45" transform="rotate(42, 214, 45)">35</text><text x="252" y="95"
                              transform="rotate(72, 252, 95)">40</text></g>
                    <g style={{ fontSize: 14 }}><text>
                      <textPath xlinkHref="#curvetxt1" className='bmi-round-text'>Underweight</textPath>
                    </text><text>
                        <textPath xlinkHref="#curvetxt2" className='bmi-round-text'>Normal</textPath>
                      </text><text>
                        <textPath xlinkHref="#curvetxt3" className='bmi-round-text'>Overweight</textPath>
                      </text><text>
                        <textPath xlinkHref="#curvetxt4" className='bmi-round-text'>Obesity</textPath>
                      </text></g>
                    <line x1="140" y1="140" x2="65" y2="140" stroke={`${muiVar['--color']}`} strokeWidth="2" markerEnd="url(#arrowhead)">
                      <animateTransform id='animateNeedle' attributeName="transform" attributeType="XML" type="rotate" from={from} to={to}
                        dur="1s" fill="freeze" begin="indefinite" repeatCount="1"></animateTransform>
                    </line><text
                      x='110' y="120"
                      style={{ fontSize: '30px', fontWeight: 'bold', fill: `${muiVar['--color']}` }}>
                      BMI
                    </text>
                  </g>
                </svg></div>
              <div id='bmiUL' style={{ paddingTop: 20, textAlign: 'center' }}></div>
            </div>
            <h3>BMI introduction</h3>
            <p>BMI is a measurement of a persons leanness or corpulence based on their height and weight, and is intended to quantify tissue mass. It is widely used as a general indicator of whether a person has a
              healthy body weight for their height. Specifically, the value obtained from the calculation of BMI is used to categorize whether a person is
              underweight, normal weight, overweight, or obese depending on what range the value falls between. These ranges of BMI vary based on
              factors such as region and age, and are sometimes further divided into subcategories such as severely underweight or very severely obese.
              Being overweight or underweight can have significant health effects, so while BMI is an imperfect measure of healthy body weight,
              it is a useful indicator of whether any additional testing or action is required. Refer to the table below to see the different categories
              based on BMI that are used by the calculator.</p>
            <h3>BMI table for adults</h3>
            <p>This is the World Health Organizations (WHO) recommended body weight based on BMI values for adults. It is used
              for both men and women, age 20 or older.</p>
            <TableContainer component={Paper} >
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Classification</StyledTableCell>
                    <StyledTableCell align="center">BMI range - kg/m<sup>2</sup></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Severe Thinness</TableCell>
                    <TableCell align="center">&lt; 16</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Moderate Thinness</TableCell>
                    <TableCell align="center">16 - 17</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Mild Thinness</TableCell>
                    <TableCell align="center">17 - 18.5</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Normal</TableCell>
                    <TableCell align="center">18.5 - 25</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Overweight</TableCell>
                    <TableCell align="center">25 - 30</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Obese Class I</TableCell>
                    <TableCell align="center">30 - 35</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Obese Class II</TableCell>
                    <TableCell align="center">35 - 40</TableCell>
                  </StyledTableRow>
                  <StyledTableRow sx={{ 'th': { borderRight: `1px solid rgba(81, 81, 81, 1)` } }} >
                    <TableCell component="th" scope="row" align='center'> Obese Class III</TableCell>
                    <TableCell align="center">&gt; 40</TableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default BmiStatus;