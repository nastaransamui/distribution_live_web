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
import dayjs, { Dayjs } from 'dayjs';


export interface AwardsProps {
  errors: any;
  control: any;
  awardsFields: any;
  appendAwards: any;
  removeAwards: any;
  Controller: any;
}

const Awards: FC<AwardsProps> = ((props: AwardsProps) => {
  const { muiVar } = useScssVar();
  const {
    errors,
    control,
    awardsFields,
    appendAwards,
    removeAwards,
    Controller,
  } = props;


  const addInputField = () => {
    appendAwards({
      award: '',
      year: ''
    })

  }
  const removeInputFields = (index: number) => {
    removeAwards(index)
  }


  const theme = useTheme()

  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body">
          <h4 className="card-title">Awards</h4>
          {awardsFields.map((data: any, index: number) => {
            return (
              <div className="education-info" key={index + data?.id} >
                <div className="row form-row education-cont">
                  <div className="col-12 col-md-10 col-lg-11">
                    <div className="row form-row">
                      <div className="col-12 col-md-5">
                        <div className="form-group">
                          <TextField
                            required
                            id={`award_${index}`}
                            label="Award"
                            error={errors?.['awards']?.[index]?.['award'] == undefined ? false : true}
                            helperText={errors?.['awards']?.[index]?.['award'] && errors['awards'][index]['award']['message'] as ReactNode}
                            {
                            ...control.register(`awards.${index}.award`, {
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
                            name={`awards.${index}.year`}
                            control={control}
                            render={(props: any) => {
                              const { field, } = props;
                              const { onChange, value } = field;
                              return (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <MobileDatePicker
                                    value={value ? dayjs(value) : null}
                                    closeOnSelect
                                    disableFuture
                                    format="YYYY"
                                    views={["year"]}
                                    onChange={(event: Dayjs | null) => {
                                      onChange(dayjs(event).format(`YYYY`));
                                    }}
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
                                        error: errors?.['awards']?.[index]?.['year'] == undefined ? false : true,
                                        helperText: errors?.['awards']?.[index]?.['year'] && errors['awards'][index]['year']['message'] as ReactNode,
                                        size: "small"
                                      },
                                    }}
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
          {awardsFields.length < 5 && <div className="add-more" onClick={addInputField}>
            <Link href="#0" onClick={(e) => e.preventDefault()} className="add-education">
              <i className="fa fa-plus-circle"></i> Add More
            </Link>
          </div>}
        </div>
      </div>
    </Fragment>
  )
})

export default Awards;