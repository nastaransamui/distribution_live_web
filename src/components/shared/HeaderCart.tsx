/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Product_scale, Product1_scale, Product2_scale } from '@/public/assets/imagepath';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material';

const HeaderCart: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();
  const theme = useTheme()
  const [style, setStyle] = useState({})
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStyle(() =>
        router.pathname === "/home4" || router.pathname === "/eyecarehome"
          ? { background: theme.palette.secondary.dark }
          : { background: "" })
    }
  }, [theme, router])
  return (
    <Fragment>
      <li className="nav-item dropdown noti-nav view-cart-header me-3" style={muiVar}>
        <Link
          href="#"
          className="dropdown-toggle nav-link p-0 position-relative"
          data-bs-toggle="dropdown"
        >
          <i className="fa-solid fa-cart-shopping  imgColorSecondary" />{" "}
          <small className="unread-msg1" style={style}>7</small>
        </Link>
        <div className="dropdown-menu notifications dropdown-menu-end">
          <div className="shopping-cart">
            <ul className="shopping-cart-items list-unstyled">
              <li className="clearfix">
                <div className="close-icon">
                  <i className="fa-solid fa-circle-xmark imgColorSecondary" />
                </div>
                <Link href="/pharmacy/product-description">
                  <img
                    className="avatar-img rounded"
                    src={Product_scale}
                    alt="User Image"
                  />
                </Link>
                <Link href="/pharmacy/product-description" className="item-name cartAnchor">
                  Benzaxapine Croplex
                </Link>
                <span className="item-price">$849.99</span>
                <span className="item-quantity">Quantity: 01</span>
              </li>
              <li className="clearfix">
                <div className="close-icon">
                  <i className="fa-solid fa-circle-xmark imgColorSecondary" />
                </div>
                <Link href="/pharmacy/product-description">
                  <img
                    className="avatar-img rounded"
                    src={Product1_scale}
                    alt="User Image"
                  />
                </Link>
                <Link href="/pharmacy/product-description" className="item-name">
                  Ombinazol Bonibamol
                </Link>
                <span className="item-price">$1,249.99</span>
                <span className="item-quantity">Quantity: 01</span>
              </li>
              <li className="clearfix">
                <div className="close-icon">
                  <i className="fa-solid fa-circle-xmark imgColorSecondary" />
                </div>
                <Link href="/pharmacy/product-description">
                  <img
                    className="avatar-img rounded"
                    src={Product2_scale}
                    alt="User Image"
                  />
                </Link>
                <Link href="/pharmacy/product-description" className="item-name">
                  Dantotate Dantodazole
                </Link>
                <span className="item-price">$129.99</span>
                <span className="item-quantity">Quantity: 01</span>
              </li>
            </ul>
            <div className="booking-summary pt-3">
              <div className="booking-item-wrap">
                <ul className="booking-date">
                  <li>
                    Subtotal <span>$5,877.00</span>
                  </li>
                  <li>
                    Shipping <span>$25.00</span>
                  </li>
                  <li>
                    Tax <span>$0.00</span>
                  </li>
                  <li>
                    Total <span>$5.2555</span>
                  </li>
                </ul>
                <div className="booking-total">
                  <ul className="booking-total-list text-align">
                    <li>
                      <div className="clinic-booking pt-3">
                        <Link className="apt-btn" href="/pharmacy/cart">
                          View Cart
                        </Link>
                      </div>
                    </li>
                    <li>
                      <div className="clinic-booking pt-3">
                        <Link className="apt-btn" href="/pharmacy/product-checkout">
                          Checkout
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </Fragment>
  )
})

export default HeaderCart;