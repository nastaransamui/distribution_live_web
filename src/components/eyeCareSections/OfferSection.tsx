/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { offer_01, offer_02 } from '@/public/assets/imagepath';
import { useTheme } from '@mui/material';

const OfferSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  return (
    <Fragment>
      <section className="offer-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex">
              <div className="offer-wrap flex-fill">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="off-img">
                      <img
                        src={offer_01}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="off-info">
                      <h1>NEW USER OFFER</h1>
                      <p>21 - 25 April 2023</p>
                      <h2>Free Eye Camp </h2>
                      <Link href="#" className="btn btn-light-blue" style={{ lineHeight: '30px ' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-flex">
              <div className="offer-wrap flat-offer flex-fill">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="off-img">
                      <img
                        src={offer_02}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="off-info">
                      <h1>Flat 30% OffER</h1>
                      <p>21 April 2023</p>
                      <h2>Crystal Clear </h2>
                      <Link href="#" className="btn btn-light-blue" style={{ lineHeight: '30px ' }}>
                        Buy Now
                      </Link>
                    </div>
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

export default OfferSection;