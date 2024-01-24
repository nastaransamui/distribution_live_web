/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Product, Product13, Product1, Product2, Product12, Product11, Product3, Product10, Product4, Product14, Product5, Product6, Product15, Product7, Product8 } from '../../../public/assets/imagepath';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
const ResultMain: FC = (() => {
  const { muiVar } = useScssVar();

  const [sortBy, setSortBy] = useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };
  return (
    <Fragment>
      <div className="col-md-7 col-lg-9 col-xl-9" style={muiVar}>
        <div className="row align-items-center pb-3">
          <div className="col-md-4 col-12 d-md-block d-none custom-short-by">
            <h3 className="title pharmacy-title">Medlife Medical</h3>
            <p className="doc-location mb-2 text-ellipse pharmacy-location"><i className="fas fa-map-marker-alt me-1" /> 96 Red Hawk Road Cyrus, MN 56323 </p>
            <span className="sort-title">Showing 6 of 98 products</span>
          </div>
          <div className="col-md-8 col-12 d-md-block d-none custom-short-by">
            <div className="sort-by pb-3">
              {/* <span className="sort-title">Sort by</span> */}
              <span className="sortby-fliter">
                <FormControl fullWidth>
                  <InputLabel
                    size='small' id="demo-simple-select-label">Sort by</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortBy}
                    label="Hospital"
                    fullWidth
                    onChange={handleChange} size='small'
                  >
                    <MenuItem value="Rating">Rating</MenuItem>
                    <MenuItem value="Popular">Popular</MenuItem>
                    <MenuItem value="Latest">Latest</MenuItem>
                    <MenuItem value="Free">Free</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Benzaxapine Croplex</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$19.00</span>
                    <span className="price-strike">$45.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product13} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Rapalac Neuronium</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$16.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product1} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Ombinazol Bonibamol</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$22.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product2} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Dantotate Dantodazole</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$10.00</span>
                    <span className="price-strike">$12.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product12} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Acetrace Amionel</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$7.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product11} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Ergorinex Caffeigestin</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$15.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product3} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Alispirox Aerorenone</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$26.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product10} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Lysofranil Dorzostin</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$10.00</span>
                    <span className="price-strike">$12.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product4} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Nitrolozin Zithrotropin</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$12.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product14} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Cordacriptine Mardipine</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$9.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product5} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Iconevist Ampyplex</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$16.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product6} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Alcafsteride Omebide</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$7.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product15} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Neubide Aborase</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$30.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product7} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>ITONE eye drops 10ml</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$50.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 product-custom">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/pharmacy/product-description" tabIndex={-1}>
                  <img className="img-fluid" alt="Product image" src={Product8} />
                </Link>
                <Link href="#" className="fav-btn" tabIndex={-1}>
                  <i className="far fa-bookmark" />
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title pb-4">
                  <Link href="/pharmacy/product-description" tabIndex={-1}>Antatriene Drospiletra</Link>
                </h3>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <span className="price">$10.00</span>
                    <span className="price-strike">$20.00</span>
                  </div>
                  <div className="col-lg-6 text-end">
                    <Link href="/pharmacy/cart" className="cart-icon"><i className="fas fa-shopping-cart" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 text-center">
          <Link href="#" className="btn book-btn1 mb-4">Load More</Link>
        </div>
      </div>
    </Fragment>
  )
});

export default ResultMain