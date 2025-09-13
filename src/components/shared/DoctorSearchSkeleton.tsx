
import useScssVar from '@/hooks/useScssVar'
import { FC, } from 'react'
import Avatar from '@mui/material/Avatar'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid'

import Link from 'next/link';
import CardActions from '@mui/material/CardActions'
import CardActionArea from '@mui/material/CardActionArea'
export const DoctorListSearchSkeleton: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()

  return (
    <>
      <Grid size={{ lg: 12, md: 4, sm: 6, xs: 12 }} sx={{ mr: 2, mb: 2 }}>
        <Card sx={{
          transition: theme.transitions.create('all', { duration: 200, }),
          display: 'flex',
          flexDirection: 'row',
          borderRadius: `10px 10px 10px 10px`,
          borderColor: theme.palette.secondary.main,
          borderWidth: `2px 2px 2px 2px`,
          borderStyle: 'solid',
          position: 'relative',
          flexWrap: 'wrap',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          minHeight: 260,
        }}>
          <Grid container sx={{ minWidth: '100%' }}>
            <Grid size={{ xl: 3, lg: 2.87, md: 2.87, sm: 2, xs: 12 }}>
              <CardMedia>
                <Skeleton animation="wave" variant="rectangular" sx={{
                  bgcolor: theme.palette.background.paper,
                  width: 200,
                  height: 200,
                  borderRadius: `5px 0px 15px 0px`,
                  transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                  "&:hover": {
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    transform: "scale(1.15)",
                  },
                }}>
                  <Avatar sx={{ width: 200, }} variant="square" alt="" />
                </Skeleton>
                <ul className="clinic-gallery" >

                  {Array.from(Array(4).keys()).map((img: any, j: number) => {
                    return (
                      <li key={j}>
                        <Link href="" aria-label='clinic-gallery' onClick={(e) => {
                          e.preventDefault();
                        }} >
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width={40} height={40}
                            sx={{
                              bgcolor: theme.palette.background.paper,
                              borderRadius: '5px',
                              border: `1px solid ${theme.palette.secondary.main}`,
                            }} />
                        </Link>
                      </li>
                    )
                  })
                  }
                </ul>
              </CardMedia>
            </Grid>
            <Grid size={{ xl: 3, lg: 2.5, md: 2.5, sm: 3, xs: 12 }}>
              <CardContent sx={{
                flex: '1 0 auto',
                maxHeight: 190,
                transition: theme.transitions.create('all', { duration: 200, }),
              }}>
                {
                  Array.from(Array(5).keys()).map((i) => (
                    <Skeleton key={i}
                      animation="wave"
                      height={10}
                      width="inherit"
                      style={{ marginBottom: 6 }}
                    />
                  ))
                }
              </CardContent>
            </Grid>
            <Grid size={{ xl: 3, lg: 3, md: 2.5, sm: 3, xs: 12 }} >
              <CardContent >
                {
                  Array.from(Array(10).keys()).map((i) => (
                    <Skeleton key={i}
                      animation="wave"
                      height={10}
                      width="inherit"
                      style={{ marginBottom: 6 }}
                    />
                  ))
                }
              </CardContent>
            </Grid>
            <Grid size={{ xl: 3, lg: 3.63, md: 4.03, sm: 4, xs: 12 }}  >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', }} >
                <ul>
                  <li>
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      width="85%"
                      height={40}
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        borderRadius: '5px',
                        border: `1px solid ${theme.palette.secondary.main}`
                      }} />
                  </li>
                  <li>
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="85%"
                      style={{ marginTop: 6, }}
                    />
                  </li>
                  <li>
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="85%"
                      style={{ marginTop: 6, }}
                    />
                  </li>
                </ul>
                <div className="clinic-booking book-appoint">
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      borderRadius: '5px',
                      border: `1px solid ${theme.palette.primary.main}`,
                    }} />
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={40} sx={{ marginTop: 1, borderRadius: '5px', border: `1px solid ${theme.palette.secondary.main}`, bgcolor: theme.palette.background.paper }} />

                </div>
              </CardContent>
            </Grid>
          </Grid>
          <CardActionArea></CardActionArea>
          <CardActions disableSpacing sx={{
            flex: 1
          }}>
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
              sx={{
                border: `1px solid ${theme.palette.secondary.main}`,
                mr: 2,
                bgcolor: theme.palette.background.paper,
              }} />
            <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{
              border: `1px solid ${theme.palette.secondary.main}`,
              bgcolor: theme.palette.background.paper,
            }} />
            <Skeleton animation="wave" variant="rectangular"
              width={140}
              height={30}
              sx={{
                border: `1px solid ${theme.palette.secondary.main}`,
                marginLeft: 'auto',
                borderRadius: '5px',
                bgcolor: theme.palette.background.paper,
              }} />
          </CardActions>
        </Card>
      </Grid>
    </>
  )
})


export const DoctorGridSearchSkeleton: FC = (() => {
  const theme = useTheme()

  return (


    <Card sx={{
      // minHeight: initialGridRowHeight,
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      mb: 3,
      minWidth: '100%'
    }}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ border: `1px solid ${theme.palette.secondary.main}` }} />
        }
        action={null}
        title={<Skeleton
          animation="wave"
          height={10}
          width="80%"
          style={{ marginBottom: 6 }}
        />}
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      <CardContent sx={{ minHeight: 120 }}>
        <>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </>
      </CardContent>
    </Card>


  )
})