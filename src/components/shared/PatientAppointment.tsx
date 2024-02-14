/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DoctThumb2, DoctThumb8, DoctThumb9, DoctThumb10, doctors_profile } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import { PatientSidebarDoctorTypes } from '../DoctorDashboardSections/PatientProfileTabs';


//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { StyledBadge, getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import Pagination from '@mui/material/Pagination';
import { DoctorPatientInitialLimitsAndSkipsTypes } from '../DoctorPatientProfile/DoctorPatientProfile';
import Avatar from '@mui/material/Avatar';

const perPage = 5
const PatientAppointment: FC<PatientSidebarDoctorTypes> = (({ userType, doctorPatientProfile, setDataGridFilters, dataGridFilters, isMobile }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '70vh'
      }} />
  )



  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'dayPeriod',
        headerName: 'Day time',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        valueGetter(params: GridRenderCellParams) {
          const { value } = params
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      },

      {
        field: 'doctorProfile',
        headerName: `Doctor Name`,
        width: 250,
        minWidth: 250,
        align: 'center',
        headerAlign: 'center',
        valueFormatter(params: GridValueFormatterParams) {
          const { value } = params
          return ` Dr. ${value?.firstName} ${value?.lastName}`
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row, formattedValue } = params;
          const profileImage = row?.doctorProfile?.profileImage == '' ? doctors_profile : row?.doctorProfile?.profileImage
          const online = row?.doctorProfile?.online || false
          return (
            <>
              <Link className=" mx-2" target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`} >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                >
                  <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                    <img src={doctors_profile} alt="" className="avatar" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Link target='_blank' href={`/doctors/profile/${btoa(row.doctorId)}`}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
            </>
          )
        }
      },
      {
        field: 'selectedDate',
        headerName: `Apointment Time`,
        align: 'center',
        width: 150,
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.selectedDate}</span>
              <span className="d-block" >{params?.row?.timeSlot?.period}</span>
            </Stack>
          )
        }
      },
      {
        field: 'bookingDate',
        headerName: "Booking Date",
        width: 150,
        headerAlign: 'center',
        align: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.createdDate).format(`MMM D, YYYY HH:MM`)}</span>
            </>
          )
        }
      },
      {
        field: 'paymentType',
        headerName: `Payment status`,
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Chip
                color={row.paymentType == '' ? 'success' : 'secondary'}
                label={'paid'}
                size="small"
                sx={{ color: theme.palette.primary.contrastText }} />
            </>
          )
        }
      },
      // {
      //   field: 'amount',
      //   headerName: "Amount",
      //   width: 80,
      //   headerAlign: 'center',
      //   align: 'center',
      //   renderCell: (data: any) => {
      //     const { row } = data;
      //     return (
      //       <>
      //         {"$ " + row.amount}
      //       </>
      //     )
      //   }
      // },
      // {
      //   field: 'followUp',
      //   headerName: "Follow Up",
      //   width: 150,
      //   headerAlign: 'center',
      //   align: 'center',
      //   renderCell: (data: any) => {
      //     const { row } = data;
      //     return (
      //       <>
      //         <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.followUp).format(`MMM D, YYYY`)}</span>
      //       </>
      //     )
      //   }
      // },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        align: 'center',
        flex: isMobile ? 0 : 1,
        getActions: (params: GridRowParams) => {
          if (userType == 'patient') {
            return [
              <GridActionsCellItem key={params.row.toString()} icon={
                <i className="far fa-eye" style={{ color: theme.palette.primary.main }}></i>} onClick={() => { }} label='View' />,
              <GridActionsCellItem
                key={params.row.toString()}
                disableFocusRipple
                disableRipple
                disableTouchRipple
                onClick={() => {

                }}
                icon={<i className="fas fa-print"
                  style={{ color: theme.palette.secondary.main }}></i>} label="Print" />,
            ]
          } else {
            return [
              <GridActionsCellItem key={params.row.toString()} icon={
                <Edit sx={{ color: theme.palette.primary.main }} />} onClick={() => { }} label="Edit" />,
              <GridActionsCellItem
                key={params.row.toString()}
                disableFocusRipple
                disableRipple
                disableTouchRipple
                onClick={() => {

                }}
                icon={<i className="fas fa-print"
                  style={{ color: theme.palette.secondary.main }}></i>} label="Print" />,
            ]
          }
        }
      }
    ]
  }, [isMobile, theme.palette.primary.contrastText, theme.palette.primary.main, theme.palette.secondary.main, userType])



  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters((prevState: DoctorPatientInitialLimitsAndSkipsTypes) => {

      return {
        ...prevState,
        appointMentsLimit: perPage * value,
        appointMentsSkip: (value - 1) * perPage
      }
    })
  };

  const appointmentComponents = () => {

    return (
      <DataGrid
        autoHeight
        hideFooter
        getRowId={(params) => params._id}
        // rowHeight={typeof window == 'undefined' ? 12 : screen.height / 15.2}
        rows={doctorPatientProfile?.appointments}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        showCellVerticalBorder
        showColumnVerticalBorder
        slots={{
          // toolbar: CustomToolbar,
          noResultsOverlay: CustomNoRowsOverlay,
          noRowsOverlay: CustomNoRowsOverlay
        }}
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
          }
        }}
      />
    )
  }
  return (
    <Fragment>
      <div className="tab-content pt-0" style={muiVar}>
        {
          doctorPatientProfile == undefined ?
            <LoadingCompoenent /> :
            <>
              {
                doctorPatientProfile?.appointments.length !== 0 ?
                  <div className="card card-table mb-0">
                    <div className="card-body">
                      <div className="table-responsive">
                        {appointmentComponents()}
                      </div>
                      <Pagination
                        showFirstButton
                        showLastButton
                        hideNextButton
                        hidePrevButton
                        boundaryCount={1}
                        variant="outlined"
                        color="secondary"
                        count={Math.ceil(doctorPatientProfile?.reservations_id.length / perPage)}
                        page={dataGridFilters.appointMentsLimit / perPage}
                        sx={{
                          justifyContent: 'center',
                          display: 'flex',
                          minHeight: 70
                        }}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div> :
                  <div className='card' style={{ minHeight: '70vh', justifyContent: 'center' }}>
                    <CustomNoRowsOverlay text='No appointment' />
                  </div>
              }
            </>
        }
      </div>
    </Fragment>
  )
})

export default PatientAppointment;