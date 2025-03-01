import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'


const CartTotals: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="row" style={muiVar}>
        <div className="col-md-7 col-lg-8">
        </div>
        <div className="col-md-5 col-lg-4">
          {/* Booking Summary */}
          <div className="card booking-card">
            <div className="card-header" style={{ borderRadius: '8px 8px 0px 0px' }}>
              <h1 className="card-title">Cart Totals</h1>
            </div>
            <div className="card-body">
              <div className="booking-summary">
                <div className="booking-item-wrap">
                  <ul className="booking-date">
                    <li>Subtotal <span>$5,877.00</span></li>
                    <li>Shipping <span>$25.00<Link href="#">Calculate shipping</Link></span></li>
                  </ul>
                  <ul className="booking-fee pt-4">
                    <li>Tax <span>$0.00</span></li>
                  </ul>
                  <div className="booking-total">
                    <ul className="booking-total-list">
                      <li>
                        <span>Total</span>
                        <span className="total-cost">$160</span>
                      </li>
                      <li>
                        <div className="clinic-booking pt-4">
                          <Link className="apt-btn" href="/pharmacy/product-checkout">Proceed to checkout</Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Booking Summary */}
        </div>
      </div>
    </Fragment>
  )
});

export default CartTotals;