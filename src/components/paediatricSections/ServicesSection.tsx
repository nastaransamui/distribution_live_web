/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material';
import { AtomBondSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { featureImg1, serviceImg01, serviceImg02, serviceImg03, serviceImg04, serviceImg05 } from '@/public/assets/imagepath';




const ServicesSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="services-section-thirteen common-padding" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>Our Services</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={serviceImg05} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>Prenatal/New-born</h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={serviceImg01} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>New-born examinate</h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={serviceImg02} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>Vaccinations </h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={serviceImg03} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>Blood tests</h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={serviceImg04} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>diagnostic tests</h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-thirteen-main">
                <div className="service-thirteen-all">
                  <div className="service-img-thirteen">
                    <img src={featureImg1} alt="#" />
                  </div>
                  <div className="service-inner-contents">
                    <h5>Home visits</h5>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default ServicesSection;