/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, MouseEvent, ReactNode, useEffect, useState } from 'react'

import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import {
  doctors_profile,
  patient_profile,
} from '@/public/assets/imagepath';

import Rating from '@mui/material/Rating';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
//@mui
import TextField from '@mui/material/TextField'
import { useTheme } from "@mui/material/styles";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useForm, Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { StyledBadge } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { loadStylesheet } from '@/pages/_app';
import { Transition } from '@/components/shared/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CustomNoRowsOverlay from '@/components/shared/CustomNoRowsOverlay';
import { PatientProfile } from '@/components/DoctorDashboardSections/MyPtients';
import { Terms } from '@/components/TermsSections/TermsDetails';
import { DataGridMongoDBQuery } from '@/shared/CustomToolbar';

export interface RepliesType {
  _id?: string;
  id?: number;
  authorId: string;
  role: "doctors" | "patient" | "pharmacist";
  title: string;
  body: string;
  parentId: string;
  replies: RepliesType[];
  createdAt?: Date;
  updatedAt?: Date;
  doctorProfile?: DoctorProfileType;
  patientProfile?: PatientProfile
}
export interface ReviewTypes {
  _id?: string;
  id: number;
  doctorId: string;
  authorId: string;
  role: "doctors" | "patient" | "pharmacist";
  title: string;
  body: string;
  rating: number;
  recommend: boolean | null;
  replies: RepliesType[];
  createdAt?: Date;
  updatedAt?: Date;
  terms?: boolean;
  doctorProfile?: DoctorProfileType;
  patientProfile?: PatientProfile
}

const initValue: ReviewTypes = {
  id: 0,
  doctorId: '',
  authorId: '',
  role: 'patient',
  title: '',
  body: '',
  rating: 0,
  recommend: null,
  replies: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  terms: false,
}

const maxLength = 600;
const minLength = 10;
export interface DoctorPublicProfileReviewsType {
  profile: DoctorProfileType
}

export const DoctorPublicProfileReviewsTap: FC<DoctorPublicProfileReviewsType> = (({ profile }) => {


  // Extend dayjs with the relativeTime plugin
  dayjs.extend(relativeTime);
  useEffect(() => {
    loadStylesheet('/css/yet-another-react-lightbox-styles.css')
  }, [])
  const { bounce, muiVar } = useScssVar();
  const theme = useTheme();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [doctorReviews, setDoctorReviews] = useState<ReviewTypes[] | []>([])
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false)
  const perPage = 10;
  const [page, setPage] = useState(1);
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({
    pageSize: perPage,
    page: 0,
  });

  const [sortModel, setSortModel] = useState<any>([
    {
      field: 'updatedAt',
      sort: 'desc',
    },
  ]);
  const [mongoFilterModel, setMongoFilterModel] = useState<DataGridMongoDBQuery>({});
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
      doctorId: profile?._id
    }
  })

  const {
    register: replyRegister,
    handleSubmit: replyHandleSubmit,
    clearErrors: replyClearErrors,
    formState: { errors: replyErrors },
    reset: replyReset,
    watch: replyWatch,
    setError: replySetError,
    setValue: replySetValue,
    getValues: replyGetValue
  } = useForm<RepliesType>({})


  const onSubmitReview = (data: ReviewTypes) => {
    data.authorId = userProfile?._id!;
    data.role = userProfile?.roleName!;
    if (data.rating) {
      data.rating = Number(data.rating);  // Convert to number
    }
    delete data.terms;
    delete data.createdAt;
    delete data.updatedAt;
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current) {
      homeSocket.current.emit('updateReview', data)
      homeSocket.current.once('updateReviewReturn', (msg: { status: number, message?: string }) => {
        if (msg?.status !== 200) {
          toast.error(msg?.message || 'add Review error', {
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
        }

      })
    }
  }

  const onReplySubmit = (data: RepliesType) => {
    if (data.replies.length !== 0) {
      data.replies.forEach((a: RepliesType) => {
        delete a.doctorProfile;
        delete a.patientProfile
      })
    }

    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current) {
      homeSocket.current.emit('updateReply', data)
      homeSocket.current.once('updateReplyReturn', (msg: { status: number, message?: string }) => {
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
          replyReset();
          setShowReplyForm(false);
        }

      })
    }
  }
  const handlePageChange = (
    _event: any | null,
    newPage: number) => {
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: newPage - 1
      }
    })
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

  useEffect(() => {
    const subscription = replyWatch((value, { name }) => {

      if (name == 'body') {
        if (value?.['body']) {
          switch (true) {
            case value[name]?.length == 0:
              replySetError('body', { type: 'required', message: "This field is requried." })
              break;
            case value?.['body']?.length < minLength:
              replySetError('body', { type: 'required', message: `Min length is ${minLength} characters.` })
              break;
            case value?.['body']?.length > maxLength:
              replySetError('body', { type: 'required', message: `Max length is ${maxLength} characters.` })
              break;

            default:
              replyClearErrors('body')
              break;
          }
        }
      }
    })
    return () => subscription.unsubscribe();

  }, [replyClearErrors, replySetError, replyWatch])



  useEffect(() => {
    if (profile) {

      if (homeSocket?.current) {
        homeSocket.current.emit('getDoctorReviews', { doctorId: profile?._id, paginationModel, sortModel, mongoFilterModel })
        homeSocket.current.once('getDoctorReviewsReturn', (msg: { status: number, doctorReviews: ReviewTypes[], totalReviews: number, message?: string, reason?: string }) => {
          if (msg?.status !== 200) {
            toast.error(msg?.message || msg?.reason || 'getDoctorReviews error', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: 'review_error',
              onClose: () => {
                toast.dismiss('review_error')
              }
            });
          } else if (msg?.status == 200) {
            const { doctorReviews, totalReviews } = msg;
            setDoctorReviews((prevState) => {
              prevState = []
              prevState = [...doctorReviews];
              return prevState;
            })
            setTotalReviews(totalReviews)
            homeSocket.current.once(`updateGetDoctorReviews`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, profile, reload, page, mongoFilterModel, paginationModel, sortModel])

  const removeClicked = (e: MouseEvent) => {
    e.preventDefault()
    setShowReplyForm(false);
    replyReset();

  }
  const replyClicked = (e: MouseEvent, reviews: ReviewTypes) => {

    e.preventDefault()
    setShowReplyForm(true);
    replyReset();
    replySetValue('authorId', userProfile?._id!);
    replySetValue('parentId', reviews?._id!);
    replySetValue('role', userProfile?.roleName!);
    replySetValue('title', '');
    replySetValue('body', '');
    replySetValue('replies', reviews.replies);

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
                              page={paginationModel.page + 1}
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
                    </div> : <div style={{ minHeight: 500, display: 'flex', justifyContent: 'center', alignItems: "center" }}><CustomNoRowsOverlay text="No Reviews yet" /></div>}
                  <div className="doc-review review-listing">

                    <ul className="comments-list">
                      {
                        doctorReviews.map((reviews: ReviewTypes, index: number) => {
                          const { createdAt, updatedAt } = reviews;
                          const online = reviews?.role == 'doctors' ? reviews?.doctorProfile?.online : reviews?.patientProfile?.online
                          const idle = reviews?.role == 'doctors' ? reviews?.patientProfile?.idle : reviews?.doctorProfile?.idle
                          const profileImage = reviews?.role == 'doctors' ? reviews?.doctorProfile?.profileImage : reviews?.patientProfile?.profileImage;
                          const authorName = reviews?.role == 'doctors' ? reviews?.doctorProfile?.fullName : reviews?.patientProfile?.fullName;
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
                                  idle={idle}
                                  style={{ width: 58, height: 58 }}
                                >
                                  <Avatar style={{ width: 58, height: 58 }} alt="" src={`${profileImage}`} >
                                    <img src={reviews?.role == 'doctors' ? doctors_profile : patient_profile} alt="" />
                                  </Avatar>
                                </StyledBadge>

                                <div className="comment-body">
                                  <div className="meta-data">
                                    <span className="comment-author">{reviews?.role == 'doctors' ? 'Dr.' : `${reviews?.patientProfile?.gender !== "" && `${reviews?.patientProfile?.gender}. `}`}{authorName}</span>

                                    <span className="comment-date">{`#${reviews?.id}`}</span>
                                    <span className="comment-date">{formattedDate}</span>
                                    <div className="review-count rating">
                                      {reviews?.rating}
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
                                      showReplyForm && replyWatch(`parentId`) == reviews?._id ?
                                        <>
                                          <Link className="comment-btn" href="" onClick={(e) => { removeClicked(e) }}>
                                            <i className="fa fa-trash" /> Remove
                                          </Link>
                                        </> :
                                        <>
                                          {
                                            !userProfile ?
                                              <>
                                                Login in to reply
                                              </> :
                                              <>
                                                {
                                                  reviews?.authorId !== userProfile?._id &&
                                                  reviews?.replies.length < 5 &&
                                                  <Link className="comment-btn" href="" onClick={(e) => { replyClicked(e, reviews) }}>
                                                    <i className="fas fa-reply" /> Reply
                                                  </Link>
                                                }
                                              </>
                                          }
                                        </>
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
                                    showReplyForm && replyWatch(`parentId`) == reviews?._id &&
                                    <form noValidate onSubmit={replyHandleSubmit(onReplySubmit)} style={{ marginTop: 20 }}>

                                      <Fragment key={index}>
                                        <div className="form-group">
                                          <TextField
                                            required
                                            label="Title of your reply"
                                            size="small"
                                            autoComplete='off'
                                            fullWidth
                                            error={replyErrors?.['title'] == undefined ? false : true}
                                            helperText={replyErrors?.['title'] && replyErrors?.['title']?.['message'] as ReactNode}
                                            placeholder="If you could say it in one sentence, what would you say?"
                                            {
                                            ...replyRegister(`title`, {
                                              required: "This field is required",
                                            })
                                            }
                                          />
                                        </div>
                                        <div className="form-group">
                                          <TextField
                                            required
                                            disabled={userProfile?._id == reviews?.doctorId ? false : (!userProfile || profile?._id === userProfile?._id)}
                                            label="Your reply"
                                            size="small"
                                            autoComplete='off'
                                            fullWidth
                                            multiline
                                            maxRows={3}
                                            minRows={8}
                                            onKeyDown={(e) => {
                                              if (replyWatch('body').length > maxLength) {
                                                if (e.key !== 'Backspace') {
                                                  e.preventDefault()
                                                }
                                              }
                                            }}
                                            error={replyErrors?.['body'] == undefined ? false : true}
                                            helperText={replyErrors?.['body'] && replyErrors?.['body']?.['message'] as ReactNode}
                                            placeholder="Reply"
                                            {
                                            ...replyRegister(`body`, {
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
                                          {replyErrors?.['body'] && replyErrors?.['body']?.type === "minLength" && (
                                            <FormHelperText error={true}>Min length is {minLength} characters.</FormHelperText>
                                          )}
                                          {replyErrors?.['body'] && replyErrors?.['body']?.type === "maxLength" && (
                                            <FormHelperText error={true}>Max length is {maxLength} characters.</FormHelperText>
                                          )}
                                          <div className="d-flex justify-content-between mt-3">
                                            <small className="text-muted">
                                              <span id="chars">{replyWatch(`body`) ?
                                                (maxLength - replyWatch(`body`).length) >= 0 ? (maxLength - watch(`body`).length) + ' characters remaining' : '' :
                                                maxLength + ' characters remaining'
                                              }</span>
                                            </small>
                                          </div>
                                        </div>
                                        <hr />
                                        <div className="submit-section">
                                          <button type="submit" className="btn btn-primary submit-btn"
                                            disabled={userProfile?._id == reviews?.doctorId ? false : (!userProfile || profile?._id === userProfile?._id)}
                                            onClick={(e) => {
                                              if (userProfile?._id == reviews?.doctorId ? false : (!userProfile || profile?._id === userProfile?._id)) {
                                                e.preventDefault()
                                                setLoginDialog(true)
                                              }
                                            }}>
                                            {
                                              !userProfile ?
                                                `Login to add review` :
                                                profile?._id === userProfile?._id ?
                                                  userProfile?._id == reviews?.doctorId ?
                                                    `Reply to ${authorName}` :
                                                    `You can't reply to your own account.` :
                                                  `Reply to ${authorName}`}
                                          </button>
                                        </div>
                                      </Fragment>

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
                                      const repliesIdle = replies?.role == 'doctors' ? replies?.doctorProfile?.idle : replies?.patientProfile?.idle
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
                                              idle={repliesIdle}
                                              style={{ width: 58, height: 58 }}
                                            >
                                              <Avatar style={{ width: 58, height: 58 }} alt="" src={`${repliesProfileImage}`} >
                                                <img src={replies?.role == 'doctors' ? doctors_profile : patient_profile} alt="" />
                                              </Avatar>
                                            </StyledBadge>
                                            <div className="comment-body">
                                              <div className="meta-data">
                                                <span style={{ display: 'flex', alignItems: "center" }}>
                                                  <span className="comment-author">
                                                    {replies?.role == 'doctors' ? 'Dr.' : `${replies?.patientProfile?.gender !== "" && `${replies?.patientProfile?.gender}. `}`} {repliesAuthorName}
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
                              page={paginationModel.page + 1}
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
            {
              userProfile == null ? <>
                <span>
                  <button
                    type="button"
                    onClick={() => { setLoginDialog(true); }}
                    className="btn btn-primary submit-btn">
                    {`Login In to add review`}
                  </button>
                </span>
              </> : userProfile!._id !== profile?._id &&
              <div className="write-review">
                <h1 style={{ fontSize: '18px' }}>
                  {
                    doctorReviews &&
                      !doctorReviews.map((review: ReviewTypes) => review.authorId)?.includes(userProfile?._id) ?
                      <>
                        {
                          profile.patients_id.includes(userProfile._id) ?
                            <>Write a review for <strong>Dr. {profile?.firstName} {' '} {profile?.lastName}</strong></> :
                            <p style={{ color: theme.palette.secondary.main }}>You Can&apos;t write review for <strong>Dr. {profile?.firstName} {' '} {profile?.lastName}</strong> without any reservation.  </p>}
                      </> :
                      <>You wrote review for <strong>Dr. {profile?.firstName} {' '} {profile?.lastName}</strong> already</>
                  }

                </h1>
                {
                  doctorReviews &&
                  !doctorReviews.map((review: ReviewTypes) => review.authorId)?.includes(userProfile?._id) &&
                  profile.patients_id.includes(userProfile._id) &&
                  <form noValidate onSubmit={handleSubmit(onSubmitReview)}>
                    <div className='form-group'>
                      <Controller
                        rules={{
                          validate: (value) => value !== 0 || 'This field is required.',
                          required: 'This field is required.'
                        }}
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
                                  setFormValue('recommend', true, { shouldValidate: true });
                                }}
                              >
                                <i className="far fa-thumbs-up" /> Yes
                              </Link>
                              <Link
                                href="#"
                                className={`dislike-btn ${watch('recommend') === false ? 'dislike-btn-active' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setFormValue('recommend', false, { shouldValidate: true });
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
                    <div className="form-group">
                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <FormControlLabel
                            //@ts-ignore
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
                }
              </div>
            }
          </div>
        </div>
      </div>


      <Dialog
        open={termsDialog}
        onClose={() => setTermsDialog(false)}
        scroll='paper'
        aria-labelledby="terms"
        aria-describedby="terms&condition"
      >
        <DialogTitle id="terms">Terms &amp; Conditions</DialogTitle>
        <DialogContent dividers>
          <section className="terms-section" style={muiVar}>
            <div className="terms-content" style={{ marginLeft: '-2rem' }}>
              <Terms />
            </div>
          </section>
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
        TransitionComponent={Transition}
        open={loginDialog}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setLoginDialog(false)
          }, 500);
        }}
        scroll='body'
        aria-labelledby="login"
        aria-describedby="login"
        maxWidth="xs"
      >
        <DialogTitle id="login">
          Login
          <IconButton
            color="inherit"
            onClick={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setLoginDialog(false)
              }, 500);
            }}
            aria-label="close"
            sx={{ float: 'right', "&:hover": { color: 'primary.main' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div style={muiVar}>
            <div className="col-md-12">
              <div className="account-content">
                <div className="col-md-12 col-lg-12 login-right">
                  <LoginBox closeDialog={setLoginDialog} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>

    </Fragment>
  )
});