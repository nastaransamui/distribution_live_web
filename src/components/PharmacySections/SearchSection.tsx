import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import TextField from '@mui/material/TextField'
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from '@mui/material';


const SearchSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="section-search-pharmacy" style={muiVar}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="banner-wrapper2">
                <div className="search-box1">
                  <form noValidate>
                    <p className="mb-0 me-3">Find a Pharmacy</p>
                    <div className="form-group search-location1 postion-relative">
                      <TextField
                        required
                        id="outlined-required"
                        label="Search Location"
                        defaultValue=""
                        size="small"
                        autoComplete='off'
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position="end">
                            <span className="search-detect" style={{
                              background: `${theme.palette.background.default} url(/assets/images/google-map.webp) no-repeat 9px center`
                            }}>Detect</span>
                          </InputAdornment>
                        }}
                      />
                    </div>
                    <button type="submit" aria-label='search' className="btn btn-primary search-btn" onClick={(e) => e.preventDefault()} style={{ marginLeft: -5 }}><i className="fas fa-search" /> <span>Search</span></button>
                  </form>
                </div>
                {/* /Search */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default SearchSection;