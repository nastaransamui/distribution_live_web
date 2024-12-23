/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Product, Product1, Product2, Product3, Product4 } from '../../../public/assets/imagepath';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const CartTable: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="card card-table" style={muiVar}>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-center mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h2 className="table-avatar">
                      <Link href="/pharmacy/product-description" className="avatar avatar-sm me-2">
                        <img className="avatar-img" src={Product} alt="User Image" /></Link>
                    </h2>
                    <Link href="/pharmacy/product-description">Benzaxapine Croplex</Link>
                  </td>
                  <td>26565</td>
                  <td>$19</td>
                  <td className="text-center">
                    <div className="custom-increment cart">
                      <div className="input-group1">
                        <span className="input-group-btn">
                          <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field aria-label='minus'>
                            <span><i className="fas fa-minus" /></span>
                          </button>
                        </span>
                        <input type="text" id="quantity1" name="quantity1" className=" input-number" defaultValue={10} aria-label='amount' />
                        <span className="input-group-btn">
                          <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field aria-label='plus'>
                            <span><i className="fas fa-plus" /></span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">$19</td>
                  <td className="text-end">
                    <div className="table-action">
                      <DeleteForeverIcon sx={{ color: 'crimson', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 className="table-avatar">
                      <Link href="/pharmacy/product-description" className="avatar avatar-sm me-2">
                        <img className="avatar-img" src={Product1} alt="User Image" /></Link>
                    </h2>
                    <Link href="/pharmacy/product-description">Ombinazol Bonibamol</Link>
                  </td>
                  <td>865727</td>
                  <td>$22</td>
                  <td className="text-center">
                    <div className="custom-increment cart">
                      <div className="input-group1">
                        <span className="input-group-btn">
                          <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field aria-label='minus'>
                            <span><i className="fas fa-minus" /></span>
                          </button>
                        </span>
                        <input type="text" id="quantity2" name="quantity2" className=" input-number" defaultValue={10} aria-label='amount' />
                        <span className="input-group-btn">
                          <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field aria-label='plus'>
                            <span><i className="fas fa-plus" /></span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">$22</td>
                  <td className="text-end">
                    <div className="table-action">
                      <DeleteForeverIcon sx={{ color: 'crimson', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 className="table-avatar">
                      <Link href="/pharmacy/product-description" className="avatar avatar-sm me-2">
                        <img className="avatar-img" src={Product2} alt="User Image" /></Link>
                    </h2>
                    <Link href="/pharmacy/product-description">Dantotate Dantodazole</Link>
                  </td>
                  <td>978656</td>
                  <td>$10</td>
                  <td className="text-center">
                    <div className="custom-increment cart">
                      <div className="input-group1">
                        <span className="input-group-btn">
                          <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field aria-label='minus'>
                            <span><i className="fas fa-minus" /></span>
                          </button>
                        </span>
                        <input type="text" id="quantity3" name="quantity3" className=" input-number" defaultValue={10} aria-label='amount' />
                        <span className="input-group-btn">
                          <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field aria-label='plus'>
                            <span><i className="fas fa-plus" /></span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">$10</td>
                  <td className="text-end">
                    <div className="table-action">
                      <DeleteForeverIcon sx={{ color: 'crimson', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 className="table-avatar">
                      <Link href="/pharmacy/product-description" className="avatar avatar-sm me-2"><img className="avatar-img" src={Product3} alt="User Image" /></Link>
                    </h2>
                    <Link href="/pharmacy/product-description">Alispirox Aerorenone</Link>
                  </td>
                  <td>543252</td>
                  <td>$26</td>
                  <td className="text-center">
                    <div className="custom-increment cart">
                      <div className="input-group1">
                        <span className="input-group-btn">
                          <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field aria-label='minus'>
                            <span><i className="fas fa-minus" /></span>
                          </button>
                        </span>
                        <input type="text" id="quantity4" name="quantity4" className=" input-number" defaultValue={10} aria-label='amount' />
                        <span className="input-group-btn">
                          <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field aria-label='plus'>
                            <span><i className="fas fa-plus" /></span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">$26</td>
                  <td className="text-end">
                    <div className="table-action">
                      <DeleteForeverIcon sx={{ color: 'crimson', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 className="table-avatar">
                      <Link href="/pharmacy/product-description" className="avatar avatar-sm me-2">
                        <img className="avatar-img" src={Product4} alt="User Image" /></Link>
                    </h2>
                    <Link href="/pharmacy/product-description">Nitrolozin Zithrotropin</Link>
                  </td>
                  <td>634534</td>
                  <td>$12</td>
                  <td className="text-center">
                    <div className="custom-increment cart">
                      <div className="input-group1">
                        <span className="input-group-btn">
                          <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field aria-label='minus'>
                            <span><i className="fas fa-minus" /></span>
                          </button>
                        </span>
                        <input type="text" id="quantity5" name="quantity5" className=" input-number" defaultValue={10} aria-label='amount' />
                        <span className="input-group-btn">
                          <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field aria-label='plus'>
                            <span><i className="fas fa-plus" /></span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">$12</td>
                  <td className="text-end">
                    <div className="table-action">
                      <DeleteForeverIcon sx={{ color: 'crimson', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default CartTable;