import { FC, Fragment, ReactNode, useState } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useWatch } from 'react-hook-form';

export interface ExperienceProps {
  errors: any;
  control: any;
  experincesFields: any;
  appendExperinces: any;
  removeExperinces: any;
  Controller: any;
}
const Experience: FC<ExperienceProps> = ((props: ExperienceProps) => {

  const { muiVar } = useScssVar();
  const {
    errors,
    control,
    experincesFields,
    appendExperinces,
    removeExperinces,
    Controller,
  } = props;


  const addInputField = () => {
    appendExperinces({
      hospitalName: '',
      from: '',
      to: '',
      designation: ''
    })

  }
  const removeInputFields = (index: number) => {
    removeExperinces(index)
  }

  const theme = useTheme()

  const experincesValues = useWatch({
    name: "experinces",
    control
  });

  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body">
          <h4 className="card-title">Experience</h4>
          {
            experincesFields.map((data: any, index: number) => {
              return (
                <div className="experience-info" key={index + data?.id} >
                  <div className="row form-row experience-cont">
                    <div className="col-12 col-md-10 col-lg-11">
                      <div className="row form-row">
                        <div className="col-12 col-md-6 col-lg-3">
                          <div className="form-group">
                            <TextField
                              required
                              id={`hospitalName_${index}`}
                              label="Hospital Name"
                              error={errors?.['experinces']?.[index]?.['hospitalName'] == undefined ? false : true}
                              helperText={errors?.['experinces']?.[index]?.['hospitalName'] && errors['experinces'][index]['hospitalName']['message'] as ReactNode}
                              {
                              ...control.register(`experinces.${index}.hospitalName`, {
                                required: `This field is required `,
                              })
                              }
                              fullWidth
                              size='small'
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                          <div className="form-group">
                            <Controller
                              rules={{ required: 'This field is required' }}
                              name={`experinces.${index}.from`}
                              control={control}
                              render={(props: any) => {
                                const { field, fieldState, formState } = props;
                                const { ref, onChange, value } = field;
                                const { defaultValues } = formState;
                                return (
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                      closeOnSelect
                                      disableFuture
                                      format="DD MMM YYYY"
                                      onChange={(event: any) => { onChange(dayjs(event).format(`YYYY-MM-DDTHH:mm:ss`)); }}
                                      slotProps={{
                                        textField: {
                                          inputProps: { value: value == '' ? 'From' : dayjs(value).format('DD MMM YYYY') },
                                          InputProps: {
                                            startAdornment: <InputAdornment position="start">
                                              <i className="fa-solid fa-calendar-minus" style={{ width: "16px", color: theme.palette.secondary.main }} />
                                            </InputAdornment>
                                          },
                                          fullWidth: true,
                                          required: true,
                                          label: 'From',
                                          error: errors?.['experinces']?.[index]?.['from'] == undefined ? false : true,
                                          helperText: errors?.['experinces']?.[index]?.['from'] && errors['experinces'][index]['from']['message'] as ReactNode,
                                          size: 'small'
                                        },
                                      }}

                                    // value={dayjs(data?.[index]?.[`experinces.${index}.from`])}
                                    />
                                  </LocalizationProvider>
                                )
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                          <div className="form-group">
                            <Controller
                              rules={{ required: 'This field is required' }}
                              name={`experinces.${index}.to`}
                              control={control}
                              render={(props: any) => {
                                const { field, fieldState, formState } = props;
                                const { ref, onChange, value } = field;
                                const { defaultValues } = formState;
                                return (
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                      closeOnSelect
                                      disableFuture
                                      format="DD MMM YYYY"
                                      minDate={dayjs(experincesValues?.[index]?.['from'])}
                                      onChange={(event) => { onChange(dayjs(event).format(`YYYY-MM-DDTHH:mm:ss`)); }}
                                      slotProps={{
                                        textField: {
                                          inputProps: { value: value == '' ? 'To' : dayjs(value).format('DD MMM YYYY') },
                                          InputProps: {
                                            startAdornment: <InputAdornment position="start">
                                              <i className="fa-solid fa-calendar-minus" style={{ width: "16px", color: theme.palette.secondary.main }} />
                                            </InputAdornment>
                                          },
                                          fullWidth: true,
                                          required: true,
                                          label: 'To',
                                          error: errors?.['experinces']?.[index]?.['to'] == undefined ? false : true,
                                          helperText: errors?.['experinces']?.[index]?.['to'] && errors['experinces'][index]['to']['message'] as ReactNode,
                                          size: 'small'
                                        },
                                      }}

                                    // value={dayjs(data?.[index]?.[`experinces.${index}.to`])}
                                    />
                                  </LocalizationProvider>
                                )
                              }}
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="form-group">
                            <TextField
                              required
                              id={`designation_${index}`}
                              label="Designation"
                              error={errors?.['experinces']?.[index]?.['designation'] == undefined ? false : true}
                              helperText={errors?.['experinces']?.[index]?.['designation'] && errors['experinces'][index]['designation']['message'] as ReactNode}
                              {
                              ...control.register(`experinces.${index}.designation`, {
                                required: `This field is required `,
                              })
                              }
                              fullWidth
                              size='small'
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-1">
                          <div className="delete-icon">
                            <Link href="#0" className="btn btn-danger trash" onClick={(e) => {
                              e.preventDefault
                              removeInputFields(index)
                            }} >
                              <i className="far fa-trash-alt"></i></Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          {experincesFields.length < 5 && <div className="add-more" >
            <Link href="" onClick={(e) => {
              e.preventDefault()
              addInputField()
            }} className="add-experience" ><i className="fa fa-plus-circle"></i> Add More</Link>
          </div>}
        </div>
      </div>
    </Fragment>
  )
})

export default Experience;