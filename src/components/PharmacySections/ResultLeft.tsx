
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'

import StickyBox from 'react-sticky-box'


const ResultLeft: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-md-5 col-lg-3 col-xl-3 theiaStickySidebar" style={muiVar}>
        <StickyBox offsetTop={20} offsetBottom={20}>
          <div className="card search-filter">
            <div className="card-header">
              <h1 className="card-title mb-0">Filter</h1>
            </div>
            <div className="card-body">

              <div className="filter-widget">
                <h2>Categories</h2>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" defaultChecked />
                    <span className="checkmark" /> Family Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Skin Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Hair Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Lip Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Men s Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Women s Care
                  </label>
                </div>
                <div>
                  <label className="custom_check">
                    <input type="checkbox" name="gender_type" />
                    <span className="checkmark" /> Baby care
                  </label>
                </div>
              </div>
              <div >
                <button type="button" className="btn book-btn1 w-100">Search</button>
              </div>
            </div>
          </div>
        </StickyBox>
        {/* /Search Filter */}
      </div>
    </Fragment>
  )
});

export default ResultLeft;