/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { PatientImg, PatientImg3, PatientImg4, PatientImg5, PatientImg6, PatientImg7 } from '@/public/assets/imagepath';
import Link from 'next/link';

const Reviews: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="doc-review review-listing" >
          <ul className="comments-list">
            <li>
              <div className="comment">
                <img
                  className="avatar avatar-sm rounded-circle"
                  alt="User Image"
                  src={PatientImg}
                />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">Richard Wilson</span>
                    <span className="comment-date">Reviewed 2 Days ago</span>
                    <div className="review-count rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                  <p className="recommended">
                    <i className="far fa-thumbs-up" /> I recommend the doctor
                  </p>
                  <p className="comment-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    Curabitur non nulla sit amet nisl tempus
                  </p>
                  <div className="comment-reply">
                    <Link className="comment-btn" href="#">
                      <i className="fas fa-reply" /> Reply
                    </Link>
                    <p className="recommend-btn">
                      <span>Recommend?</span>
                      <Link href="#" className="like-btn">
                        <i className="far fa-thumbs-up" /> Yes
                      </Link>
                      <Link href="#" className="dislike-btn">
                        <i className="far fa-thumbs-down" /> No
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <ul className="comments-reply">
                <li>
                  <div className="comment">
                    <img
                      className="avatar avatar-sm rounded-circle"
                      alt="User Image"
                      src={PatientImg6}
                    />
                    <div className="comment-body">
                      <div className="meta-data">
                        <span className="comment-author">Charlene Reed</span>
                        <span className="comment-date">
                          Reviewed 3 Days ago
                        </span>
                        <div className="review-count rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star" />
                        </div>
                      </div>
                      <p className="comment-content">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam. Curabitur
                        non nulla sit amet nisl tempus
                      </p>
                      <div className="comment-reply">
                        <Link className="comment-btn" href="#">
                          <i className="fas fa-reply" /> Reply
                        </Link>
                        <p className="recommend-btn">
                          <span>Recommend?</span>
                          <Link href="#" className="like-btn">
                            <i className="far fa-thumbs-up" /> Yes
                          </Link>
                          <Link href="#" className="dislike-btn">
                            <i className="far fa-thumbs-down" /> No
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div className="comment">
                <img
                  className="avatar avatar-sm rounded-circle"
                  alt="User Image"
                  src={PatientImg7}
                />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">Travis Trimble</span>
                    <span className="comment-date">Reviewed 4 Days ago</span>
                    <div className="review-count rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                  <p className="comment-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    Curabitur non nulla sit amet nisl tempus
                  </p>
                  <div className="comment-reply">
                    <Link className="comment-btn" href="#">
                      <i className="fas fa-reply" /> Reply
                    </Link>
                    <p className="recommend-btn">
                      <span>Recommend?</span>
                      <Link href="#" className="like-btn">
                        <i className="far fa-thumbs-up" /> Yes
                      </Link>
                      <Link href="#" className="dislike-btn">
                        <i className="far fa-thumbs-down" /> No
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="comment">
                <img
                  className="avatar rounded-circle"
                  alt="User"
                  src={PatientImg5}
                />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">Carl Kelly</span>
                    <span className="comment-date">
                      Reviewed 5 Days ago
                    </span>
                    <div className="review-count rating">
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                    </div>
                  </div>
                  <p className="comment-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation. Curabitur non nulla sit amet
                    nisl tempus
                  </p>
                  <div className="comment-reply">
                    <Link className="comment-btn" href="#0">
                      <i className="fas fa-reply"></i> Reply
                    </Link>
                    <p className="recommend-btn">
                      <span>Recommend?</span>
                      <Link href="#0" className="like-btn">
                        <i className="far fa-thumbs-up"></i> Yes
                      </Link>
                      <Link href="#0" className="dislike-btn">
                        <i className="far fa-thumbs-down"></i> No
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="comment">
                <img
                  className="avatar rounded-circle"
                  alt="User"
                  src={PatientImg3}
                />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">Michelle Fairfax</span>
                    <span className="comment-date">
                      Reviewed 6 Days ago
                    </span>
                    <div className="review-count rating">
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                    </div>
                  </div>
                  <p className="comment-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation. Curabitur non nulla sit amet
                    nisl tempus
                  </p>
                  <div className="comment-reply">
                    <Link className="comment-btn" href="#0">
                      <i className="fas fa-reply"></i> Reply
                    </Link>
                    <p className="recommend-btn">
                      <span>Recommend?</span>
                      <Link href="#0" className="like-btn">
                        <i className="far fa-thumbs-up"></i> Yes
                      </Link>
                      <Link href="#0" className="dislike-btn">
                        <i className="far fa-thumbs-down"></i> No
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="comment">
                <img
                  className="avatar rounded-circle"
                  alt="User"
                  src={PatientImg4}
                />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">Gina Moore</span>
                    <span className="comment-date">
                      Reviewed 1 Week ago
                    </span>
                    <div className="review-count rating">
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                    </div>
                  </div>
                  <p className="comment-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation. Curabitur non nulla sit amet
                    nisl tempus
                  </p>
                  <div className="comment-reply">
                    <Link className="comment-btn" href="#0">
                      <i className="fas fa-reply"></i> Reply
                    </Link>
                    <p className="recommend-btn">
                      <span>Recommend?</span>
                      <Link href="#0" className="like-btn">
                        <i className="far fa-thumbs-up"></i> Yes
                      </Link>
                      <Link href="#0" className="dislike-btn">
                        <i className="far fa-thumbs-down"></i> No
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
});

export default Reviews;