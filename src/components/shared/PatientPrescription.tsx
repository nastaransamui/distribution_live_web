/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useMemo, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DoctThumb2, DoctThumb8, DoctThumb9, DoctThumb10 } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';

export interface PrisValueType {
  id: number;
  date: string;
  name: string;
  doctorName: string;
  doctorImage: string;
  speciality: string;
}

const PatientPrescription: FC<{ userType: 'patient' | 'doctor' }> = (({ userType }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const presRef = useRef<any>(null)
  const router = useRouter();
  const [prisData, setPrisData] = useState<PrisValueType[]>([
    { id: 0, name: "Prescription", date: dayjs('27 Sep 2019').format('DD MMM YYYY'), doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, speciality: 'Dental' },
    { id: 1, name: "Prescription", date: dayjs("1 Nov 2019").format('DD MMM YYYY'), doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, speciality: 'Dental' },
    { id: 2, name: "Prescription", date: dayjs("3 Nov 2019").format('DD MMM YYYY'), doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, speciality: 'Cardiology' },
    { id: 3, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, speciality: 'Urology' },
    { id: 4, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Marvin Campbell', doctorImage: DoctThumb2, speciality: 'Ophthalmology' },
    { id: 5, name: "Prescription", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), doctorName: 'Dr. Katharine Berthold', doctorImage: DoctThumb8, speciality: 'Orthopaedics' },
  ])

  const prisColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'date',
      headerName: "Date",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: "Name",
      width: 150,
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
              <small>  {row.speciality}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "Action",
      headerAlign: 'center',
      flex: matches ? 0 : 1,
      getActions: (params: GridRowParams) => {
        if (userType == 'patient') {
          return [
            <GridActionsCellItem key={params.row.toString()} icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
            <GridActionsCellItem onClick={() => {
              router.push('/patient/dashboard/see-prescription')
            }} key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
          ]
        } else {
          return [
            <GridActionsCellItem key={params.row.toString()} icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
            <GridActionsCellItem key={params.row.toString()} icon={
              <Edit sx={{ color: theme.palette.primary.main }} />} onClick={() => {
                router.push('/doctors/dashboard/editprescription')
              }} label="Edit" />,
            <GridActionsCellItem key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
          ]
        }
      }
    }
  ]
  const [prisPaginationModel, setPrisPaginationModel] = useState({
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
                autoHeight
                rows={prisData}
                rowCount={prisData.length}
                ref={presRef}
                // localeText={muiLocaleText()}
                columns={prisColumns}
                disableRowSelectionOnClick
                paginationModel={prisPaginationModel}
                onPaginationModelChange={setPrisPaginationModel}
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

export default PatientPrescription;