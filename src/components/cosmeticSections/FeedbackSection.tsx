/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { feedbacksixteen } from '../../../public/assets/imagepath';


const FeedbackSection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="feedback-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="feedback-schedule-all">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <div className="feedback-inner-main">
                  <img src={feedbacksixteen} alt="image" className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="feedback-fifteen-content">
                  <h3>Focus On Your Own Body Shape</h3>
                  <p>
                    Its easy to list, simple to manage and, best of all, free to
                    list!
                  </p>
                  <div className="feedback-btns">
                    <Link href="" className="btn btn-primary">
                      Make An Appointment
                    </Link>
                    <Link href="/doctors/search" className="btn btn-primarytwo">
                      <i className="feather-plus me-2" />
                      Get Free Check-up
                    </Link>
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

export default FeedbackSection;