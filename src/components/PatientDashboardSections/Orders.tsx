import { FC, Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'

//@mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export interface ValueType {
  id: number;
  orderId: string;
  pharmacyName: string;
  quantity: number;
  amount: string;
  paymentGateway: string;
  status: 'shipped' | 'orderPlaced';
  orderDate: string;
}

const Orders: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const grdiRef = useRef<any>(null)
  const [data, setData] = useState<ValueType[]>([
    {
      id: 0, orderId: "OD1236547890", pharmacyName: "Medlife Medical", quantity: 2, amount: '150$', paymentGateway: 'stripe', status: 'orderPlaced', orderDate: dayjs('27 Sep 2020').format('DD MMM YYYY')
    }, {
      id: 1, orderId: "OD1236547891", pharmacyName: "Medlife Medical", quantity: 4, amount: '200$', paymentGateway: 'stripe', status: 'orderPlaced', orderDate: dayjs('17 Aug 2021').format('DD MMM YYYY')
    }, {
      id: 2, orderId: "OD1236547892", pharmacyName: "Medlife Medical", quantity: 1, amount: '75$', paymentGateway: 'stripe', status: 'orderPlaced', orderDate: dayjs('17 Jun 2023').format('DD MMM YYYY')
    }, {
      id: 3, orderId: "OD1236547895", pharmacyName: "PharmaMed Medical", quantity: 2, amount: '100$', paymentGateway: 'Paystack', status: 'shipped', orderDate: dayjs('7 Sep 2019').format('DD MMM YYYY')
    }, {
      id: 4, orderId: "OD1236547899", pharmacyName: "PharmaMed Medical", quantity: 5, amount: '350$', paymentGateway: 'stripe', status: 'shipped', orderDate: dayjs('27 Sep 2019').format('DD MMM YYYY')
    }, {
      id: 5, orderId: "OD1236547897", pharmacyName: "The Pill Club Medical	", quantity: 1, amount: '250$', paymentGateway: 'Paypal', status: 'orderPlaced', orderDate: dayjs('27 Sep 2019').format('DD MMM YYYY')
    },
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
      field: 'orderId',
      headerName: "Order Id",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <Link href="/patient/dashboard/invoice-view" >
            {row.orderId}
          </Link>
        )
      }
    },
    {
      field: 'pharmacyName',
      headerName: "Pharmacy Name",
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'quantity',
      headerName: "Quantity",
      width: 90,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'amount',
      headerName: "Amount",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'paymentGateway',
      headerName: "Payment Gateway",
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: "Status",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <Fragment>
            {row.status == 'shipped' ?
              <Chip label="Shipped" size="small" color='primary' /> :
              <Chip label="Order Placed" size="small" color='secondary' sx={{ color: '#000000' }} />}
          </Fragment>
        )
      }
    },
    {
      field: 'orderDate',
      headerName: "Order Date",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (data: any) => {
        const { row } = data;
        return (
          <Stack >
            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.orderDate).format(`MMM D, YYYY`)}</span>
            <span style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row.orderDate).format(` h:mm A`)}</span>
          </Stack>
        )
      },
    },
  ]

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <Fragment>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
        <div className="card">
          <div className="card-body ">
            {/* Dependent Tab */}
            <div className="card card-table mb-0">
              <div className="card-body">
                <div className="table-responsive">
                  <DataGrid
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
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/* /Dependent Tab */}
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default Orders;