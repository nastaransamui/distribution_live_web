import { FC, Fragment, ReactNode } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'


import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';

export interface EducationProps {
  errors: any;
  control: any;
  educationsFields: any;
  appendEducations: any;
  removeEducations: any;
  Controller: any;
}

const Education: FC<EducationProps> = ((props: EducationProps) => {
  const { muiVar } = useScssVar();
  const {
    errors,
    control,
    educationsFields,
    appendEducations,
    removeEducations,
    Controller
  } = props;

  const addInputField = () => {
    appendEducations({
      degree: '',
      collage: '',
      yearOfCompletion: ''
    })
  }
  const removeInputFields = (index: number) => {
    removeEducations(index)
  }


  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body">
          <h4 className="card-title">Education</h4>
          {
            educationsFields.map((data: any, index: number) => {
              return (
                <div className="education-info" key={index + data?.id} >
                  <div className="row form-row education-cont">
                    <div className="col-12 col-md-10 col-lg-11">
                      <div className="row form-row">
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="form-group">
                            <TextField
                              required
                              id={`degree_${index}`}
                              label="Degree"
                              error={errors?.['educations']?.[index]?.['degree'] == undefined ? false : true}
                              helperText={errors?.['educations']?.[index]?.['degree'] && errors['educations'][index]['degree']['message'] as ReactNode}
                              {
                              ...control.register(`educations.${index}.degree`, {
                                required: `This field is required `,
                              })
                              }
                              fullWidth
                              size='small'
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="form-group">
                            <TextField
                              required
                              id={`collage_${index}`}
                              label="College/Institute"
                              error={errors?.['educations']?.[index]?.['collage'] == undefined ? false : true}
                              helperText={errors?.['educations']?.[index]?.['collage'] && errors['educations'][index]['collage']['message'] as ReactNode}
                              {
                              ...control.register(`educations.${index}.collage`, {
                                required: "This field is required ",
                              })
                              }
                              fullWidth
                              size='small'
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="form-group">
                            <Controller
                              rules={{ required: 'This field is required' }}
                              name={`educations.${index}.yearOfCompletion`}
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
                                          inputProps: { value: value == '' ? 'Year of Completion' : dayjs(value).format('YYYY') },
                                          fullWidth: true,
                                          required: true,
                                          label: 'Year of Completion',
                                          error: errors?.['educations']?.[index]?.['yearOfCompletion'] == undefined ? false : true,
                                          helperText: errors?.['educations']?.[index]?.['yearOfCompletion'] && errors['educations'][index]['yearOfCompletion']['message'] as ReactNode,
                                          size: 'small'
                                        },
                                      }}
                                    />
                                  </LocalizationProvider>
                                )
                              }}
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-1">
                      <div className="delete-icon">

                        <Link href="" className="btn btn-danger trash" onClick={(e) => {
                          e.preventDefault()
                          removeInputFields(index)
                        }}>
                          <i className="far fa-trash-alt" ></i></Link>
                      </div>
                    </div>
                  </div>

                </div>
              )
            })
          }

          {educationsFields.length < 5 && <div className="add-more" >
            <Link href="#" onClick={(e) => {
              e.preventDefault();
              addInputField()
            }} className="add-education"><i className="fa fa-plus-circle"></i> Add More</Link>
          </div>}
        </div>
      </div>
    </Fragment>
  )
})
export default Education