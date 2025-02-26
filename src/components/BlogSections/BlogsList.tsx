/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { BlogIMG02, BlogIMG03, BlogIMG04, BlogIMG05, BlogIMG06, BlogIMG01, IMG_th01, IMG_th02, IMG_th03, IMG_th04, IMG_th05, IMG_th06 } from '../../../public/assets/imagepath';
import dayjs from 'dayjs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Head from 'next/head';

export interface BlogPropsType {
  blogView: string
}

const BlogsList: FC<BlogPropsType> = (({ blogView }) => {

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
      <Head>
        <link rel="preload" href={BlogIMG01} as="image" />
      </Head>
      {blogView == 'gridView' ? <div className="col-lg-8 col-md-12  animate__animated animate__backInUp" style={muiVar}>
        <div className="row blog-grid-row">
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG01} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th01} alt="Post Author" />
                        <span>Dr. Ruby Perrin</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(twoDaysAgo.toString()).format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    Health Care – Making your clinic painless visit?
                  </Link>
                </h3>

                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG02} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th02} alt="Post Author" />
                        <span>Dr. Darren Elder</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs().format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    What are the benefits of Online Doctor Booking?
                  </Link>
                </h3>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG03} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th03} alt="Post Author" />
                        <span>Dr. Deborah Angel</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(lastWeek.toString()).format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    Benefits of consulting with an Online Doctor
                  </Link>
                </h3>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG04} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th04} alt="Post Author" />
                        <span>Dr. Sofia Brient</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(lastMonth.toString()).format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    5 Great reasons to use an Online Doctor
                  </Link>
                </h3>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG05} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th05} alt="Post Author" />
                        <span>Dr. Marvin Campbell</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i>  {dayjs(twoMonthAgo.toString()).format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    Online Doctor Appointment Scheduling
                  </Link>
                </h3>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="blog grid-blog">
              <div className="blog-image">
                <Link href="/blog/blog-details" aria-label='blog details'>
                  <img className="img-fluid" src={BlogIMG06} alt="Post" />
                </Link>
              </div>
              <div className="blog-content">
                <ul className="entry-meta meta-item">
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th06} alt="Post Author" />
                        <span>Dr. Marvin Campbell</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(twoWeekAgo.toString()).format(`D MMM YYYY`)}
                  </li>
                </ul>
                <h3 className="blog-title">
                  <Link href="/blog/blog-details" aria-label='blog details'>
                    Online Doctor Appointment Scheduling
                  </Link>
                </h3>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur em adipiscing
                  elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> :
        <div className="col-lg-8 col-md-12  animate__animated animate__backInUp" style={muiVar}>
          <div className="blog">
            <div className="blog-image">
              <Link href="/blog/blog-details" aria-label='blog details'>
                <img className="img-fluid" src={BlogIMG01} alt="Post" />
              </Link>
            </div>
            <h3 className="blog-title">
              <Link href="/blog/blog-details" aria-label='blog details'>
                Health Care – Making your clinic painless visit?
              </Link>
            </h3>
            <div className="blog-info clearfix">
              <div className="post-left">
                <ul>
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th01} alt="Post Author" />
                        <span>Dr. Ruby Perrin</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(twoDaysAgo.toString()).format(`D MMM YYYY`)}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco sit laboris ullamco laborisut aliquip ex ea commodo
                consequat. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <Link href="/blog/blog-details" className="read-more">
                Complete Blog
              </Link>
            </div>
          </div>
          <div className="blog">
            <div className="blog-image">
              <Link href="/blog/blog-details" aria-label='blog details'>
                <img className="img-fluid" src={BlogIMG02} alt="" />
              </Link>
            </div>
            <h3 className="blog-title">
              <Link href="/blog/blog-details" aria-label='blog details'>
                What are the benefits of Online Doctor Booking?
              </Link>
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
                    <i className="far fa-clock"></i>{dayjs().format(`D MMM YYYY`)}
                  </li>
                  <li>
                    <i className="far fa-comments"></i>7 Comments
                  </li>
                  <li>
                    <i className="fa fa-tags"></i>Cardiology
                  </li>
                </ul>
              </div>
            </div>
            <div className="blog-content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco sit laboris ullamco laborisut aliquip ex ea commodo
                consequat. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <Link href="/blog/blog-details" className="read-more">
                Complete Blog
              </Link>
            </div>
          </div>
          <div className="blog">
            <div className="blog-image">
              <div className="video">
                <iframe title='youtube'
                  src="https://www.youtube.com/embed/nuVqJ_OriR8?rel=0&amp;controls=0&amp;showinfo=0"
                  width="940"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <h3 className="blog-title">
              <Link href="/blog/blog-details" aria-label='blog details'>
                Benefits of consulting with an Online Doctor
              </Link>
            </h3>
            <div className="blog-info clearfix">
              <div className="post-left">
                <ul>
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th02} alt="Post Author" />
                        <span>Dr. Deborah Angel</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(lastWeek.toString()).format(`D MMM YYYY`)}
                  </li>
                  <li>
                    <i className="far fa-comments"></i>2 Comments
                  </li>
                  <li>
                    <i className="fa fa-tags"></i>Health Care
                  </li>
                </ul>
              </div>
            </div>
            <div className="blog-content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco sit laboris ullamco laborisut aliquip ex ea commodo
                consequat. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <Link href="/blog/blog-details" className="read-more">
                Complete Blog
              </Link>
            </div>
          </div>
          <div className="blog">
            <div className="blog-image">
              <div className="video">
                <iframe
                  title='player'
                  src="https://player.vimeo.com/video/133170635"
                  width="940"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <h3 className="blog-title">
              <Link href="/blog/blog-details" aria-label='blog details'>
                5 Great reasons to use an Online Doctor
              </Link>
            </h3>
            <div className="blog-info clearfix">
              <div className="post-left">
                <ul>
                  <li>
                    <div className="post-author">
                      <Link href="/doctors/search">
                        <img src={IMG_th03} alt="Post Author" />
                        <span>Dr. Sofia Brient</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <i className="far fa-clock"></i> {dayjs(lastMonth.toString()).format(`D MMM YYYY`)}
                  </li>
                  <li>
                    <i className="far fa-comments"></i>41 Comments
                  </li>
                  <li>
                    <i className="fa fa-tags"></i>Health Tips
                  </li>
                </ul>
              </div>
            </div>
            <div className="blog-content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco sit laboris ullamco laborisut aliquip ex ea commodo
                consequat. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <Link href="/blog/blog-details" className="read-more">
                Complete Blog
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="blog-pagination" style={{ display: 'flex', justifyContent: 'center', marginBottom: 60 }}>
                <Stack spacing={2}>
                  <Pagination count={3} variant="outlined" shape="rounded" color="primary" />
                </Stack>
              </div>
            </div>
          </div>
        </div>}
    </Fragment>
  )
})


export default BlogsList;