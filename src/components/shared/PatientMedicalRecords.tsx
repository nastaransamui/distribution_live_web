/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DoctThumb2, DoctThumb8, DoctThumb9, DoctThumb10 } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import GetAppIcon from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';

export interface RecordValueType {
  id: string;
  date: string;
  description: string;
  attachment: string;
  doctorName: string;
  doctorImage: string;
  speciality: string;
}

const PatientMedicalRecords: FC<{ userType: 'patient' | 'doctor' }> = (({ userType }) => {
  const { muiVar } = useScssVar();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const presRef = useRef<any>(null)
  const [recordData, setRecordData] = useState<RecordValueType[]>([
    { id: '#MR-0010', description: "Dental Filling", date: dayjs('27 Sep 2019').format('DD MMM YYYY'), attachment: 'dental-test.pdf', doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, speciality: 'Dental' },
    { id: '#MR-009', description: "Teeth Cleaning", date: dayjs("1 Nov 2019").format('DD MMM YYYY'), attachment: 'dental-test.pdf', doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, speciality: 'Dental' },
    { id: '#MR-008', description: "General Checkup", date: dayjs("3 Nov 2019").format('DD MMM YYYY'), attachment: 'cardio-test.pdf', doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, speciality: 'Cardiology' },
    { id: '#MR-007', description: "General Test", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), attachment: 'general-test.pdf', doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, speciality: 'Urology' },
    { id: '#MR-006', description: "Leg Pain", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), attachment: 'eye-test.pdf', doctorName: 'Dr. Marvin Campbell', doctorImage: DoctThumb2, speciality: 'Ophthalmology' },
    { id: '#MR-009', description: "Dental Filling", date: dayjs("16 Jun 2019").format('DD MMM YYYY'), attachment: 'ortho-test.pdf', doctorName: 'Dr. Katharine Berthold', doctorImage: DoctThumb8, speciality: 'Orthopaedics' },
  ])

  const recordColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'date',
      headerName: "Date",
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(`MMM D, YYYY`)}</span>
          </>
        )
      }
    },
    {
      field: 'description',
      headerName: "Description",
      width: 120,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'attachment',
      headerName: "Attachment",
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <IconButton sx={{ mt: 1, mb: -1 }} disableFocusRipple disableRipple disableTouchRipple >
                <GetAppIcon sx={{ color: theme.palette.primary.main }} />
              </IconButton>
              <small style={{ marginBottom: 7 }}>{row.attachment}</small>
            </Stack>
          </>
        )
      }
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
              <Link href="/doctors/search" style={{ marginBottom: -20, zIndex: 1 }}>{row.doctorName}</Link><br />
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
        return [
          <GridActionsCellItem key={params.row.toString()} icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
          <GridActionsCellItem key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
        ]
      }
    }
  ]
  const [recordPaginationModel, setRecordPaginationModel] = useState({
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
                rows={recordData}
                rowCount={recordData.length}
                ref={presRef}
                // localeText={muiLocaleText()}
                columns={recordColumns}
                disableRowSelectionOnClick
                paginationModel={recordPaginationModel}
                onPaginationModelChange={setRecordPaginationModel}
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
});

export default PatientMedicalRecords;