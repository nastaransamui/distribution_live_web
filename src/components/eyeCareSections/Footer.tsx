/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import Link from 'next/link'
import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import useScssVar from '@/hooks/useScssVar';
import { logo, payment } from "../../../public/assets/imagepath";
import packageJson from "../../../package.json";
//Mui
import { useTheme } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton'
import Language from '@mui/icons-material/Language'
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box'
const Footer: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = (e: any) => { }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (event: SelectChangeEvent) => { }
  return (
    <Fragment>
      <footer className="footer footer-eleven" style={muiVar}>
        <div className="footer-top aos aos-init aos-animate" data-aos="fade-up">
          <div className="container">
            <div className="footer-contacts">
              <div className="row">
                <div className="col-md-4">
                  <div className="footer-wrap">
                    <div className="footer-icon">
                      <FiMail className="feather-mail" />
                    </div>
                    <div className="footer-info">
                      <h1>Email</h1>
                      <p>mjcode2020@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="footer-wrap">
                    <div className="footer-icon">
                      <FiPhone className="feather-phone" />
                    </div>
                    <div className="footer-info">
                      <h1>Phone Number</h1>
                      <p>+66 870624648</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="footer-wrap">
                    <div className="footer-icon">
                      <FiClock className="feather-clock" />
                    </div>
                    <div className="footer-info">
                      <h1>Open Timing</h1>
                      <p>We are available 24*7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="footer-content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry s standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book. It has
                    survived not only five centuries,
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="footer-widget">
                  <h2 className="footer-title">Subscribe Newsletter</h2>
                  <div className="subscribe-form">
                    <form noValidate>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        name='Enter Email'
                      />
                      <button onClick={(e) => { e.preventDefault() }} type="submit" className="btn">
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="footer-payment">
                  <h1>Acceptable Payments </h1>
                  <img
                    src={payment}
                    alt="payment"
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="footer-language">
                  <FormControl sx={{ mt: 2, minWidth: '100%' }} size="small">
                    <Box sx={{ display: { xl: 'none', lg: 'none', md: 'none', sm: 'flex', xs: 'flex' } }}>
                      <IconButton disableFocusRipple disableRipple disableTouchRipple
                        onClick={handleClick}>
                        <Language />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem data-lang-value="en" onClick={handleClose}><img width={20} height={20} src={`/lang/en.webp`} alt='' style={{ marginBottom: -6 }} />&nbsp;English</MenuItem>

                        <MenuItem data-lang-value="th" onClick={handleClose}><img width={20} height={20} src={`/lang/th.webp`} alt='' style={{ marginBottom: -6 }} />&nbsp;Thai</MenuItem>
                      </Menu>
                    </Box>
                    <Box sx={{ display: { xl: 'flex', lg: 'flex', md: 'flex', sm: 'none', xs: 'none' } }}>
                      <InputLabel id="demo-select-small-label" sx={{ color: theme.palette.secondary.contrastText }}>Language</InputLabel>

                      <Select
                        value={'en'}
                        label="Language"
                        onChange={handleChange}
                        fullWidth
                      >
                        <MenuItem value="en"><img width={20} height={20} src={`/lang/en.webp`} alt='' style={{ marginBottom: -6 }} />&nbsp;English</MenuItem>

                        <MenuItem value="th"><img width={20} height={20} src={`/lang/th.webp`} alt='' style={{ marginBottom: -6 }} />&nbsp;Thai</MenuItem>
                      </Select>
                    </Box>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="footer-widget footer-menu">
                  <ul>
                    <li>
                      <Link href="#">About</Link>
                    </li>
                    <li>
                      <Link href="#">Our services</Link>
                    </li>
                    <li>
                      <Link href="#">Patients</Link>
                    </li>
                    <li>
                      <Link href="#">Camp</Link>
                    </li>
                    <li>
                      <Link href="#">Doctors</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="social-icon">
                  <ul>
                    <li>
                      <Link href="#" target="_blank" aria-label='social media'>
                        <i className="fab fa-facebook" />{" "}
                      </Link>
                    </li>
                    <li>
                      <Link href="#" target="_blank" aria-label='social media'>
                        <i className="fab fa-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link href="#" target="_blank" aria-label='social media'>
                        <i className="fab fa-twitter" />{" "}
                      </Link>
                    </li>
                    <li>
                      <Link href="#" target="_blank" aria-label='social media'>
                        <i className="fab fa-linkedin-in" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Copyright */}
            <div className="copyright">
              <div className="row align-items-center">
                <div className="col-md-5">
                  <div className="copyright-text">
                    <p>© 2023 MJ. All Rights Reserved.</p>
                    <small style={{ display: 'flex', justifyContent: 'flex-start' }}> v:{packageJson.version}</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="footer-bottom-logo">
                    <Link href="/" aria-label='home'>
                      <img
                        src={logo}
                        height={50}
                        width={50}
                        className="img-fluid"
                        alt="Logo"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-md-5">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <Link href="/privacy-policy" aria-label='privacy'>Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="/terms-condition" aria-label='privacy'>Terms and Conditions</Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Copyright Menu */}
                </div>
              </div>
            </div>
            {/* /Copyright */}
          </div>
        </div>
      </footer>
    </Fragment>
  )
});

export default Footer;