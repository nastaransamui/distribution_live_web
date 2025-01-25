/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import ScrollToTop from '@/components/sections/ScrollToTop';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { DoctorPublicProfileReviewsTap } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
const Reviews: FC = (() => {
  const { bounce, muiVar } = useScssVar();

  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const router = useRouter()
  const [profile, setProfile] = useState<DoctorProfileType | null>(null);
  const [reload, setReload] = useState<boolean>(false)
  const theme = useTheme();
  useEffect(() => {
    let active = true;
    if (active && homeSocket?.current && userProfile) {
      homeSocket.current.emit(`findUserById`, { _id: userProfile?._id })
      homeSocket.current.once(`findUserByIdReturn`, (msg: { status: number, user: DoctorProfileType, reason?: string }) => {
        const { status, user, reason } = msg;
        if (status !== 200) {
          toast.error(reason || `Error ${status} find Doctor`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              router.back()
            }
          });
        } else {
          homeSocket.current.once(`updateFindUserById`, () => {
            setReload(!reload)
          })
          setProfile(user)
        }
      })
    }
    return () => {
      active = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, router, reload])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="doc-review review-listing" >
          {
            userProfile == null ?
              <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} />
              :
              <>
                {profile !== null && <DoctorPublicProfileReviewsTap profile={profile} />}
              </>
          }
        </div>
        <ScrollToTop />
        {/* <div className="doc-review review-listing" >
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
        </div> */}
      </div>
    </Fragment>
  )
});

export default Reviews;