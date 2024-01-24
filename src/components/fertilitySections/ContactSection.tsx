/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { contact_fourteen, contact_icon2, contact_icon3 } from '../../../public/assets/imagepath';
import { ContactIconOneSvg } from '../../../public/assets/images/icons/IconsSvgs';
import CheckBox from "@mui/icons-material/CheckBox";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material';
import {
  doctor1,
  doctor2,
  doctor3,
  doctor4,
  doctor5,
  doctor6,
} from "../../../public/assets/imagepath";


const ContactSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  const avatar3Sx = { background: theme.palette.background.paper, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }
  const avatarTextSx = { fontSize: '14px', background: theme.palette.secondary.main, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }

  return (
    <Fragment>
      <section className="contact-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="contact-schedule-main">
            <div className="row">
              <div className="col-lg-7">
                <div className="scheduling-left-main">
                  <h2>Are you pregnant?</h2>
                  <p>Free talk with us for Schedule a Consultation.</p>
                  <ul>
                    <li>
                      <Link href="/doctor/appointments">Fix an Appoint</Link>
                    </li>
                    <li>
                      <Link href="/doctors/booking">Make a Call</Link>
                    </li>
                    <li>
                      <Link href="#">Whatsapp</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="scheduling-right-main">
                  <img
                    src={contact_fourteen}
                    alt="image"
                    className="img-fluid"
                  />
                  <div className="scheduling-right-img">
                    {/* <img src={contact_icon3} alt="" /> */}
                    <div className="banner-img1">
                      <div className="banner-img1-div" >
                        <CheckBox color="secondary" sx={{ fontSize: 38, ml: 1 }} />
                        <Typography sx={{ ml: 1, mt: 1 }} display="block" gutterBottom>
                          Regular Checkup
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="scheduling-right-imgtwo">
                    {/* <img src={contact_icon2} alt="" /> */}
                    <div className="banner-img3-div" >
                      <Typography sx={{ ml: -10, mt: 2 }} display="block" gutterBottom>Meet our doctors</Typography>
                      <span style={{ display: 'flex' }}>
                        <Avatar sx={avatar3Sx} alt="" src={doctor1} />
                        <Avatar sx={avatar3Sx} alt="" src={doctor2} />
                        <Avatar sx={avatar3Sx} alt="" src={doctor3} />
                        <Avatar sx={avatar3Sx} alt="" src={doctor4} />
                        <Avatar sx={avatar3Sx} alt="" src={doctor5} />
                        <Avatar sx={avatar3Sx} alt="" src={doctor6} />
                        <Avatar sx={avatarTextSx} alt="" >120+</Avatar>

                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-inner-image">
              <ContactIconOneSvg />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ContactSection;