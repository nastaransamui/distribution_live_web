/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import StickyBox from "react-sticky-box";
import Link from 'next/link';
import { BlogIMG02, BlogIMG03, BlogIMG04, BlogIMG05, BlogIMG06, BlogIMG01, IMG_th01, IMG_th02, IMG_th03, IMG_th04, IMG_th05, IMG_th06 } from '../../../public/assets/imagepath';
import TextField from '@mui/material/TextField'
import InputAdornment from "@mui/material/InputAdornment";
import FeatherIcon from "feather-icons-react";
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { useRouter } from 'next/router';

export interface SlideProps {
  blogView?: string;
  setBlogView?: Function;
}

const BlogStickySide: FC<SlideProps> = (({ blogView, setBlogView }) => {
  const { muiVar } = useScssVar();
  const router = useRouter();

  return (
    <Fragment>
      <div className="col-lg-4 col-md-12 sidebar-right theiaStickySidebar" style={muiVar}>
        <StickyBox offsetTop={20} offsetBottom={20}>
          {!router.pathname.endsWith('/blog-details') && <BlogViewType blogView={blogView} setBlogView={setBlogView} />}
          <BlogListSearch />
          <LastestBlog />
          <CategoryWidget />
          <TagsWidget />
        </StickyBox>
      </div>
    </Fragment>
  )
});

export default BlogStickySide;


const BlogListSearch: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <div className="card search-widget" style={muiVar}>
      <div className="card-body">
        <form className="search-form">
          <div className="input-group">
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Search..."
              defaultValue=""
              autoComplete='off'
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <i ><FeatherIcon icon="search" style={{ color: theme.palette.secondary.main }} /></i>
                </InputAdornment>
              }}
            />
          </div>
        </form>
      </div>
    </div>
  )
})
const BlogViewType: FC<SlideProps> = (({ blogView, setBlogView }) => {
  const { muiVar } = useScssVar();
  return (
    <div className="card search-widget" style={muiVar}>
      <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>List View</Typography>
          <AntSwitch checked={blogView !== 'listView'} inputProps={{ 'aria-label': 'ant design' }} onChange={() => {
            if (setBlogView !== undefined) {
              setBlogView((prevState: string) => prevState == 'listView' ? 'gridView' : 'listView')
            }
          }} />
          <Typography>Grid View</Typography>
        </Stack>
      </div>
    </div>
  )
})

const LastestBlog: FC = (() => {
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
    <div className="card post-widget" style={muiVar}>
      <div className="card-header">
        <h4 className="card-title">Latest Posts</h4>
      </div>
      <div className="card-body">
        <ul className="latest-posts">
          <li>
            <div className="post-thumb">
              <Link href="/blog/blog-details">
                <img className="img-fluid" src={BlogIMG01} alt="" />
              </Link>
            </div>
            <div className="post-info">
              <h4>
                <Link href="/blog/blog-details">Doccure – Making your clinic painless visit?</Link>
              </h4>
              <p>{dayjs().format(`D MMM YYYY`)}</p>
            </div>
          </li>
          <li>
            <div className="post-thumb">
              <Link href="/blog/blog-details">
                <img className="img-fluid" src={BlogIMG02} alt="" />
              </Link>
            </div>
            <div className="post-info">
              <h4>
                <Link href="/blog/blog-details">What are the benefits of Online Doctor Booking? </Link>
              </h4>
              <p>{dayjs(twoDaysAgo.toString()).format(`D MMM YYYY`)}</p>
            </div>
          </li>
          <li>
            <div className="post-thumb">
              <Link href="/blog/blog-details">
                <img className="img-fluid" src={BlogIMG03} alt="" />
              </Link>
            </div>
            <div className="post-info">
              <h4>
                <Link href="/blog/blog-details">Benefits of consulting with an Online Doctor  </Link>
              </h4>
              <p>{dayjs(lastWeek.toString()).format(`D MMM YYYY`)}</p>
            </div>
          </li>
          <li>
            <div className="post-thumb">
              <Link href="/blog/blog-details">
                <img className="img-fluid" src={BlogIMG04} alt="" />
              </Link>
            </div>
            <div className="post-info">
              <h4>
                <Link href="/blog/blog-details">5 Great reasons to use an Online Doctor </Link>
              </h4>
              <p> {dayjs(lastMonth.toString()).format(`D MMM YYYY`)}</p>
            </div>
          </li>
          <li>
            <div className="post-thumb">
              <Link href="/blog/blog-details">
                <img className="img-fluid" src={BlogIMG05} alt="" />
              </Link>
            </div>
            <div className="post-info">
              <h4>
                <Link href="/blog/blog-details">Online Doctor Appointment Scheduling</Link>
              </h4>
              <p> {dayjs(twoMonthAgo.toString()).format(`D MMM YYYY`)}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
})

const CategoryWidget: FC = (() => {
  const { muiVar } = useScssVar();
  return (
    <div className="card category-widget" style={muiVar}>
      <div className="card-header">
        <h4 className="card-title">Blog Categories</h4>
      </div>
      <div className="card-body">
        <ul className="categories">
          <li><Link href="#0">Cardiology <span>(62)</span></Link></li>
          <li><Link href="#0">Health Care <span>(27)</span></Link></li>
          <li><Link href="#0">Nutritions <span>(41)</span></Link></li>
          <li><Link href="#0">Health Tips <span>(16)</span></Link></li>
          <li><Link href="#0">Medical Research <span>(55)</span></Link></li>
          <li><Link href="#0">Health Treatment <span>(07)</span></Link></li>
        </ul>
      </div>
    </div>
  )
})

const TagsWidget: FC = (() => {
  const { muiVar } = useScssVar();
  return (
    <div className="card tags-widget" style={muiVar}>
      <div className="card-header">
        <h4 className="card-title">Tags</h4>
      </div>
      <div className="card-body">
        <ul className="tags">
          <li><Link href="#" className="tag">Children</Link></li>
          <li><Link href="#" className="tag">Disease</Link></li>
          <li><Link href="#" className="tag">Appointment</Link></li>
          <li><Link href="#" className="tag">Booking</Link></li>
          <li><Link href="#" className="tag">Kids</Link></li>
          <li><Link href="#" className="tag">Health</Link></li>
          <li><Link href="#" className="tag">Family</Link></li>
          <li><Link href="#" className="tag">Tips</Link></li>
          <li><Link href="#" className="tag">Shedule</Link></li>
          <li><Link href="#" className="tag">Treatment</Link></li>
          <li><Link href="#" className="tag">Dr</Link></li>
          <li><Link href="#" className="tag">Clinic</Link></li>
          <li><Link href="#" className="tag">Online</Link></li>
          <li><Link href="#" className="tag">Health Care</Link></li>
          <li><Link href="#" className="tag">Consulting</Link></li>
          <li><Link href="#" className="tag">Doctors</Link></li>
          <li><Link href="#" className="tag">Neurology</Link></li>
          <li><Link href="#" className="tag">Dentists</Link></li>
          <li><Link href="#" className="tag">Specialist</Link></li>
          <li><Link href="#" className="tag">Doccure</Link></li>
        </ul>
      </div>
    </div>
  )
})


const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: theme.palette.background.paper,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));
