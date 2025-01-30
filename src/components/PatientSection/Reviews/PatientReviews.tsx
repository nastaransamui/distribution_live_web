/* eslint-disable @next/next/no-img-element */
import React, { FC, useState, useEffect, Fragment, MouseEvent, ReactNode } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RepliesType, ReviewTypes } from '@/components/DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { AppState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import useScssVar from '@/hooks/useScssVar';
import { toast } from 'react-toastify';
import { useTheme } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from '@/components/shared/CustomNoRowsOverlay';
import { StyledBadge } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import Rating from '@mui/material/Rating';
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl';
import DeleteForever from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton'
import { BootstrapDialog, Transition, BootstrapDialogTitle } from '@/components/shared/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { UserPatientProfileTypeValue } from '@/redux/userPatientProfile';
import { UserDoctorProfileTypeValue } from '@/redux/userDoctorProfile';

export interface PatientReviewsType {
  profile: UserPatientProfileTypeValue | UserDoctorProfileTypeValue
}
const maxLength = 600;
const minLength = 10;
const PatientReviews: FC<PatientReviewsType> = (({ profile }) => {
  const { bounce, muiVar } = useScssVar();
  dayjs.extend(relativeTime);
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [authorReviews, setAuthorReviews] = useState<ReviewTypes[] | []>([])
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const perPage = 10;
  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    watch,
    setError,
    setValue,
    getValues,
    control
  } = useForm<ReviewTypes>({})

  useEffect(() => {
    if (profile) {

      let limit = perPage * page;
      let skip = (page - 1) * perPage
      if (homeSocket?.current) {
        homeSocket.current.emit('getAuthorReviews', { patientId: profile?._id, limit, skip })
        homeSocket.current.once('getAuthorReviewsReturn', (msg: { status: number, authorReviews: ReviewTypes[], totalReviews: number, message?: string }) => {
          if (msg?.status !== 200) {
            toast.error(msg?.message || 'getAuthorReviews error', {
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
          } else if (msg?.status == 200) {
            const { authorReviews, totalReviews } = msg;
            setAuthorReviews((prevState) => {
              prevState = []
              prevState = [...authorReviews];
              return prevState;
            })
            setTotalReviews(totalReviews)
            homeSocket.current.once(`updateGetAuthorReviews`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, profile, reload, page])


  const editClicked = (e: MouseEvent<HTMLAnchorElement>, reviews: ReviewTypes) => {
    e.preventDefault();
    reset();
    setShowEditForm(true);
    Object.entries(reviews as ReviewTypes).forEach(([key, value]) => {
      if (key !== 'doctorProfile' && key !== 'patientProfile') {
        setValue(key as keyof ReviewTypes, value);
      }
    })
  }
  const removeClicked = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setShowEditForm(false);
    reset();
  }
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name == 'body') {
        if (value?.['body']) {
          switch (true) {
            case value[name]?.length == 0:
              setError('body', { type: 'required', message: "This field is requried." })
              break;
            case value?.['body']?.length < minLength:
              setError('body', { type: 'required', message: `Min length is ${minLength} characters.` })
              break;
            case value?.['body']?.length > maxLength:
              setError('body', { type: 'required', message: `Max length is ${maxLength} characters.` })
              break;

            default:
              clearErrors('body')
              break;
          }
        }
      }
    })
    return () => subscription.unsubscribe();

  }, [clearErrors, setError, watch])
  const onEditSubmit = (data: ReviewTypes) => {
    if (data.replies.length !== 0) {
      data.replies.forEach((a: RepliesType) => {
        delete a.doctorProfile;
        delete a.patientProfile
      })
    }
    if (data.rating) {
      data.rating = Number(data.rating);  // Convert to number
    }
    delete data.updatedAt;
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current) {
      homeSocket.current.emit('updateReview', data)
      homeSocket.current.once('updateReviewReturn', (msg: { status: number, message?: string }) => {
        if (msg?.status !== 200) {
          toast.error(msg?.message || 'add Reply error', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else if (msg?.status == 200) {
          dispatch(updateHomeFormSubmit(false))
          setReload(!reload)
          reset();
          setShowEditForm(false);
        }

      })
    }
  }

  const deleteSubmited = () => {
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('deleteReview', { patientId: profile?._id, deleteIds: [deleteId] })
      homeSocket.current.once('deleteReviewReturn', (msg: { status: number, message?: string, }) => {
        const { status, message, } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} delete Review`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          dispatch(updateHomeFormSubmit(false))
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setDeleteId('')
            setShowDelete(false)
          }, 500);
        }
      })
    }
  }

  return (
    <Fragment>
      <div className="card-body pt-0">
        <div className="tab-content pt-0">
          <div >
            {
              isLoading ?
                <div style={{ minHeight: '50vh' }}>
                  <CircleToBlockLoading color={theme.palette.primary.main} size="small"
                    style={{
                      minWidth: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }} />
                </div> :
                <Fragment>
                  {totalReviews !== 0 ?
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>
                        {
                          <Stack spacing={2}>
                            <Pagination
                              showFirstButton
                              showLastButton
                              hideNextButton
                              hidePrevButton
                              boundaryCount={1}
                              variant="outlined"
                              color="secondary"
                              count={Math.ceil(totalReviews / perPage)}
                              page={page}
                              onChange={handlePageChange}
                              sx={{
                                marginLeft: 'auto',
                                marginRight: 'auto'
                              }}
                            />
                            <Typography variant='h5' align='center' sx={{ paddingBottom: 2 }}>Total: {totalReviews} reviews</Typography>
                          </Stack>
                        }
                      </div>
                    </div> :
                    <CustomNoRowsOverlay text="No Reviews yet" />
                  }
                  <div className="doc-review review-listing">
                    <ul className="comments-list">
                      {
                        authorReviews.map((reviews: ReviewTypes, index: number) => {
                          const { createdAt, updatedAt } = reviews;
                          const online = reviews?.role == 'doctors' ? reviews?.doctorProfile?.online : reviews?.patientProfile?.online
                          const profileImage = reviews?.doctorProfile?.profileImage;
                          const authorName = reviews?.doctorProfile?.fullName;
                          const formattedDate =
                            createdAt == updatedAt ?
                              `Reviewed ${dayjs(createdAt).fromNow()}` :
                              `Reviewed Updated ${dayjs(updatedAt).fromNow()}`;
                          return (
                            <li key={`${reviews._id}`}>
                              <div className="comment" >
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  variant="dot"
                                  online={online!}
                                  style={{ width: 58, height: 58 }}
                                >
                                  <Avatar style={{ width: 58, height: 58 }} alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                                    <img src={doctors_profile} alt="" />
                                  </Avatar>
                                </StyledBadge>
                                <div className="comment-body">
                                  <div className="meta-data">
                                    <Link href={`/doctors/profile/${btoa(reviews?.doctorId)}`} target='_blank'>
                                      <span className="comment-author">{`Dr. `}{authorName}</span>
                                    </Link>
                                    <span className="comment-date">{`#${reviews?.id}`}</span>
                                    <span className="comment-date">{formattedDate}</span>
                                    <p className="doc-department">
                                      <img
                                        src={reviews?.doctorProfile?.specialities?.[0]?.image}
                                        className="img-fluid"
                                        alt="Speciality"
                                      />
                                      {reviews?.doctorProfile?.specialities?.[0]?.specialities}
                                    </p>
                                    <div className="review-count rating">
                                      <p>{reviews?.rating}</p>
                                      <Rating
                                        name="read-only"
                                        precision={0.5}
                                        value={reviews?.rating}
                                        readOnly
                                        className='star-span'
                                        size="small"
                                        sx={{
                                          color: 'warning.main',
                                        }}
                                      />
                                      <IconButton
                                        disableFocusRipple
                                        disableRipple
                                        disableTouchRipple
                                        style={{
                                          transform: `translateY(-10px)`
                                        }}
                                        onClick={() => {
                                          setShowDelete(true)
                                          setDeleteId(reviews?._id!)
                                        }}>
                                        <DeleteForever sx={{ color: 'crimson' }} />
                                      </IconButton>
                                    </div>
                                  </div>
                                  {reviews?.recommend ?
                                    <p className="recommended">
                                      <i className="far fa-thumbs-up" /> I recommend the doctor
                                    </p> :
                                    <p className="not-recommended">
                                      <i className="far fa-thumbs-down" /> Not recommend
                                    </p>
                                  }
                                  <p className="comment-content">
                                    Title: {reviews.title}
                                  </p>
                                  <p className="comment-content">
                                    Message: {reviews.body}
                                  </p>
                                  <div className="comment-reply">
                                    {
                                      showEditForm && watch('_id') == reviews?._id ?
                                        <Link className="comment-btn" href="" onClick={(e) => { removeClicked(e) }}>
                                          <i className="fa fa-trash" /> Remove
                                        </Link> :
                                        <Link className="comment-btn" href=""
                                          onClick={(e) => { editClicked(e, reviews) }}>
                                          <i className="fas fa-edit" /> Edit Review
                                        </Link>
                                    }
                                    <p className="recommend-btn">
                                      <span>Recommend?</span>
                                      <Link href="" className={`like-btn ${reviews?.recommend ? 'like-btn-active' : ''}`} style={{ pointerEvents: 'none' }} onClick={(e) => { e.preventDefault() }}>
                                        <i className="far fa-thumbs-up" /> Yes
                                      </Link>
                                      <Link href="" className={`dislike-btn ${reviews?.recommend ? '' : 'dislike-btn-active'}`} style={{ pointerEvents: 'none' }} onClick={(e) => { e.preventDefault() }}>
                                        <i className="far fa-thumbs-down" /> No
                                      </Link>
                                    </p>
                                  </div>
                                  {
                                    showEditForm && watch('_id') == reviews?._id &&
                                    <form noValidate onSubmit={handleSubmit(onEditSubmit)} style={{ marginTop: 20 }}>
                                      <div className='form-group'>
                                        <Controller
                                          rules={{
                                            validate: (value) => value !== 0 || 'This field is required.',
                                            required: 'This field is required.'
                                          }}
                                          name='rating'
                                          control={control}
                                          render={(props: any) => {
                                            const { field } = props;
                                            const { ref, onChange, value } = field;
                                            return (
                                              <FormControl
                                                {...field}
                                                error={errors.rating == undefined ? false : true}
                                                helpertext={errors.rating && errors['rating']['message'] as ReactNode}
                                                fullWidth
                                                required
                                              >
                                                <span id="rating" style={{ color: theme.palette.text.color }}>Rating</span>
                                                <Rating
                                                  ref={ref}
                                                  aria-labelledby='rating'
                                                  name="rating"
                                                  precision={0.5}
                                                  value={parseFloat(value) || 0}  // Ensure the value is a number
                                                  onChange={(_event, newValue) => {
                                                    onChange(newValue === null ? 0 : newValue);
                                                  }}
                                                  className='star-span'
                                                  sx={{
                                                    color: 'warning.main',
                                                  }}
                                                />
                                                {errors?.rating && <FormHelperText>{errors['rating']['message']}</FormHelperText>}
                                              </FormControl>
                                            )
                                          }} />
                                      </div>
                                      <Controller
                                        rules={{
                                          validate: (value) => {
                                            return value !== null ? true : 'This field is required.'; // Only show error if value is null
                                          }
                                        }}
                                        name='recommend'
                                        control={control}
                                        render={(props: any) => {
                                          const { field, } = props;
                                          return (
                                            <FormControl
                                              {...field}
                                              error={!!errors.recommend}
                                              fullWidth
                                              required
                                              sx={{ display: 'flex', minHeight: 80 }}
                                            >
                                              <span className="recommend-btn" style={{ marginBottom: '10px' }}>
                                                <span style={{ color: theme.palette.text.color }}>Recommend : </span>
                                                <Link
                                                  href="#"
                                                  className={`like-btn ${watch('recommend') === true ? 'like-btn-active' : ''}`}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    setValue('recommend', true, { shouldValidate: true });
                                                  }}
                                                >
                                                  <i className="far fa-thumbs-up" /> Yes
                                                </Link>
                                                <Link
                                                  href="#"
                                                  className={`dislike-btn ${watch('recommend') === false ? 'dislike-btn-active' : ''}`}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    setValue('recommend', false, { shouldValidate: true });
                                                  }}
                                                >
                                                  <i className="far fa-thumbs-down" /> No
                                                </Link>
                                                {errors.recommend && <FormHelperText>{errors.recommend.message}</FormHelperText>}

                                              </span>
                                            </FormControl>
                                          )
                                        }}
                                      />
                                      <div className="form-group">
                                        <TextField
                                          required
                                          label="Title of your reply"
                                          size="small"
                                          autoComplete='off'
                                          fullWidth
                                          error={errors?.['title'] == undefined ? false : true}
                                          helperText={errors?.['title'] && errors?.['title']?.['message'] as ReactNode}
                                          placeholder="If you could say it in one sentence, what would you say?"
                                          {
                                          ...register(`title`, {
                                            required: "This field is required",
                                          })
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <TextField
                                          required
                                          label="Your review"
                                          size="small"
                                          autoComplete='off'
                                          fullWidth
                                          multiline
                                          maxRows={3}
                                          minRows={8}
                                          onKeyDown={(e) => {
                                            if (watch('body').length > maxLength) {
                                              if (e.key !== 'Backspace') {
                                                e.preventDefault()
                                              }
                                            }
                                          }}
                                          error={errors.body == undefined ? false : true}
                                          helperText={errors.body && errors['body']['message'] as ReactNode}
                                          placeholder="Review"
                                          {
                                          ...register('body', {
                                            required: "This field is required",
                                            maxLength: maxLength,
                                            minLength: minLength
                                          })
                                          }
                                          InputProps={{
                                            sx: {
                                              '& textarea': {
                                                resize: 'both', // Enables resizing
                                                overflow: 'auto', // Ensures scrollbars appear when needed
                                              },
                                            },
                                          }}
                                        />
                                        {errors.body && errors.body.type === "minLength" && (
                                          <FormHelperText error={true}>Min length is {minLength} characters.</FormHelperText>
                                        )}
                                        {errors.body && errors.body.type === "maxLength" && (
                                          <FormHelperText error={true}>Max length is {maxLength} characters.</FormHelperText>
                                        )}
                                        <div className="d-flex justify-content-between mt-3">
                                          <small className="text-muted">
                                            <span id="chars">{watch('body') ?
                                              (maxLength - watch('body').length) >= 0 ? (maxLength - watch('body').length) + ' characters remaining' : '' :
                                              maxLength + ' characters remaining'
                                            }</span>
                                          </small>
                                        </div>
                                      </div>
                                      <hr />
                                      <div className="submit-section">
                                        <button type="submit" className="btn btn-primary submit-btn">
                                          Edit review
                                        </button>
                                      </div>
                                    </form>
                                  }
                                </div>
                              </div>
                              {reviews?.replies.length !== 0 &&
                                <ul className="comments-reply">
                                  {
                                    reviews?.replies.map((replies: RepliesType, index: number) => {
                                      const { createdAt: repliesCreatedAt } = replies;
                                      const repliesOnline = replies?.role == 'doctors' ? replies?.doctorProfile?.online : replies?.patientProfile?.online
                                      const repliesProfileImage = replies?.role == 'doctors' ? replies?.doctorProfile?.profileImage : replies?.patientProfile?.profileImage;
                                      const repliesAuthorName = replies?.role == 'doctors' ? replies?.doctorProfile?.fullName : replies?.patientProfile?.fullName;
                                      const repliesFormattedDate = `Reviewed ${dayjs(repliesCreatedAt).fromNow()}`;
                                      return (
                                        <li key={`${replies._id} ${index} ${reviews._id}`}>
                                          <div className="comment">
                                            <StyledBadge
                                              overlap="circular"
                                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                              variant="dot"
                                              online={repliesOnline!}
                                              style={{ width: 58, height: 58 }}
                                            >
                                              <Avatar style={{ width: 58, height: 58 }} alt="" src={`${repliesProfileImage}?random=${new Date().getTime()}`} >
                                                <img src={replies?.role == 'doctors' ? doctors_profile : patient_profile} alt="" />
                                              </Avatar>
                                            </StyledBadge>
                                            <div className="comment-body">
                                              <div className="meta-data">
                                                <span style={{ display: 'flex', alignItems: "center" }}>
                                                  <span className="comment-author">
                                                    {repliesAuthorName}
                                                  </span>
                                                  {
                                                    replies?.authorId == reviews?.doctorId &&
                                                    <p style={{ fontSize: '12px', marginBottom: 0, marginLeft: "5px", color: theme?.palette.text.disabled }}>(Main Doctor)</p>
                                                  }
                                                </span>

                                                <span className="comment-date">{`#${replies?.id}`}</span>
                                                <span className="comment-date">
                                                  {repliesFormattedDate}
                                                </span>
                                              </div>
                                              <p className="comment-content">
                                                Title: {replies.title}
                                              </p>
                                              <p className="comment-content">
                                                Message: {replies.body}
                                              </p>
                                            </div>
                                          </div>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              }
                            </li>
                          )
                        })
                      }
                    </ul>
                    {totalReviews !== 0 && <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>
                        {
                          <Stack spacing={2}>

                            <Typography variant='h5' align='center' sx={{ paddingTop: 2 }}>Total: {totalReviews} reviews</Typography>
                            <Pagination
                              showFirstButton
                              showLastButton
                              hideNextButton
                              hidePrevButton
                              boundaryCount={1}
                              variant="outlined"
                              color="secondary"
                              count={Math.ceil(totalReviews / perPage)}
                              page={page}
                              onChange={handlePageChange}
                              sx={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            />
                          </Stack>
                        }
                      </div>
                    </div>}
                  </div>
                </Fragment>
            }
          </div>
        </div>
      </div>
      {showDelete && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setDeleteId('')
            setShowDelete(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={showDelete}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            setTimeout(() => {
              setDeleteId('')
              setShowDelete(false)
            }, 500);
          }}>
          <Stack>
            <span>Delete Review</span>
          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>

          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
          <span style={{ display: 'flex', justifyContent: 'center', ...muiVar }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              deleteSubmited()
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                setTimeout(() => {
                  setShowDelete(false)
                }, 500);
              }}>Cancell</button>
          </span>

        </DialogContent>
      </BootstrapDialog>}
    </Fragment>
  );
});

export default PatientReviews;
