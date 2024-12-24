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
import { useRouter } from 'next/router';

export interface BillingValueType {
  invoiceNo: string;
  doctorName: string;
  doctorImage: string;
  speciality: string;
  amount: string;
  payDate: string;
}

const PatientBillingRecords: FC<{ userType: 'patient' | 'doctor' }> = (({ userType }) => {
  const { muiVar } = useScssVar();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const presRef = useRef<any>(null)
  const [billingData, setBillingData] = useState<BillingValueType[]>([
    { invoiceNo: '#INV-0010', payDate: dayjs('27 Sep 2019').format('DD MMM YYYY'), amount: "450", doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, speciality: 'Dental' },
    { invoiceNo: '#INV-009', payDate: dayjs("1 Nov 2019").format('DD MMM YYYY'), amount: "300", doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, speciality: 'Dental' },
    { invoiceNo: '#INV-008', payDate: dayjs("3 Nov 2019").format('DD MMM YYYY'), amount: "150", doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, speciality: 'Cardiology' },
    { invoiceNo: '#INV-007', payDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: "50", doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, speciality: 'Urology' },
    { invoiceNo: '#INV-006', payDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: "600", doctorName: 'Dr. Marvin Campbell', doctorImage: DoctThumb2, speciality: 'Ophthalmology' },
    { invoiceNo: '#INV-005', payDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: "200", doctorName: 'Dr. Katharine Berthold', doctorImage: DoctThumb8, speciality: 'Orthopaedics' },
    { invoiceNo: '#INV-004', payDate: dayjs('27 Sep 2019').format('DD MMM YYYY'), amount: "100", doctorName: "Dr. Ruby Perrin", doctorImage: DoctThumb2, speciality: 'Dental' },
    { invoiceNo: '#INV-003', payDate: dayjs("1 Nov 2019").format('DD MMM YYYY'), amount: "250", doctorName: 'Dr. Darren Elder', doctorImage: DoctThumb8, speciality: 'Dental' },
    { invoiceNo: '#INV-002', payDate: dayjs("3 Nov 2019").format('DD MMM YYYY'), amount: "175", doctorName: 'Dr. Deborah Angel', doctorImage: DoctThumb9, speciality: 'Cardiology' },
    { invoiceNo: '#INV-001', payDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), amount: "550", doctorName: 'Dr. Sofia Brient', doctorImage: DoctThumb10, speciality: 'Urology' },

  ])

  const billingColumns: GridColDef[] = [
    {
      field: 'invoiceNo',
      headerName: "Invoice No",
      width: 100,
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
              <Link href="/doctors/search" style={{ marginBottom: -20, zIndex: 1 }}>{row.doctorName}</Link><br />
              <small>  {row.speciality}</small>
            </Stack>
          </>
        )
      },
    }, {
      field: 'amount',
      headerName: "Amount",
      width: 100,
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
      field: 'date',
      headerName: "Paind On",
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
              router.push('/patient/dashboard/see-billing')
            }} key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
          ]
        } else {
          return [
            <GridActionsCellItem key={params.row.toString()} icon={<i className="fas fa-print" style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
            <GridActionsCellItem key={params.row.toString()} icon={
              <Edit sx={{ color: theme.palette.primary.main }} />} onClick={() => {
                router.push('/doctors/dashboard/editbilling')
              }} label="Edit" />,
            <GridActionsCellItem key={params.row.toString()} icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
          ]
        }
      }
    }
  ]
  const [billingPaginationModel, setBillingPaginationModel] = useState({
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
                experimentalFeatures={{ ariaV7: true }}
                slotProps={{
                  pagination: {
                    SelectProps: {
                      inputProps: {
                        id: 'pagination-select',
                        name: 'pagination-select',
                      },
                    },
                  },
                }}
                getRowId={(params) => params.invoiceNo}
                autoHeight
                rows={billingData}
                rowCount={billingData.length}
                ref={presRef}
                // localeText={muiLocaleText()}
                columns={billingColumns}
                disableRowSelectionOnClick
                paginationModel={billingPaginationModel}
                onPaginationModelChange={setBillingPaginationModel}
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

export default PatientBillingRecords;