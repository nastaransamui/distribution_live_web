import useScssVar from '@/hooks/useScssVar'
import { FC, } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid'


const DoctorTopSearchSkeleton: FC = (() => {
  const theme = useTheme()

  return (
    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>

      <Grid size={{ lg: 4 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        <div className="doctors-found">
          <p>
            <Skeleton
              animation="wave"
              height={20}
              width={'100%'}
            />
          </p>
        </div>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 3 }} />

      </Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column', gap: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }, mt: { xl: 0, lg: 0, md: 0, sm: 3, xs: 3 } }}>
        <Skeleton variant="rectangular" width={170} height={40} sx={{ borderRadius: '5px', border: `1px solid ${theme.palette.secondary.main}` }} />
        <div className="doctor-filter-sort">
          <Skeleton
            animation="wave"
            height={30}
            width="100%"
          />
        </div>
      </Grid>
    </Grid>
  )
})
export default DoctorTopSearchSkeleton;