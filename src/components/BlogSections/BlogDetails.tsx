/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { BlogIMG02, IMG_th02, PatientImg1, PatientImg2, PatientImg3, PatientImg4 } from '../../../public/assets/imagepath';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField'



const BlogDetails: FC = (() => {
  const { muiVar } = useScssVar();
  var twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  var lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7)

  var twoWeekAgo = new Date();
  twoWeekAgo.setDate(twoWeekAgo.getDate() - 14)

  var lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30)

  var twoMonthAgo = new Date();
  twoMonthAgo.setDate(twoMonthAgo.getDate() - 60)

  return (
    <Fragment>
      <div className="col-lg-8 col-md-12" style={muiVar}>
        <div className="blog-view">
          <div className="blog blog-single-post">
            <div className="blog-image">
              <Link href="#0">
                <img alt="" src={BlogIMG02} className="img-fluid" />
              </Link>
            </div>
            <h3 className="blog-title">
              Doccure – Making your clinic painless visit?
            </h3>
            <div className="blog-info clearfix">
              <div className="post-left">
                <ul>
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th02} alt="Post Author" />
                        <span>Dr. Darren Elder</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-calendar"></i>{dayjs().format(`D MMM YYYY`)}
                  </li>
                  <li>
                    <i className="far fa-comments"></i>12 Comments
                  </li>
                  <li>
                    <i className="fa fa-tags"></i>Health Tips
                  </li>
                </ul>
              </div>
            </div>
            <div className="blog-content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit
                voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et
                quasi architecto beatae vitae dicta sunt explicabo. Nemo
                enim ipsam voluptatem quia voluptas sit aspernatur aut
                odit aut fugit, sed quia consequuntur magni dolores eos
                qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius
                modi tempora incidunt ut labore et dolore magnam aliquam
                quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat
                quo voluptas nulla pariatur?
              </p>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus
                qui blanditiis praesentium voluptatum deleniti atque
                corrupti quos dolores et quas molestias excepturi sint
                occaecati cupiditate non provident, similique sunt in
                culpa qui officia deserunt mollitia animi, id est laborum
                et dolorum fuga. Et harum quidem rerum facilis est et
                expedita distinctio. Nam libero tempore, cum soluta nobis
                est eligendi optio cumque nihil impedit quo minus id quod
                maxime placeat facere possimus, omnis voluptas assumenda
                est, omnis dolor repellendus. Temporibus autem quibusdam
                et aut officiis debitis aut rerum necessitatibus saepe
                eveniet ut et voluptates repudiandae sint et molestiae non
                recusandae. Itaque earum rerum hic tenetur a sapiente
                delectus, ut aut reiciendis voluptatibus maiores alias
                consequatur aut perferendis doloribus asperiores repellat.
              </p>
            </div>
          </div>

          <div className="card blog-share clearfix">
            <div className="card-header">
              <h4 className="card-title">Share the post</h4>
            </div>
            <div className="card-body">
              <ul className="social-share">
                <li>
                  <Link href="#0" title="Facebook">
                    <i className="fab fa-facebook"></i>
                  </Link>
                </li>
                <li>
                  <Link href="#0" title="Twitter">
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link href="#0" title="Linkedin">
                    <i className="fab fa-linkedin"></i>
                  </Link>
                </li>
                <li>
                  <Link href="#0" title="Google Plus">
                    <i className="fab fa-google-plus"></i>
                  </Link>
                </li>
                <li>
                  <Link href="#0" title="Youtube">
                    <i className="fab fa-youtube"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="card author-widget clearfix">
            <div className="card-header">
              <h4 className="card-title">About Author</h4>
            </div>
            <div className="card-body">
              <div className="about-author">
                <div className="about-author-img">
                  <div className="author-img-wrap">
                    <Link href="/doctors/search">
                      <img
                        className="img-fluid rounded-circle"
                        alt=""
                        src={IMG_th02}
                      />
                    </Link>
                  </div>
                </div>
                <div className="author-details">
                  <Link
                    href="/doctors/search"
                    className="blog-author-name"
                  >
                    Dr. Darren Elder
                  </Link>
                  <p className="mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card blog-comments clearfix">
            <div className="card-header">
              <h4 className="card-title">Comments (12)</h4>
            </div>
            <div className="card-body pb-0">
              <ul className="comments-list">
                <li>
                  <div className="comment">
                    <div className="comment-author">
                      <img className="avatar" alt="" src={PatientImg1} />
                    </div>
                    <div className="comment-block">
                      <span className="comment-by">
                        <span className="blog-author-name">
                          Michelle Fairfax
                        </span>
                      </span>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Nam viverra euismod odio, gravida
                        pellentesque urna varius vitae, gravida
                        pellentesque urna varius vitae. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit.
                      </p>
                      <p className="blog-date">{dayjs(twoDaysAgo.toString()).format(`D MMM YYYY`)}</p>
                      <Link href="#0" className="comment-btn">
                        <i className="fas fa-reply"></i> Reply
                      </Link>
                    </div>
                  </div>
                  <ul className="comments-list reply">
                    <li>
                      <div className="comment">
                        <div className="comment-author">
                          <img className="avatar" alt="" src={PatientImg2} />
                        </div>
                        <div className="comment-block">
                          <span className="comment-by">
                            <span className="blog-author-name">
                              Gina Moore
                            </span>
                          </span>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Nam viverra euismod odio,
                            gravida pellentesque urna varius vitae,
                            gravida pellentesque urna varius vitae.
                          </p>
                          <p className="blog-date">{dayjs(lastWeek.toString()).format(`D MMM YYYY`)}</p>
                          <Link href="#0" className="comment-btn">
                            <i className="fas fa-reply"></i> Reply
                          </Link>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="comment">
                        <div className="comment-author">
                          <img className="avatar" alt="" src={PatientImg2} />
                        </div>
                        <div className="comment-block">
                          <span className="comment-by">
                            <span className="blog-author-name">
                              Carl Kelly
                            </span>
                          </span>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Nam viverra euismod odio,
                            gravida pellentesque urna varius vitae,
                            gravida pellentesque urna varius vitae.
                          </p>
                          <p className="blog-date">{dayjs(lastMonth.toString()).format(`D MMM YYYY`)}</p>
                          <Link href="#0" className="comment-btn">
                            <i className="fas fa-reply"></i> Reply
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="comment">
                    <div className="comment-author">
                      <img className="avatar" alt="" src={PatientImg3} />
                    </div>
                    <div className="comment-block">
                      <span className="comment-by">
                        <span className="blog-author-name">
                          Elsie Gilley
                        </span>
                      </span>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit.
                      </p>
                      <p className="blog-date"> {dayjs(twoMonthAgo.toString()).format(`D MMM YYYY`)}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="comment">
                    <div className="comment-author">
                      <img className="avatar" alt="" src={PatientImg4} />
                    </div>
                    <div className="comment-block">
                      <span className="comment-by">
                        <span className="blog-author-name">
                          Joan Gardner
                        </span>
                      </span>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit.
                      </p>
                      <p className="blog-date"> {dayjs(twoMonthAgo.toString()).format(`D MMM YYYY`)}</p>
                      <Link href="#0" className="comment-btn">
                        <i className="fas fa-reply"></i> Reply
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="card new-comment clearfix">
            <div className="card-header">
              <h4 className="card-title">Leave Comment</h4>
            </div>
            <div className="card-body">
              <form noValidate>

                <div className="form-group">
                  <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    defaultValue=""
                    autoComplete='off'
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    required
                    id="outlined-required"
                    label="Email Address"
                    defaultValue=""
                    autoComplete='off'
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    required
                    id="outlined-required"
                    label="Comments"
                    defaultValue=""
                    autoComplete='off'
                    fullWidth
                    multiline
                    minRows={4}
                  />
                </div>
                <div >
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="btn btn-primary "
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
});

export default BlogDetails;