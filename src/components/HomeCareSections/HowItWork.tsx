/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Chart_arrow_01, Chart_arrow_02, } from '@/public/assets/imagepath'
import { Flow_chart_icon_01, Flow_chart_icon_02, Flow_chart_icon_03, Flow_chart_icon_04 } from "@/public/assets/images/icons/IconsSvgs";
import { useTheme } from '@mui/material';

const HowItWork: FC = (() => {
  const { muiVar } = useScssVar()
  const theme = useTheme();
  return (
    <div style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
      <div className="how-it-work-fourteen">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-4">
              <div
                className="section-work-head"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                <span>Book best caregiver</span>
                <h2>How it works &amp; Booking</h2>
              </div>
            </div>
            <div className="col-xl-7 col-lg-8">
              <ul className="work-flow-chart">
                <li data-aos="fade-up" data-aos-delay={500}>
                  <img src={Chart_arrow_01} alt="Img" className='imgColorSecondary' />
                  <div className="flow-chart-list">
                    <span className="chart-icon">
                      <Flow_chart_icon_01 />
                    </span>
                    <h3>Location</h3>
                    <span className="chart-count">01</span>
                  </div>
                </li>
                <li data-aos="fade-up" data-aos-delay={600}>
                  <img src={Chart_arrow_01} alt="Img" className='imgColorPrimary' />
                  <div className="flow-chart-list bg-yelllow">
                    <span className="chart-icon">
                      <Flow_chart_icon_02 />
                    </span>
                    <h3>Booking</h3>
                    <span className="chart-count">02</span>
                  </div>
                </li>
                <li data-aos="fade-up" data-aos-delay={700}>
                  <img src={Chart_arrow_01} alt="Img" className='imgColorSecondary' />
                  <div className="flow-chart-list">
                    <span className="chart-icon">
                      <Flow_chart_icon_03 />
                    </span>
                    <h3>Caregiver</h3>
                    <span className="chart-count">03</span>
                  </div>
                </li>
                <li data-aos="fade-up" data-aos-delay={800}>
                  <img src={Chart_arrow_02} alt="Img" className='imgColorPrimary' />
                  <div className="flow-chart-list bg-yelllow">
                    <span className="chart-icon">
                      <Flow_chart_icon_04 />
                    </span>
                    <h3>Takecare</h3>
                    <span className="chart-count">04</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default HowItWork;