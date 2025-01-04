import { FC, Fragment, ReactNode, useState } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material'; import dayjs from 'dayjs';


export interface RegistrationsProps {
  errors: any;
  control: any;
  registrationsFields: any;
  appendRegistrations: any;
  removeRegistrations: any;
  Controller: any;
}




const Registrations: FC<RegistrationsProps> = ((props: RegistrationsProps) => {
  const { muiVar } = useScssVar();

  const {
    errors,
    control,
    registrationsFields,
    appendRegistrations,
    removeRegistrations,
    Controller,
  } = props;

  const addInputField = () => {
    appendRegistrations({
      registration: '',
      year: ''
    })

  }
  const removeInputFields = (index: number) => {
    removeRegistrations(index)
  }

  const theme = useTheme()

  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body">
          <h4 className="card-title">Registrations</h4>
          {registrationsFields.map((data: any, index: number) => {
            return (
              <div className="education-info" key={index + data?.id}>
                <div className="row form-row education-cont">
                  <div className="col-12 col-md-10 col-lg-11">
                    <div className="row form-row">
                      <div className="col-12 col-md-5">
                        <div className="form-group">
                          <TextField
                            required
                            id={`registration_${index}`}
                            label="Registration"
                            error={errors?.['registrations']?.[index]?.['registration'] == undefined ? false : true}
                            helperText={errors?.['registrations']?.[index]?.['registration'] && errors['registrations'][index]['registration']['message'] as ReactNode}
                            {
                            ...control.register(`registrations.${index}.registration`, {
                              required: `This field is required `,
                            })
                            }
                            fullWidth
                            size='small'
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-5">
                        <div className="form-group">
                          <Controller
                            rules={{ required: 'This field is required' }}
                            name={`registrations.${index}.year`}
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
                                    format="YYYY"
                                    views={["year"]}
                                    onChange={(event) => { onChange(dayjs(event).format(`YYYY`)); }}
                                    slotProps={{
                                      textField: {
                                        inputProps: { value: value == '' ? 'Year' : dayjs(value).format('YYYY') },
                                        fullWidth: true,
                                        required: true,
                                        label: 'Year',
                                        InputProps: {
                                          startAdornment: <InputAdornment position="start">
                                            <i className="fa-solid fa-calendar-minus" style={{ width: "16px", color: theme.palette.secondary.main }} />
                                          </InputAdornment>
                                        },
                                        error: errors?.['registrations']?.[index]?.['year'] == undefined ? false : true,
                                        helperText: errors?.['registrations']?.[index]?.['year'] && errors['registrations'][index]['year']['message'] as ReactNode,
                                        size: 'small'
                                      },
                                    }}

                                    value={dayjs(data?.[index]?.[`registrations.${index}.year`])}
                                  />
                                </LocalizationProvider>
                              )
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-2">
                        <div className="delete-icon">
                          <Link
                            href="#0"
                            className="btn btn-danger trash"
                            onClick={(e) => {
                              e.preventDefault();
                              removeInputFields(index)
                            }}
                          >
                            <i className="far fa-trash-alt"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {registrationsFields.length < 5 && <div className="add-more" >
            <Link href="#0" onClick={(e) => {
              e.preventDefault()
              addInputField()
            }} className="add-education">
              <i className="fa fa-plus-circle"></i> Add More
            </Link>
          </div>}
        </div>
      </div>
    </Fragment>
  )
})

export default Registrations;