/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { logo } from '../../../public/assets/imagepath'
//Mui

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = (e: any) => { }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (event: SelectChangeEvent) => { }
  return (
    <Fragment>
      <footer className="footer footer-one footer-fourteen" style={muiVar}>
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <div className="footer-widget footer-about">
                  <div className="footer-logo">
                    <Link href="/index-10">
                      <img src={logo} alt="logo" className='img' />
                    </Link>
                  </div>
                  <div className="footer-about-content">
                    <p>
                      Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna ad minim
                      veniam aliqua.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Company</h2>
                      <ul>
                        <li>
                          <Link href="#">Home</Link>
                        </li>
                        <li>
                          <Link href="#">Specialities</Link>
                        </li>
                        <li>
                          <Link href="#">Consult</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Specialities</h2>
                      <ul>
                        <li>
                          <Link href="#">Neurology</Link>
                        </li>
                        <li>
                          <Link href="#">Cardiologist</Link>
                        </li>
                        <li>
                          <Link href="#">Dentist</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-4">
                    <div className="footer-widget footer-contact">
                      <h2 className="footer-title">Contact Us</h2>
                      <div className="footer-contact-info">
                        <div className="footer-address">
                          <p>
                            <i className="feather-map-pin" /> 3556 Beech Street, USA
                          </p>
                        </div>
                        <div className="footer-address">
                          <p>
                            <i className="feather-phone-call" /> +1 315 369 5943
                          </p>
                        </div>
                        <div className="footer-address mb-0">
                          <p>
                            <i className="feather-mail" /> mjcode2020@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <h2 className="footer-title">Join Our Newsletter</h2>
                  <div className="subscribe-form">
                    <form action="#">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        name="Enter Email"
                      />
                      <button type="submit" className="btn">
                        Submit
                      </button>
                    </form>
                  </div>
                  <div className="col-md-6">
                    <div className="footer-language mb-3">
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
                          <InputLabel id="demo-select-small-label">Language</InputLabel>

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
                  <div className="social-icon">
                    <ul>
                      <li>
                        <Link href="#" target="_blank" aria-label='social links'>
                          <i className="fab fa-facebook" />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank" aria-label='social links'>
                          <i className="fab fa-instagram" />
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank" aria-label='social links'>
                          <i className="fab fa-twitter" />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank" aria-label='social links'>
                          <i className="fab fa-linkedin-in" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            {/* Copyright */}
            <div className="copyright">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="copyright-text">
                    <p className="mb-0"> Copyright © 2023 All Rights Reserved</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="/terms-condition">Terms and Conditions</Link>
                      </li>
                      <li>
                        <Link href="/login">Login &amp; Register</Link>
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
})


export default Footer;