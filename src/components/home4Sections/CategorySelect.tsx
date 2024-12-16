import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

const CategorySelect: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="doctor-category" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 aos" data-aos="fade-up">
              <div className="pop-box">
                <div className="top-section">
                  <div className="cat-icon">
                    <i className="fas fa-procedures" />
                  </div>
                </div>
                <div className="body-section">
                  <h3>Visit a Doctor</h3>
                  <p>250 +  Doctors</p>
                  <Link href="/doctors/search" className="btn book-btn" tabIndex={0}>Book Now</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 aos" data-aos="fade-up">
              <div className="pop-box">
                <div className="top-section two">
                  <div className="cat-icon">
                    <i className="fas fa-plus-square" />
                  </div>
                </div>
                <div className="body-section">
                  <h3>Find a Pharmacy</h3>
                  <p>2560 +  Pharmacy</p>
                  <Link href="/doctors/search" className="btn book-btn" tabIndex={0}>Book Now</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 aos" data-aos="fade-up">
              <div className="pop-box">
                <div className="top-section three">
                  <div className="cat-icon">
                    <i className="fas fa-city" />
                  </div>
                </div>
                <div className="body-section">
                  <h3>Find a Lab</h3>
                  <p>250 +  Testing Labs</p>
                  <Link href="/doctors/search" className="btn book-btn" tabIndex={0}>Book Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default CategorySelect;