/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { healthcare } from '../../../public/assets/imagepath';
import { HeartPulseSvg } from '../../../public/assets/images/icons/IconsSvgs';
import Typography from '@mui/material/Typography';

const StepToFollow: FC = (() => {
  const { muiVar } = useScssVar();
  return (
    <Fragment>
      <section className="need-to-know-section steps-to-follow" style={muiVar}>
        <div className="floating-bg">
          <img src={healthcare} alt="#" />
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-12 aos" data-aos="fade-up">
              <div className="gallery-box-block">
                <div className="gallery-box-right">
                  <div className="box-detail">
                    <div className="steps-list-box">
                      <div className="steps-list-img">
                        <span>1</span>
                        {/* <img src={heartpulse} className="img-fluid" alt="#" /> */}
                        <HeartPulseSvg />
                      </div>
                      <Typography sx={{ fontWeight: 'bold' }} component="h1">Choose Your Doctor</Typography>
                      <p>Lorem Ipsum is simply dummy text of the printing..</p>
                    </div>
                  </div>
                  <div className="box-detail">
                    <div className="steps-list-box">
                      <div className="steps-list-img">
                        <span>3</span>
                        {/* <img src={heartpulse} className="img-fluid" alt="#" /> */}
                        <HeartPulseSvg />
                      </div>
                      <Typography sx={{ fontWeight: 'bold' }} component="h1">Consult with doctor</Typography>
                      <p>Lorem Ipsum is simply dummy text of the printing..</p>
                    </div>
                  </div>
                </div>
                <div className="gallery-box-left">
                  <div className="box-detail mb-4 ">
                    <div className="steps-list-box">
                      <div className="steps-list-img">
                        <span>2</span>
                        {/* <img src={heartpulse} className="img-fluid" alt="#" /> */}
                        <HeartPulseSvg />
                      </div>
                      <Typography sx={{ fontWeight: 'bold' }} component="h1">Set Appointment</Typography>
                      <p>Lorem Ipsum is simply dummy text of the printing..</p>
                    </div>
                  </div>
                  <div className="box-detail">
                    <div className="steps-list-box">
                      <div className="steps-list-img">
                        <span>4</span>
                        {/* <img src={heartpulse} className="img-fluid" alt="#" /> */}
                        <HeartPulseSvg />
                      </div>
                      <Typography sx={{ fontWeight: 'bold' }} component="h1">Get recommendation</Typography>
                      <p>Lorem Ipsum is simply dummy text of the printing..</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">Easy Steps For <span>New Patients</span></h2>
                <div className="need-to-know-content">
                  <p>
                    If one of the valves in your heart becomes diseased it can affect the flow of blood.
                    This can happen in one of two ways: valve stenosis (where the valve does not fully
                    open and obstructs or restricts flow) or valve incompetence (where the valve does
                    not close properly and blood is allowed to leak backwards)....
                  </p>
                  <div className="content-btn-block d-flex">
                    <Link href="/doctors/search" className=" need-to-know-content-btn book-btn me-2">Book
                      Appointment</Link>
                    <Link href="/pages/pricing-plan" className=" need-to-know-content-btn">Click Our Plan</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default StepToFollow