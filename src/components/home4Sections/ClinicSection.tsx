/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { spec, spec1, spec2, spec3, spec4, spec5, spec6, spec7 } from '../../../public/assets/imagepath';

const ClinicSection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="clinic-specialities" style={muiVar}>
        <div className="container">
          <div className="section-header-three text-center aos" data-aos="fade-up">
            <h2>Clinic &amp; Specialities</h2>
            <p className="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec} alt="" className='img' />
                  <h3>Orthopedic</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec1} alt='' className='img' />
                  <h3>Laboratry</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec2} alt='' className='img' />
                  <h3>Neurology</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec3} alt='' className='img' />
                  <h3>Cardiology</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="special-box text-center aos" data-aos="fade-up">
                <div className="special-body">
                  <img src={spec4} alt='' className='img' />
                  <h3>MRI Scans</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec5} alt='' className='img' />
                  <h3>Primary Checkup</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec6} alt='' className='img' />
                  <h3>Testing</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 aos" data-aos="fade-up">
              <div className="special-box text-center">
                <div className="special-body">
                  <img src={spec7} alt='' className='img' />
                  <h3>Dentist</h3>
                  <Link href="/doctors/search" className="spc-book">Book now <i className="fas fa-caret-right" /> </Link>
                </div>
                <div className="row row-sm special-footer">
                  <div className="col-6 text-left">
                    <Link href="#" className="doc-count">124 <span>Doctors</span></Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link href="#" className="clin-count">24 <span>Clinics</span></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="view-all-more text-center aos" data-aos="fade-up">
            <Link href="/doctors/search" className="btn book-btn">View More</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ClinicSection;