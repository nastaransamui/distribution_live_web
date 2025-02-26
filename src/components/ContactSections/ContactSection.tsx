import { FC, Fragment, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FeatherIcon from 'feather-icons-react'
import TextField from '@mui/material/TextField'
import { AppState } from '@/redux/store';
import { useDispatch, useSelector, } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { emailRegex } from '../PatientDashboardSections/ChangePassword';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import { useTheme } from "@mui/material";
export interface FormType {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  comments: string;
}

const ContactSection: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const userData = useSelector((state: AppState) => state.userData.value)
  const dispatch = useDispatch()
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      comments: ''
    }
  })

  const onRegisterSubmit = (data: FormType) => {
    data.email = data.email.toLowerCase();
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('sendEmail', {
      receiver: data.email,
      subject: 'Contact page Heath care Website',
      firstName: data.firstName,
      lastName: data.lastName,
      emailBody: data.comments,
      mobileNumber: data.mobileNumber,
    })
    homeSocket.current.once('sendEmailReturn', (msg: any) => {
      if (msg?.status == 200) {
        toast.info(msg.message || 'Send successfull', {
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
            // reset()
          }
        });
      } else {
        toast.error(msg.message || 'erro', {
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
      }
    })

  }
  return (
    <Fragment>
      <section className="contact-section" style={{ ...muiVar, backgroundColor: theme.palette.background.default }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12 card   animate__animated animate__backInUp" style={{ padding: '20px 30px' }}>
              <div className="section-inner-header contact-inner-header">
                <h1>Get in touch</h1>
                <h2>Have Any Question?</h2>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i >
                      <FeatherIcon icon="map-pin" style={{ width: "44px", height: "44px" }} />
                    </i>
                  </div>
                  <div className="contact-details">
                    <h3>Address</h3>
                    <p>Thailand</p>
                  </div>
                </div>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i>
                      <FeatherIcon icon="phone" style={{ width: "44px", height: "44px" }} />
                    </i>
                  </div>
                  <div className="contact-details">
                    <h4>Phone Number</h4>
                    <p>+66(0) 870 624648</p>
                  </div>
                </div>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i>
                      <FeatherIcon icon="mail" style={{ width: "44px", height: "44px" }} />
                    </i>
                  </div>
                  <div className="contact-details">
                    <h4>Email Address</h4>
                    <p>mjcode2020@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-12 d-flex   animate__animated animate__backInUp">
              <div className="card contact-form-card w-100" style={{ border: `1px solid ${theme.palette.secondary.light}` }}>
                <div className="card-body">
                  <form noValidate onSubmit={handleSubmit(onRegisterSubmit)}>
                    <div className="row">
                      <div className="col-md-6">
                        <TextField
                          required
                          id="firstName"
                          error={errors.firstName == undefined ? false : true}
                          helperText={errors.firstName && errors['firstName']['message'] as ReactNode}
                          {
                          ...register('firstName', {
                            required: "This field is required"
                          })
                          }
                          label="First Name"
                          fullWidth
                          sx={{ mb: 4, mt: 5 }}
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          required
                          id="lastName"
                          label="Last Name"
                          error={errors.lastName == undefined ? false : true}
                          helperText={errors.lastName && errors['lastName']['message'] as ReactNode}
                          {
                          ...register('lastName', {
                            required: "This field is required"
                          })
                          }
                          fullWidth
                          sx={{ mb: 4, mt: 5 }}
                        />
                      </div>
                      <div className="col-md-6">
                        <Controller
                          rules={{ required: "This field is required", validate: (val) => matchIsValidTel(val) }}
                          name='mobileNumber'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange } = field;
                            return (
                              <MuiTelInput
                                {...field}
                                InputLabelProps={{ shrink: true }}
                                defaultCountry={userData?.countryCode}
                                helperText={fieldState.invalid ? "Tel is invalid" : ""}
                                error={fieldState.invalid}
                                label="Enter Phone Number"
                                required
                                fullWidth
                              />
                            )
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <Controller
                          rules={{
                            required: "This field is required",
                            pattern: {
                              value: emailRegex,
                              message: 'Email should looks like an email.'
                            }
                          }}
                          name='email'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange } = field;
                            return (
                              <TextField
                                required
                                id='email'
                                label="Email"
                                error={errors.email == undefined ? false : true}
                                helperText={errors.email && errors['email']['message'] as ReactNode}
                                fullWidth
                                ref={ref}
                                inputProps={{ style: { textTransform: 'lowercase' } }}
                                onChange={(e: any) => {
                                  e.target.value = e.target.value.replace(/^\s+/, '').replace(/\s+$/, '')
                                  onChange(e)
                                }}
                                sx={{ mb: 4 }}
                              />
                            )
                          }} />
                      </div>
                      <div className="col-md-12">
                        <TextField
                          required
                          id="outlined-required"
                          label="Enter your comments"
                          defaultValue=""
                          autoComplete='off'
                          fullWidth
                          multiline
                          error={errors.comments == undefined ? false : true}
                          helperText={errors.comments && errors['comments']['message'] as ReactNode}
                          {
                          ...register('comments', {
                            required: "This field is required"
                          })
                          }
                          minRows={4}
                          sx={{ mb: 4 }}
                        />
                      </div>
                      <div className="col-md-12">
                        <div className="form-group form-group-btn mb-0">
                          <button
                            style={{ display: 'block', width: '100%' }}
                            type="submit"
                            className="btn btn-primary prime-btn"
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-map d-flex">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29090.8440512992!2d100.50107361556357!3d13.733762172510717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2999370ced7ad%3A0x5857f80ee7e16ad4!2sChina%20Town!5e0!3m2!1sen!2sth!4v1720003643875!5m2!1sen!2sth"
          title='map'
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </Fragment>
  )
});

export default ContactSection;