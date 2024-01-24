import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FeatherIcon from 'feather-icons-react'
import TextField from '@mui/material/TextField'

const ContactSection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="contact-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="section-inner-header contact-inner-header">
                <h6>Get in touch</h6>
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
                    <h4>Address</h4>
                    <p>8432 Mante Highway, Aminaport, USA</p>
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
                    <p>+1 315 369 5943</p>
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
                    <p>doccure@example.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-12 d-flex">
              <div className="card contact-form-card w-100">
                <div className="card-body">
                  <form noValidate>
                    <div className="row">
                      <div className="col-md-6">
                        <TextField
                          required
                          id="outlined-required"
                          label="Enter Your Name"
                          defaultValue=""
                          autoComplete='off'
                          // size='small'
                          fullWidth
                          sx={{ mb: 4, mt: 5 }}
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          required
                          id="outlined-required"
                          label="Enter Email Address"
                          defaultValue=""
                          autoComplete='off'
                          // size='small'
                          fullWidth
                          sx={{ mb: 4, mt: 5 }}
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          required
                          id="outlined-required"
                          label="Enter Phone Number"
                          defaultValue=""
                          autoComplete='off'
                          // size='small'
                          fullWidth
                          sx={{ mb: 4 }}
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          required
                          id="outlined-required"
                          label="Enter Services"
                          defaultValue=""
                          autoComplete='off'
                          // size='small'
                          fullWidth
                          sx={{ mb: 4 }}
                        />
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
                          minRows={4}
                          sx={{ mb: 4 }}
                        />
                      </div>
                      <div className="col-md-12">
                        <div className="form-group form-group-btn mb-0">
                          <button
                            style={{ marginBottom: -150 }}
                            type="submit"
                            className="btn btn-primary prime-btn"
                            onClick={(e) => e.preventDefault()}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </Fragment>
  )
});

export default ContactSection;