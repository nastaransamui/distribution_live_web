import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import StickyBox from 'react-sticky-box';
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const Checkout: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-md-6 col-lg-7" style={muiVar}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Billing details</h3>
          </div>
          <div className="card-body">
            {/* Checkout Form */}
            <form noValidate action={`/pharmacy/payment-success`}>
              {/* Personal Information */}
              <div className="info-widget">
                <h4 className="card-title">Personal Information</h4>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        required
                        label="First Name"
                        defaultValue=""
                        size="small"
                        type='email'
                        autoComplete='off'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        required
                        label="Last Name"
                        defaultValue=""
                        type='email'
                        size="small"
                        autoComplete='off'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        required
                        label="Email"
                        type='email'
                        defaultValue=""
                        size="small"
                        autoComplete='off'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        required
                        label="Phone"
                        defaultValue=""
                        size="small"
                        type='email'
                        autoComplete='off'
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
                <div className="exist-customer">Existing Customer? <Link href="#">Click here to login</Link></div>
              </div>
              {/* /Personal Information */}
              {/* Shipping Details */}
              <div className="info-widget">
                <h4 className="card-title">Shipping Details</h4>
                <div className="terms-accept">
                  <div className="custom-checkbox">
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Ship to a different address?" />
                  </div>
                </div>
                <div className="form-group card-label">
                  <TextField
                    multiline
                    minRows={4}
                    label="Order notes (Optional)"
                    sx={{ mt: 2 }}
                    defaultValue=""
                    size="small"
                    type='email'
                    autoComplete='off'
                    fullWidth
                  />
                </div>
              </div>
              {/* /Shipping Details */}
              <div className="payment-widget">
                <h4 className="card-title">Payment Method</h4>
                {/* Credit Card Payment */}
                <div className="payment-list">
                  <label className="payment-radio credit-card-option">
                    <input type="radio" name="radio" defaultChecked />
                    <span className="checkmark" />
                    Credit card
                  </label>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group card-label">
                        <TextField
                          required
                          label="Name on Card"
                          defaultValue=""
                          size="small"
                          type='email'
                          autoComplete='off'
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group card-label">
                        <TextField
                          required
                          label="Card Number"
                          defaultValue=""
                          size="small"
                          type='email'
                          autoComplete='off'
                          fullWidth
                          placeholder="1234  5678  9876  5432"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group card-label">
                        <TextField
                          required
                          label="Expiry Month"
                          defaultValue=""
                          size="small"
                          type='email'
                          autoComplete='off'
                          fullWidth
                          placeholder="MM"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group card-label">
                        <TextField
                          required
                          label="Expiry Year"
                          defaultValue=""
                          size="small"
                          type='email'
                          autoComplete='off'
                          fullWidth
                          placeholder="YY"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group card-label">
                        <TextField
                          required
                          label="CVV"
                          defaultValue=""
                          size="small"
                          type='email'
                          autoComplete='off'
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Credit Card Payment */}
                {/* Paypal Payment */}
                <div className="payment-list">
                  <label className="payment-radio paypal-option">
                    <input type="radio" name="radio" />
                    <span className="checkmark" />
                    Paypal
                  </label>
                </div>
                {/* /Paypal Payment */}
                {/* Terms Accept */}
                <div className="terms-accept">
                  <div className="custom-checkbox">
                    <FormControlLabel control={<Checkbox />} label="I have read and accept" />
                    <Link href="/terms">Terms &amp; Conditions</Link>
                  </div>
                </div>
                {/* /Terms Accept */}
                {/* Submit Section */}
                <div className="submit-section mt-4">
                  <button type="submit" className="btn btn-primary submit-btn">Confirm and Pay</button>
                </div>
                {/* /Submit Section */}
              </div>
            </form>
            {/* /Checkout Form */}
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-5 theiaStickySidebar" style={muiVar}>
        <StickyBox offsetTop={20} offsetBottom={20}>
          {/* Booking Summary */}
          <div className="card booking-card">
            <div className="card-header">
              <h3 className="card-title">Your Order</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-center mb-0">
                  <tbody><tr>
                    <th>Product</th>
                    <th className="text-end">Total</th>
                  </tr>
                  </tbody><tbody>
                    <tr>
                      <td>Safi Natural Blood Purifier Syrup 200 ml Manufactured By Hamdard (Wakf) Laboratories</td>
                      <td className="text-end">$200</td>
                    </tr>
                    <tr>
                      <td>Safi Natural Blood Purifier Syrup 200 ml</td>
                      <td className="text-end">$200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="booking-summary pt-5">
                <div className="booking-item-wrap">
                  <ul className="booking-date">
                    <li>Subtotal <span>$5,877.00</span></li>
                    <li>Shipping <span>$25.00</span></li>
                  </ul>
                  <ul className="booking-fee">
                    <li>Tax <span>$0.00</span></li>
                  </ul>
                  <div className="booking-total">
                    <ul className="booking-total-list">
                      <li>
                        <span>Total</span>
                        <span className="total-cost">$160</span>
                      </li>
                      <li>
                      </li></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Booking Summary */}
        </StickyBox>
      </div>
    </Fragment>
  )
});

export default Checkout;