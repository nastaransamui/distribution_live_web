/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import Lightbox from "yet-another-react-lightbox";
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import {
  PatientImg,
  PatientImg6,
  PatientImg7,
} from '@/public/assets/imagepath';

import Rating from '@mui/material/Rating';

//@mui
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider';
import { useTheme } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { AwardType, DoctorProfileType, EducationType, ExperienceType, MembershipsType, RegistrationsType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs';
import preciseDiff from 'dayjs-precise-range'
import { useForm, Controller } from 'react-hook-form';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { AvailableType, TimeType, afterNoonFinish, afterNoonStart, eveningFinish, eveningStart, morningFinish, morningStart } from '@/components/DoctorDashboardSections/ScheduleTiming';

export interface ReviewTypes {
  userId: string;
  doctorId: string;
  rating: null | number;
  title: string;
  review: string;
  terms?: boolean;
  reply: string[]
}

const initValue: ReviewTypes = {
  userId: '',
  doctorId: '',
  rating: null as null | number,
  title: '',
  review: '',
  terms: false,
  reply: []
}

const maxLength = 250;
const minLength = 10;

const PageTabs: FC<{ profile: DoctorProfileType }> = (({ profile }) => {

  dayjs.extend(preciseDiff)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)

  const { muiVar } = useScssVar();
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [loginDialog, setLoginDialog] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    control,
    watch,
    getValues,
    setError,
    setValue: setFormValue
  } = useForm({
    defaultValues: {
      ...initValue,
      doctorId: profile?._id,
      userId: userProfile?._id || ''
    }
  })

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name == 'review') {
        if (value?.['review']) {
          switch (true) {
            case value[name]?.length == 0:
              setError('review', { type: 'required', message: "This field is requried." })
              break;
            case value?.['review']?.length < minLength:
              setError('review', { type: 'required', message: `Min length is ${minLength} characters.` })
              break;
            case value?.['review']?.length > maxLength:
              setError('review', { type: 'required', message: `Max length is ${maxLength} characters.` })
              break;

            default:
              clearErrors('review')
              break;
          }
        }
      }
    })
    return () => subscription.unsubscribe();

  }, [clearErrors, setError, watch])

  const onSubmitReview = (data: ReviewTypes) => {
    data.rating = parseFloat(data!.rating as any)
    delete data.terms;
    console.log(data)
  }

  return (
    <Fragment>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={profile?.clinicImages}
        index={index}
      />
      <Dialog
        open={termsDialog}
        onClose={() => setTermsDialog(false)}
        scroll='paper'
        aria-labelledby="terms"
        aria-describedby="terms&condition"
      >
        <DialogTitle id="terms">Terms &amp; Conditions</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="terms&condition"
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFormValue('terms', false)
            setError('terms', { type: 'required', message: `Please accept terms and condition first.` })
            setTermsDialog(false)
          }}>Cancel</Button>
          <Button onClick={() => {
            setFormValue('terms', true)
            clearErrors('terms')
            setTermsDialog(false)
          }
          }>Accept</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={loginDialog}
        onClose={() => setLoginDialog(false)}
        scroll='body'
        aria-labelledby="login"
        aria-describedby="login"
      >
        <DialogTitle id="login">Login</DialogTitle>
        <DialogContent dividers>
          <div style={muiVar}>
            <div className="col-md-12">
              <div className="account-content">
                <div className="col-md-12 col-lg-12 login-right">
                  <LoginBox />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
      <div className="card" style={muiVar}>
        <div className="card-body pt-0">
          {/* Tab Menu */}
          <nav className="user-tabs mb-4">
            <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="#doc_overview"
                  data-bs-toggle="tab"
                >
                  Overview
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#doc_locations" data-bs-toggle="tab">
                  Availablity
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#doc_reviews" data-bs-toggle="tab">
                  Reviews
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="#doc_business_hours"
                  data-bs-toggle="tab"
                >
                  Business Hours
                </Link>
              </li>
            </ul>
          </nav>
          <div className="tab-content pt-0">
            <div
              role="tabpanel"
              id="doc_overview"
              className="tab-pane fade show active"
            >
              <div className="row">
                <div className="col-md-12 col-lg-9">
                  {/* About Details */}
                  <div className="widget about-widget">
                    <h4 className="widget-title">About Me</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {profile?.aboutMe}
                    </p>
                  </div>
                  {/* /About Details */}
                  {/* Education Details */}
                  <div className="widget education-widget">
                    <h4 className="widget-title">Education</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        {
                          profile.educations.map((ed: EducationType, i) => {
                            return (
                              <li key={i}>
                                <div className="experience-user">
                                  <div className="before-circle" />
                                </div>
                                <div className="experience-content">
                                  <div className="timeline-content">
                                    <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                      {ed?.collage}
                                    </Link>
                                    <div>{ed.degree}</div>
                                    <span className="time">{dayjs(ed.yearOfCompletion).format('DD MMM YYYY')}</span>
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>
                  {/* /Education Details */}
                  {/* Experience Details */}
                  <div className="widget experience-widget">
                    <h4 className="widget-title">Work &amp; Experience</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        {
                          profile.experinces.map((ex: ExperienceType, i: number) => {
                            //@ts-ignore
                            let { years, months, days } = dayjs.preciseDiff(ex.from, ex.to, true)
                            return (
                              <li key={i}>
                                <div className="experience-user">
                                  <div className="before-circle" />
                                </div>
                                <div className="experience-content">
                                  <div className="timeline-content">
                                    <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                      {ex.hospitalName} ({ex.designation})
                                    </Link>
                                    <span className="time">{dayjs(ex.from).format('DD MMM YYYY')} - {dayjs(ex.to).format('DD MMM YYYY')}
                                      ({`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`})
                                    </span>
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="widget awards-widget">
                    <h4 className="widget-title">Awards</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        {
                          profile?.awards.map((awr: AwardType, i: number) => {
                            return (
                              <li key={i}>
                                <div className="experience-user">
                                  <div className="before-circle" />
                                </div>
                                <div className="experience-content">
                                  <div className="timeline-content">
                                    <p className="exp-year">{dayjs(awr.year).format('MMM YYYY')}</p>
                                    <h4 className="exp-title">{awr.award}</h4>
                                    <p>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing
                                      elit. Proin a ipsum tellus. Interdum et malesuada
                                      fames ac ante ipsum primis in faucibus.
                                    </p>
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>

                  <div className="widget awards-widget">
                    <h4 className="widget-title">Registrations</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        {
                          profile?.registrations.map((register: RegistrationsType, i: number) => {
                            return (
                              <li key={i}>
                                <div className="experience-user">
                                  <div className="before-circle" />
                                </div>
                                <div className="experience-content">
                                  <div className="timeline-content">
                                    <p className="exp-year">{dayjs(register.year).format('MMM YYYY')}</p>
                                    <h4 className="exp-title">{register.registration}</h4>
                                    <p>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing
                                      elit. Proin a ipsum tellus. Interdum et malesuada
                                      fames ac ante ipsum primis in faucibus.
                                    </p>
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>


                  <div className="widget experience-widget">
                    <h4 className="widget-title">Memberships</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        {
                          profile.memberships.map((member: MembershipsType, i: number) => {

                            return (
                              <li key={i}>
                                <div className="experience-user">
                                  <div className="before-circle" />
                                </div>
                                <div className="experience-content">
                                  <div className="timeline-content">
                                    <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                      {member.membership}
                                    </Link>
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>

                  <div className="service-list">
                    <h4>Services</h4>
                    <ul className="clearfix">
                      {
                        profile.specialitiesServices.map((s: string, i: number) => {
                          return (
                            <li key={i}>{s}</li>
                          )
                        })
                      }
                    </ul>
                  </div>
                  {/* <div className="service-list">
                    <h4>Specializations</h4>
                    <ul className="clearfix">
                      <li>Children Care</li>
                      <li>Dental Care</li>
                      <li>Oral and Maxillofacial Surgery </li>
                      <li>Orthodontist</li>
                      <li>Periodontist</li>
                      <li>Prosthodontics</li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>
            <div role="tabpanel" id="doc_locations" className="tab-pane fade">
              <div className="location-list">
                <div className="row">
                  <div className="col-md-6">
                    <div className="clinic-content">
                      <h4 className="clinic-name">
                        <Link href="" onClick={(e) => e.preventDefault()}>
                          {profile.clinicName}
                        </Link>
                      </h4>
                      <p className="doc-speciality">
                        {profile?.specialities?.[0]?.description}
                      </p>
                      <Rating name="read-only" value={4} readOnly size='small' />
                      <span className="d-inline-block average-rating">(4)</span>
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
                  {/* /Clinic Content */}
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
                                    '& .MuiFormControlLabel-label': {
                                      color: `${theme.palette.text.color} !important`
                                    }
                                  }} control={<Checkbox defaultChecked />} disabled label="Morning" />
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
                                    '& .MuiFormControlLabel-label': {
                                      color: `${theme.palette.text.color} !important`
                                    }
                                  }} control={<Checkbox defaultChecked />} disabled label="Afternoon" />
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
                                    '& .MuiFormControlLabel-label': {
                                      color: `${theme.palette.text.color} !important`
                                    }
                                  }} control={<Checkbox defaultChecked />} disabled label="Evening" />
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
                    <div className="col-md-2">
                      <div className="consult-price">$250</div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div role="tabpanel" id="doc_reviews" className="tab-pane fade">
              <div className="widget review-listing">
                <ul className="comments-list">
                  <li>
                    <div className="comment">
                      <img
                        className="avatar avatar-sm rounded-circle"
                        alt="User Image"
                        src={PatientImg}
                      />
                      <div className="comment-body">
                        <div className="meta-data">
                          <span className="comment-author">Richard Wilson</span>
                          <span className="comment-date">Reviewed 2 Days ago</span>
                          <div className="review-count rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <p className="recommended">
                          <i className="far fa-thumbs-up" /> I recommend the doctor
                        </p>
                        <p className="comment-content">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore magna
                          aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                          Curabitur non nulla sit amet nisl tempus
                        </p>
                        <div className="comment-reply">
                          <Link className="comment-btn" href="" onClick={(e) => { e.preventDefault() }}>
                            <i className="fas fa-reply" /> Reply
                          </Link>
                          <p className="recommend-btn">
                            <span>Recommend?</span>
                            <Link href="" className="like-btn" onClick={(e) => { e.preventDefault() }}>
                              <i className="far fa-thumbs-up" /> Yes
                            </Link>
                            <Link href="" className="dislike-btn" onClick={(e) => { e.preventDefault() }}>
                              <i className="far fa-thumbs-down" /> No
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                    <ul className="comments-reply">
                      <li>
                        <div className="comment">
                          <img
                            className="avatar avatar-sm rounded-circle"
                            alt="User Image"
                            src={PatientImg6}
                          />
                          <div className="comment-body">
                            <div className="meta-data">
                              <span className="comment-author">Charlene Reed</span>
                              <span className="comment-date">
                                Reviewed 3 Days ago
                              </span>
                              <div className="review-count rating">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star" />
                              </div>
                            </div>
                            <p className="comment-content">
                              Lorem ipsum dolor sit amet, consectetur adipisicing
                              elit, sed do eiusmod tempor incididunt ut labore et
                              dolore magna aliqua. Ut enim ad minim veniam. Curabitur
                              non nulla sit amet nisl tempus
                            </p>
                            <div className="comment-reply">
                              <Link className="comment-btn" href="#">
                                <i className="fas fa-reply" /> Reply
                              </Link>
                              <p className="recommend-btn">
                                <span>Recommend?</span>
                                <Link href="#" className="like-btn">
                                  <i className="far fa-thumbs-up" /> Yes
                                </Link>
                                <Link href="#" className="dislike-btn">
                                  <i className="far fa-thumbs-down" /> No
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="comment">
                      <img
                        className="avatar avatar-sm rounded-circle"
                        alt="User Image"
                        src={PatientImg7}
                      />
                      <div className="comment-body">
                        <div className="meta-data">
                          <span className="comment-author">Travis Trimble</span>
                          <span className="comment-date">Reviewed 4 Days ago</span>
                          <div className="review-count rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <p className="comment-content">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore magna
                          aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                          Curabitur non nulla sit amet nisl tempus
                        </p>
                        <div className="comment-reply">
                          <Link className="comment-btn" href="#">
                            <i className="fas fa-reply" /> Reply
                          </Link>
                          <p className="recommend-btn">
                            <span>Recommend?</span>
                            <Link href="#" className="like-btn">
                              <i className="far fa-thumbs-up" /> Yes
                            </Link>
                            <Link href="#" className="dislike-btn">
                              <i className="far fa-thumbs-down" /> No
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="all-feedback text-center">
                  <Link href="#" className="btn btn-primary btn-sm">
                    Show all feedback <strong>(167)</strong>
                  </Link>
                </div>
              </div>
              <div className="write-review">
                <h4>
                  Write a review for <strong>Dr. {profile?.firstName} {' '} {profile?.lastName}</strong>
                </h4>
                <form noValidate onSubmit={handleSubmit(onSubmitReview)}>
                  <div className='form-group'>
                    <Controller
                      rules={{ required: 'This field is required.' }}
                      name='rating'
                      control={control}
                      render={(props: any) => {
                        const { field, fieldState, formState } = props;
                        const { ref, onChange, value } = field;
                        return (
                          <FormControl
                            {...field}
                            error={errors.rating == undefined ? false : true}
                            helpertext={errors.rating && errors['rating']['message'] as ReactNode}
                            fullWidth
                            required
                          >
                            <FormLabel id="rating">Review</FormLabel>
                            <Rating
                              ref={ref}
                              name="rating"
                              precision={0.5}
                              disabled={!userProfile || profile?._id === userProfile?._id}
                              value={parseFloat(value)}
                              // value={getValues('rating')}
                              onChange={(event, newValue) => {
                                onChange(newValue == null ? 0 : newValue)
                              }}
                              icon={<StarRoundedIcon fontSize="inherit" />}
                              emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}

                            />
                            {errors?.rating && <FormHelperText>{errors['rating']['message']}</FormHelperText>}
                          </FormControl>
                        )
                      }} />
                  </div>
                  <div className="form-group">
                    <TextField
                      required
                      disabled={!userProfile || profile?._id === userProfile?._id}
                      label="Title of your review"

                      size="small"
                      autoComplete='off'
                      fullWidth
                      error={errors.title == undefined ? false : true}
                      helperText={errors.title && errors['title']['message'] as ReactNode}
                      placeholder="If you could say it in one sentence, what would you say?"
                      {
                      ...register('title', {
                        required: "This field is required",
                      })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      required
                      disabled={!userProfile || profile?._id === userProfile?._id}
                      label="Your review"
                      size="small"
                      autoComplete='off'
                      fullWidth
                      multiline
                      maxRows={3}
                      minRows={3}
                      onKeyDown={(e) => {
                        if (watch('review').length > maxLength) {
                          if (e.key !== 'Backspace') {
                            e.preventDefault()
                          }
                        }
                      }}
                      error={errors.review == undefined ? false : true}
                      helperText={errors.review && errors['review']['message'] as ReactNode}
                      placeholder="If you could say it in one sentence, what would you say?"
                      {
                      ...register('review', {
                        required: "This field is required",
                        maxLength: maxLength,
                        minLength: minLength
                      })
                      }
                    />
                    {errors.review && errors.review.type === "minLength" && (
                      <FormHelperText error={true}>Min length is {minLength} characters.</FormHelperText>
                    )}
                    {errors.review && errors.review.type === "maxLength" && (
                      <FormHelperText error={true}>Max length is {maxLength} characters.</FormHelperText>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <small className="text-muted">
                        <span id="chars">{watch('review') ?
                          (maxLength - watch('review').length) >= 0 ? (maxLength - watch('review').length) + ' characters remaining' : '' :
                          maxLength + ' characters remaining'
                        }</span>
                      </small>
                    </div>
                  </div>
                  <hr />
                  <div className="form-group">
                    <div className="terms-accept">
                      <div className="custom-checkbox">
                        <FormControlLabel
                          checked={getValues('terms')}
                          {
                          ...register('terms', { required: 'Please accept terms and condition first.' })
                          }

                          required control={<Checkbox disabled={!userProfile || profile?._id === userProfile?._id} />} label="I have read and accept" />
                        <Link href=""
                          style={{ pointerEvents: !userProfile || profile?._id === userProfile?._id ? 'none' : 'auto' }}
                          aria-disabled={!userProfile || profile?._id === userProfile?._id}
                          tabIndex={!userProfile || profile?._id === userProfile?._id ? -1 : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            setTermsDialog(true)
                          }}>Terms &amp; Conditions</Link>
                        {errors.terms && errors.terms && (
                          <FormHelperText error={true}>Please accept terms and condition first.</FormHelperText>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button type="submit" className="btn btn-primary submit-btn" disabled={profile?._id === userProfile?._id} onClick={(e) => {
                      if (!userProfile || profile?._id === userProfile?._id) {
                        e.preventDefault()
                        setLoginDialog(true)
                        // router.push('/login')
                      }
                    }}>
                      {!userProfile ? `Login to add review` : profile?._id === userProfile?._id ? `You can't add review to your own account.` : `Add Review`}
                    </button>
                  </div>
                </form>
                {/* /Write Review Form */}
              </div>
            </div>
            <div role="tabpanel" id="doc_business_hours" className="tab-pane fade">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  {/* Business Hours Widget */}
                  <div className="widget business-widget">
                    <div className="widget-content">
                      <div className="listing-hours">
                        <div className="listing-day current">
                          <div className="day">
                            Today <span>{dayjs().format('DD MMM YYYY')}</span>
                          </div>
                          <div className="time-items">
                            <span className="open-status">
                              {profile?.timeslots?.[0]?.isTodayAvailable ?
                                <span className="badge bg-success-light">Open</span> :
                                <span className="badge bg-danger-light">Closed</span>}
                            </span>
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day current">
                          <div className="day">
                            Tommorow <span>{dayjs().add(1, 'day').format('DD MMM YYYY')}</span>
                          </div>
                          <div className="time-items">
                            <span className="open-status">
                              {profile?.timeslots?.[0]?.isTommorowAvailable ?
                                <span className="badge bg-success-light">Open </span> :
                                <span className="badge bg-danger-light">Closed</span>}
                            </span>
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        {/* <div className="listing-day">
                          <div className="day">Tuesday</div>
                          <div className="time-items">
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day">
                          <div className="day">Wednesday</div>
                          <div className="time-items">
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day">
                          <div className="day">Thursday</div>
                          <div className="time-items">
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day">
                          <div className="day">Friday</div>
                          <div className="time-items">
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day">
                          <div className="day">Saturday</div>
                          <div className="time-items">
                            <span className="time">07:00 AM - 09:00 PM</span>
                          </div>
                        </div>
                        <div className="listing-day closed">
                          <div className="day">Sunday</div>
                          <div className="time-items">
                            <span className="time">
                              <span className="badge bg-danger-light">Closed</span>
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {/* /Business Hours Widget */}
                </div>
              </div>
            </div>
            {/* /Business Hours Content */}
          </div>
        </div>
      </div >
    </Fragment >
  )
});

export default PageTabs;