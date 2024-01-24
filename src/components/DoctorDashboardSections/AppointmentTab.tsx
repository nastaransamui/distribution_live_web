/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6 } from '@/public/assets/imagepath';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

export interface ValueType {
  id: number;
  appointmentId: string;
  patientName: string;
  apptDate: string;
  patientImage: string;
  purpose: string;
  type: string;
  paidAmount: string;
}

export interface PropType {
  isToday: boolean
}


const AppointmentTab: FC<PropType> = (({ isToday }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const [data, setData] = useState<ValueType[]>([
    { id: 0, appointmentId: '#PT0016', patientName: "Richard Wilson", apptDate: dayjs('27 Sep 2019').format('DD MMM YYYY'), patientImage: PatientImg1, purpose: 'General', paidAmount: '150', type: 'Old Patient' },
    { id: 1, appointmentId: '#PT0001', patientName: "Charlene Reed", apptDate: dayjs("1 Nov 2019").format('DD MMM YYYY'), patientImage: PatientImg2, purpose: 'General', paidAmount: '200', type: 'New Patient' },
    { id: 2, appointmentId: '#PT0002', patientName: "Travis Trimble", apptDate: dayjs("3 Nov 2019").format('DD MMM YYYY'), patientImage: PatientImg3, purpose: 'General', paidAmount: '75', type: 'Old Patient' },
    { id: 3, appointmentId: '#PT0003', patientName: "Carl Kelly", apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), patientImage: PatientImg4, purpose: 'General', paidAmount: '100', type: 'New Patient' },
    { id: 4, appointmentId: '#PT0004', patientName: "Michelle Fairfax", apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), patientImage: PatientImg5, purpose: 'General', paidAmount: '350', type: 'Old Patient' },
    { id: 5, appointmentId: '#PT0005', patientName: "Gina Moore", apptDate: dayjs("16 Jun 2019").format('DD MMM YYYY'), patientImage: PatientImg6, purpose: 'General', paidAmount: '250', type: 'New Patient' },
    { id: 6, appointmentId: '#PT0006', patientName: "Elsie Gilley", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg1, purpose: 'Fever', paidAmount: '300', type: 'Old Patient' },
    { id: 7, appointmentId: '#PT0007', patientName: "Joan Gardner", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg2, purpose: 'Fever', paidAmount: '100', type: 'New Patient' },
    { id: 8, appointmentId: '#PT0008', patientName: "Daniel Griffing", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg3, purpose: 'Fever', paidAmount: '199', type: 'Old Patient' },
    { id: 9, appointmentId: '#PT0009', patientName: "Walter Roberson", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg4, purpose: 'Fever', paidAmount: '150', type: 'Old Patient' },
    { id: 10, appointmentId: '#PT0010', patientName: "Robert Rhodes", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg5, purpose: 'Fever', paidAmount: '350', type: 'New Patient' },
    { id: 11, appointmentId: '#PT0011', patientName: "Harry Williams", apptDate: dayjs(new Date()).format('DD MMM YYYY'), patientImage: PatientImg6, purpose: 'Fever', paidAmount: '200', type: 'Old Patient' },
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
      field: 'patientName',
      headerName: "Patient Name",
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
              <small>  {row.appointmentId}</small>
            </Stack>
          </>
        )
      },
    },
    {
      field: 'apptDate',
      headerName: "Date",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.apptDate).format(`MMM D, YYYY`)}</span>
              <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.date).format(` h:mm A`)}</span>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'purpose',
      headerName: "Purpose",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'type',
      headerName: "Type",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'paidAmount',
      headerName: "Paid Amount",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <>
            {row.paidAmount + " $"}
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
        <GridActionsCellItem disableFocusRipple disableRipple disableTouchRipple icon={<i className="far fa-eye" style={{ color: theme.palette.secondary.main }}></i>} label="View" />,
        <GridActionsCellItem disableFocusRipple disableRipple disableTouchRipple icon={<DoneIcon sx={{ color: theme.palette.success.main }} />} label="Accept" />,
        <GridActionsCellItem disableFocusRipple disableRipple disableTouchRipple icon={<CloseIcon sx={{ color: theme.palette.warning.main }} />} label="Cancel" />,
      ]
    }
  ]


  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    setData((prevState: ValueType[]) => {
      let newState: ValueType[] = prevState.filter((a: ValueType) => {
        if (isToday) {
          if (dayjs(a.apptDate).isSame(new Date(), 'day')) return a
        } else {
          return a
        }

      })
      return newState
    })
  }, [isToday])


  return (
    <Fragment>
      <DataGrid
        autoHeight
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
    </Fragment>
  )
})

export default AppointmentTab;