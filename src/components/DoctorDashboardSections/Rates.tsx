/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTheme } from "@mui/material/styles";
import { RepliesType, ReviewTypes } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { toast } from 'react-toastify';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, StyledBadge } from './ScheduleTiming';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import RenderExpandableCell from '../shared/RenderExpandableCell';


const Rates: FC = () => {
  const { muiVar, bounce } = useScssVar();
  dayjs.extend(relativeTime);
  const theme = useTheme();

  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const ratingRef = useRef<any>(null)
  const [ratingRecords, setRatingRecords] = useState<ReviewTypes[] | []>([])
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rowRatingCount, setRowRatingCount] = useState<number>(0)
  const perPage = 5;
  const [dataGridRatingFilters, setDataGridRatingFilters] = useState({
    limit: perPage,
    skip: 0,
  });
  const [ratingPaginationModel, setRatingPaginationModel] = useState({
    pageSize: perPage,
    page: 0,
  });

  useEffect(() => {
    if (userProfile) {
      if (homeSocket?.current) {
        homeSocket.current.emit('getDoctorReviews',
          {
            doctorId: userProfile?._id,
            limit: dataGridRatingFilters.limit,
            skip: dataGridRatingFilters.skip
          })
        homeSocket.current.once('getDoctorReviewsReturn', (msg: { status: number, doctorReviews: ReviewTypes[], totalReviews: number, message?: string }) => {
          if (msg?.status !== 200) {
            toast.error(msg?.message || 'getDoctorReviews error', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              onClose: () => {
              }
            });
          } else if (msg?.status == 200) {
            const { doctorReviews, totalReviews } = msg;
            setRatingRecords((prevState) => {
              prevState = []
              prevState = [...doctorReviews];
              return prevState;
            })
            setRowRatingCount(totalReviews)
            homeSocket.current.once(`updateGetDoctorReviews`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, userProfile, dataGridRatingFilters])

  const handleChangeRatingRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRatingPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowRatingCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowRatingCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowRatingCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridRatingFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowRatingCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowRatingCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowRatingCount / parseInt(event.target.value, 10))) - 1
        }
      }
      let limit = parseInt(event.target.value, 10) * (maximuPage == 0 ? 1 : maximuPage)
      return {
        limit: limit,
        skip: maximuPage <= 0 ? 0 : limit - parseInt(event.target.value, 10)
      }
    })
  };

  const handleChangeRatingPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridRatingFilters((prevState) => {
      return {
        limit: ratingPaginationModel.pageSize !== ratingPaginationModel.pageSize ? ratingPaginationModel.pageSize : ratingPaginationModel.pageSize * value,
        skip: (value - 1) * ratingPaginationModel.pageSize,
      }
    })
    setRatingPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }

  const ratingColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        return `#${params?.value}`
      }
    },
    {
      field: 'role',
      headerName: "Author",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        const { value } = params
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    {
      field: 'rating',
      headerName: "Rating",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell(params: GridRenderCellParams) {
        const { value } = params;
        return (
          <>
            <Rating
              name="read-only"
              precision={0.5}
              value={value}
              readOnly
              size="small"
              sx={{
                color: 'warning.main', // Using Material-UI theme color (yellow)
              }}
            />
          </>

        )
      }
    },
    {
      field: 'recommend',
      headerName: "Recommend",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell(params: GridRenderCellParams) {
        const { value } = params;
        return (
          <>
            {value ? <span className="recommend-btn">
              <Link href="" className={`like-btn 'like-btn-active`} style={{ pointerEvents: 'none' }} onClick={(e) => { e.preventDefault() }}>
                <i className="far fa-thumbs-up" /> Yes
              </Link>
            </span> :
              <span className="recommend-btn">
                <Link href="" className={`dislike-btn dislike-btn-active`} style={{ pointerEvents: 'none' }} onClick={(e) => { e.preventDefault() }}>
                  <i className="far fa-thumbs-down" /> No
                </Link>
              </span>
            }
          </>
        )
      }
    },
    {
      field: '_id',
      headerName: `Author Name`,
      width: 350,
      align: 'left',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const profileImage =
          row?.role == 'patient' ?
            row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage :
            row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage
        const online = row?.patientProfile?.online || false;
        return (
          <>
            {
              row?.role == 'doctors' ?
                <Fragment>
                  <Link aria-label='link'
                    className="avatar mx-2"
                    href={`/doctors/profile/${btoa(row?.doctorProfile?._id)}`} target='_blank'>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      online={online}
                    >
                      <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                        <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                      </Avatar>
                    </StyledBadge>
                  </Link>
                  <Stack>
                    <Link aria-label='link' href={`/doctors/profile/${btoa(row?.doctorProfile?._id)}`}
                      target='_blank'
                      style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                      {`Dr.${row?.doctorProfile?.fullName}`}
                    </Link>
                    {row?.doctorProfile?.specialities?.[0]?.specialities}
                  </Stack>
                </Fragment> :
                <Fragment>
                  <Link aria-label='link' className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row?.patientProfile?._id)}`} target='_blank'>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      online={online}
                    >
                      <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                        <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                      </Avatar>
                    </StyledBadge>
                  </Link>
                  <Stack>
                    <Link aria-label='link' href={`/doctors/dashboard/patient-profile/${btoa(row?.patientProfile?._id)}`}
                      target='_blank'
                      style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                      {`${row?.patientProfile?.gender !== "" ? `${row?.patientProfile?.gender}.` : ``} ${row?.patientProfile?.fullName}`}
                    </Link>
                    {row?.patientProfile?.userName}
                  </Stack>
                </Fragment>
            }
          </>
        )
      }
    },
    {
      field: 'title',
      headerName: "Title",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        return params?.value
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <RenderExpandableCell {...params} />
        )
      },
    },
    {
      field: 'body',
      headerName: "Message",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        return params?.value
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <RenderExpandableCell {...params} />
        )
      },
    },
    {
      field: 'replies',
      headerName: "Replies",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        const { value } = params;
        return value.length > 0 ? value.map((obj: RepliesType) => {
          // Map over each key-value pair in the object
          const formattedEntries = Object.entries(obj)
            .filter(([key, val]) => {
              if (key === 'title' || key === 'body' || key == 'createdAt') {
                return true
              } else if (key == 'patientProfile') {
                return val !== null
              } else if (key == 'doctorProfile') {
                return val !== null
              } else {
                return false
              }

            })
            .map(([key, val]) => {
              if (key == "createdAt") {
                val = `${dayjs(val as Date).format(`YYYY MMM DD HH:mm`)}`
              }
              if (key == 'patientProfile') {
                val = `${val?.gender == "" ? "" : `${val?.gender}.`}${val?.fullName}`
                key = `author Name`
              }
              if (key == 'doctorProfile') {
                val = `Dr.${val?.fullName}`
                key = `author Name`
              }
              return `${key.charAt(0).toLocaleUpperCase() + key.slice(1)}: ${val}`
            })
            .join("\n"); // Join each key-value pair with a newline

          // Add a separator after each object
          return `${formattedEntries}\n------------------------------------`;
        }).join("\n") : `${params?.value.length} ${params?.value.length <= 1 ? 'reply' : 'replies'}`;
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <RenderExpandableCell {...params} />
        )
      },
    },
    {
      field: 'createdAt',
      headerName: "Wrote",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        return `Reviewed ${dayjs(params.value).fromNow()}`;
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <RenderExpandableCell {...params} />
        )
      },
    },
    {
      field: 'updatedAt',
      headerName: "Updated",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter(params: GridValueGetterParams) {
        return `Updated ${dayjs(params.value).fromNow()}`;
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <RenderExpandableCell {...params} />
        )
      },
    }
  ]

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        {
          isLoading ?
            <CircleToBlockLoading color={theme.palette.primary.main} size="small"
              style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} /> :
            <>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="card-title float-start">Rating Records</h4>
                  </div>
                  <div className="card-body ">
                    <div className="card card-table mb-0">
                      <div className="card-body">
                        <div className="table-responsive" style={{ height: ratingPaginationModel.pageSize == 5 ? 480 : 900, width: '100%' }}>
                          <DataGrid
                            paginationMode='server'
                            experimentalFeatures={{ ariaV7: true }}
                            slots={{
                              noResultsOverlay: CustomNoRowsOverlay,
                              noRowsOverlay: CustomNoRowsOverlay,
                              pagination: CustomPagination,
                            }}
                            slotProps={{
                              baseCheckbox: {
                                name: 'row-checkbox',
                              },
                              pagination: { //@ts-ignore
                                handleChangePage: handleChangeRatingPage,
                                handleChangeRowsPerPage: handleChangeRatingRowsPerPage,
                                count: rowRatingCount,
                                SelectProps: {
                                  inputProps: {
                                    id: 'pagination-select',
                                    name: 'pagination-select',
                                  },
                                },
                              },
                            }}
                            rowHeight={screen.height / 15.2}
                            rows={ratingRecords}
                            getRowId={(params) => params._id!}
                            rowCount={rowRatingCount}
                            ref={ratingRef}
                            columns={ratingColumns}
                            paginationModel={ratingPaginationModel}
                            pageSizeOptions={[5, 10]}
                            disableRowSelectionOnClick
                            onPaginationModelChange={setRatingPaginationModel}
                            showCellVerticalBorder
                            showColumnVerticalBorder
                            sx={{
                              ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                                "marginTop": "1em",
                                "marginBottom": "1em"
                              },
                              "&.MuiDataGrid-root .MuiDataGrid-row": {
                                backgroundColor:
                                  false ? getSelectedBackgroundColor(
                                    theme.palette.primary.dark,
                                    theme.palette.mode,
                                  ) : '',
                                '&:hover': {
                                  backgroundColor: getSelectedHoverBackgroundColor(
                                    theme.palette.primary.light,
                                    theme.palette.mode,
                                  ),
                                }
                              },
                              "& .MuiDataGrid-footerContainer": {
                                [theme.breakpoints.only("xs")]: {
                                  justifyContent: 'center',
                                  mb: 2
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
        }
      </div>
    </Fragment>
  );
}

export default Rates;
