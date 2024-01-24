import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

const DoctorSection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="doctor-divison" style={muiVar}>
        <div className="d-flex">
          <div className="doc-background aos" data-aos="fade-up">
            <h3>ARE YOU A DOCTOR?</h3>
            <p>The service allows you to get maximum visibility online and to manage appointments and contacts coming from the site, in a simple and fast way.</p>
            <Link href="/doctors/profile" className="doc-bok-btn">Book Now</Link>
          </div>
          <div className="pat-background">
            <h3>ARE YOU A PATIENT?</h3>
            <p>The service allows you to get maximum visibility online and to manage appointments and contacts coming from the site, in a simple and fast way.</p>
            <Link href="/doctors/booking" className="doc-bok-btn">Book Now</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default DoctorSection;