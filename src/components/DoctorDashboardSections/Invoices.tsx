/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6, PatientImg7 } from '@/public/assets/imagepath';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

export interface ValueType {
  id: number;
  invoiceNo: string;
  patientName: string;
  patientId: string;
  patientImage: string;
  paidAmount: string;
  paidOn: string;
}
const Invoices: FC = (() => {
  const { muiVar } = useScssVar();
  const grdiRef = useRef<any>(null)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const [data, setData] = useState<ValueType[]>([
    {
      id: 1,
      invoiceNo: "#INV-0010",
      patientName: "Richard Wilson",
      patientId: '#PT0016',
      patientImage: PatientImg1,
      paidAmount: '450',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 2,
      invoiceNo: "#INV-0009",
      patientName: "Charlene Reed",
      patientId: '#PT0001',
      patientImage: PatientImg2,
      paidAmount: '200',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 3,
      invoiceNo: "#INV-0008",
      patientName: "Travis Trimble",
      patientId: '#PT0002',
      patientImage: PatientImg3,
      paidAmount: '100',
      paidOn: dayjs('13 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 4,
      invoiceNo: "#INV-0007",
      patientName: "Carl Kelly",
      patientId: '#PT0003',
      patientImage: PatientImg4,
      paidAmount: '350',
      paidOn: dayjs('15 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 5,
      invoiceNo: "#INV-0006",
      patientName: "Michelle Fairfax",
      patientId: '#PT0004',
      patientImage: PatientImg5,
      paidAmount: '275',
      paidOn: dayjs('20 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 6,
      invoiceNo: "#INV-0005",
      patientName: "Gina Moore",
      patientId: '#PT0005',
      patientImage: PatientImg6,
      paidAmount: '600',
      paidOn: dayjs('23 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 7,
      invoiceNo: "#INV-0004",
      patientName: "Elsie Gilley",
      patientId: '#PT0006',
      patientImage: PatientImg7,
      paidAmount: '50',
      paidOn: dayjs('16 Aug 2023').format('DD MMM YYYY')
    },
    {
      id: 8,
      invoiceNo: "#INV-0003",
      patientName: "Joan Gardner",
      patientId: '#PT0007',
      patientImage: PatientImg1,
      paidAmount: '400',
      paidOn: dayjs('12 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 9,
      invoiceNo: "#INV-0002",
      patientName: "Daniel Griffing",
      patientId: '#PT0008',
      patientImage: PatientImg2,
      paidAmount: '550',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
    {
      id: 10,
      invoiceNo: "#INV-0001",
      patientName: "Walter Roberson",
      patientId: '#PT0009',
      patientImage: PatientImg3,
      paidAmount: '100',
      paidOn: dayjs('27 Jul 2023').format('DD MMM YYYY')
    },
  ])
  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'invoiceNo',
      headerName: "Invoice No",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Link href="/doctors/invoice-view">{row.invoiceNo}</Link>
          </>
        )
      }
    },
    {
      field: 'patientName',
      headerName: "Patient",
      width: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="avatar avatar-sm me-2">
              <img className="avatar-img rounded-circle" src={row.patientImage} alt="User Image" />
            </span>
            <Stack >
              <Link href="/doctors/dashboard/patient-profile" style={{ marginBottom: -20, zIndex: 1 }}>{row.patientName}</Link><br />
              <small>  {row.patientId}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: 'paidAmount',
      headerName: "Amount",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {"$ " + row.paidAmount}
          </>
        )
      }
    },
    {
      field: 'paidOn',
      headerName: "Paid On",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.paidOn).format(`MMM D, YYYY`)}</span>

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
      align: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={params.row.toString()}
          disableFocusRipple
          disableRipple
          disableTouchRipple
          onClick={() => {
            router.push('/doctors/invoice-view')
          }}
          icon={<i className="far fa-eye"
            style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
        <GridActionsCellItem
          key={params.row.toString()}
          disableFocusRipple
          disableRipple
          disableTouchRipple
          onClick={() => {
            router.push('/doctors/invoice-view')
          }}
          icon={<i className="fas fa-print"
            style={{ color: theme.palette.primary.main }}></i>} label="Print" />,
      ]
    }
  ]

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card card-table">
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
                rows={data}
                rowCount={data.length}
                ref={grdiRef}
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
});

export default Invoices;