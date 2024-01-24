import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { ChooseOneIconSvg, ChooseTwoIconSvg, ChooseThreeIconSvg, ChooseFourIconSvg } from '../../../public/assets/images/icons/IconsSvgs';

const WhyChooseUs: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="why-choose-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-inner-header text-center">
                <h2>Why Choose Us</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card why-choose-card w-100">
                <div className="card-body">
                  <div className="why-choose-icon">
                    <span>
                      <ChooseOneIconSvg />
                    </span>
                  </div>
                  <div className="why-choose-content">
                    <h4>Qualified Staff of Doctors</h4>
                    <p>
                      Lorem ipsum sit amet consectetur incididunt ut labore et
                      exercitation ullamco laboris nisi dolore magna enim veniam
                      aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card why-choose-card w-100">
                <div className="card-body">
                  <div className="why-choose-icon">
                    <span>
                      <ChooseTwoIconSvg />
                    </span>
                  </div>
                  <div className="why-choose-content">
                    <h4>Qualified Staff of Doctors</h4>
                    <p>
                      Lorem ipsum sit amet consectetur incididunt ut labore et
                      exercitation ullamco laboris nisi dolore magna enim veniam
                      aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card why-choose-card w-100">
                <div className="card-body">
                  <div className="why-choose-icon">
                    <span>
                      <ChooseThreeIconSvg />
                    </span>
                  </div>
                  <div className="why-choose-content">
                    <h4>Qualified Staff of Doctors</h4>
                    <p>
                      Lorem ipsum sit amet consectetur incididunt ut labore et
                      exercitation ullamco laboris nisi dolore magna enim veniam
                      aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card why-choose-card w-100">
                <div className="card-body">
                  <div className="why-choose-icon">
                    <span>
                      <ChooseFourIconSvg />
                    </span>
                  </div>
                  <div className="why-choose-content">
                    <h4>Qualified Staff of Doctors</h4>
                    <p>
                      Lorem ipsum sit amet consectetur incididunt ut labore et
                      exercitation ullamco laboris nisi dolore magna enim veniam
                      aliqua.{" "}
                    </p>
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


export default WhyChooseUs;