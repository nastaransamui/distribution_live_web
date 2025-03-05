/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { heartplus, hand, hexagon_group_3 } from '../../../public/assets/imagepath';
import AOS from 'aos'
import { useTheme } from '@mui/material';

const Bookappointment: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 100200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="book-appointment-section aos" data-aos="fade-up" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="book-appointment-ten text-center">
            <div className="book-section-bg">
              <img src={hexagon_group_3} alt="#" className='img' />
              <img src={hand} alt="#" className='img' />
              <img src={heartplus} alt="#" className='img' />
            </div>
            <h2>Book An Appointment Today</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
              the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.</p>
            <div className="appointment-btn-group">
              <Link href="/doctors/search" className="appointment-blue-btn">Start a Consult</Link>
              <Link href="/doctors/search">Click Our Plan</Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Bookappointment;