/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DoctThumb2, DoctThumb8, DoctThumb9, DoctThumb10 } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import Chip from '@mui/material/Chip';

export interface ValueType {
  id: number;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage: string;
  apptDate: string;
  bookingDate: string;
  amount: string;
  followUp: string;
  status?: string;
}

const PatientAppointment: FC<{ userType: 'patient' | 'doctor' }> = (({ userType }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const grdiRef = useRef<any>(null)
  const [data, setData] = useState<ValueType[]>([
    { id: 0, doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, doctorSpeciality: 'Dental', apptDate: dayjs('27 Sep 2019').format('DD MMM YYYY'), bookingDate: dayjs('27 Sep 2019').format('DD MMM YYYY'), followUp: dayjs('27 Sep 2019').format('DD MMM YYYY'), amount: '160', status: 'Cancelled' },
    { id: 1, doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, doctorSpeciality: 'Dental', apptDate: dayjs("1 Nov 2019").format('DD MMM YYYY'), bookingDate: dayjs("1 Nov 2019").format('DD MMM YYYY'), followUp: dayjs("1 Nov 2019").format('DD MMM YYYY'), amount: '450', status: 'Confirm' },
    { id: 2, doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, doctorSpeciality: 'Cardiology', apptDate: dayjs("3 Nov 2019").format('DD MMM YYYY'), bookingDate: dayjs("3 Nov 2019").format('DD MMM YYYY'), followUp: dayjs("3 Nov 2019").format('DD MMM YYYY'), amount: '275', status: 'Completed' },
    { id: 3, doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, doctorSpeciality: 'Urology', apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), bookingDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), followUp: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: '690', status: 'Completed' },
    { id: 4, doctorName: 'Dr. Marvin Campbell', doctorImage: DoctThumb2, doctorSpeciality: 'Ophthalmology', apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), bookingDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), followUp: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: '450', status: 'Pending' },
    { id: 5, doctorName: 'Dr. Katharine Berthold', doctorImage: DoctThumb8, doctorSpeciality: 'Orthopaedics', apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), bookingDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), followUp: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: '600', status: 'Confirm' },
  ])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'doctorName',
      headerName: "Doctor Name",
      width: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="avatar avatar-sm me-2">
              <img className="avatar-img rounded-circle" src={row.doctorImage} alt="User Image" />
            </span>
            <Stack >
              <Link href="/doctors/profile" style={{ marginBottom: -20, zIndex: 1 }}>{row.doctorName}</Link><br />
              <small>  {row.doctorSpeciality}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: 'apptDate',
      headerName: "Appt Date",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.apptDate).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.apptDate).format(` h:mm A`)}</span>
            </Stack>
          </>
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
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.apptDate).format(`MMM D, YYYY`)}</span>
          </>
        )
      }
    },
    {
      field: 'amount',
      headerName: "Amount",
      width: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {"$ " + row.amount}
          </>
        )
      }
    },
    {
      field: 'followUp',
      headerName: "Follow Up",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.followUp).format(`MMM D, YYYY`)}</span>
          </>
        )
      }
    },
    {
      field: 'status',
      headerName: "Status",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Chip color={
              row.status == 'Confirm' ? "success"
                : row.status == 'Cancelled' ? 'error'
                  : row.status == 'Pending' ? 'warning'
                    : 'primary'
            } label={row.status} size="small" />
          </>
        )
      }
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
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
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  return (
    <Fragment>
      <div className="tab-content pt-0" style={muiVar}>
        <div className="card card-table mb-0">
          <div className="card-body">
            <div className="table-responsive">
              <DataGrid
                rows={data}
                rowCount={data.length}
                ref={grdiRef}
                // localeText={muiLocaleText()}
                columns={columns}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
                showCellVerticalBorder
                isRowSelectable={(params: GridRowParams) => params.row.disabled}
                showColumnVerticalBorder
                sx={{
                  ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                    "marginTop": "1em",
                    "marginBottom": "1em"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default PatientAppointment;