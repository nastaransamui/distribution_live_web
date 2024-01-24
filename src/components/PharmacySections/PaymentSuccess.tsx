import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'

const PaymentSuccess: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="content success-page-cont" style={muiVar}>
        <div className="container-fluid" style={{ marginTop: '10vh' }}>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  <div className="success-cont">
                    <i className="fas fa-check" />
                    <h3>Payment Successfully!</h3>
                    <p className="mb-0">Product ID: 245468</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default PaymentSuccess