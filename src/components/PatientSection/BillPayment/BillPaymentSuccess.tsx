/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas, LoadingComponent } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';


import { useTheme } from '@mui/material/styles';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import { BillingTypeWithDoctorProfile } from '@/components/DoctorDashboardSections/EditBilling';
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import StickyBox from 'react-sticky-box';
import { BillingDetailsArrayType } from '@/components/DoctorDashboardSections/AddBilling';
import { doctors_profile } from '@/public/assets/imagepath';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import dataGridStyle from '@/components/shared/dataGridStyle';
import Box from '@mui/material/Box';


const BillPaymentSuccess: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const { classes, theme } = dataGridStyle({});
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [reload, setReload] = useState<boolean>(false)
  const [singleBill, setSingleBill] = useState<BillingTypeWithDoctorProfile>();


  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`getSingleBillingForPatient`, { billing_id: _id, patientId: userProfile?._id })
          homeSocket.current.once(`getSingleBillingForPatientReturn`, (msg: { status: number, singleBill: BillingTypeWithDoctorProfile[], reason?: string }) => {
            const { status, singleBill, reason } = msg;
            if (status !== 200) {
              toast.error(reason || `Error ${status} find Bill`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
                onClose: () => {
                  router.back()
                }
              });
            } else {
              homeSocket.current.once(`updateGetSingleBillingForPatientReturn`, () => {
                setReload(!reload)
              })
              if (singleBill && singleBill.length > 0) {
                setSingleBill(singleBill[0]);
              }
            }
          })
        }
      }
    }
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptID, homeSocket, reload, router])

  return (
    <Fragment>
      <div className="content success-page-cont" style={muiVar}>
        <div className="container-fluid" style={{ marginTop: '10vh' }}>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card   animate__animated animate__backInUp">
                <div className="card-body">
                  {
                    !singleBill || userProfile == null ?
                      <div className="card">
                        <div className="card-body">
                          <div className="table-responsive">
                            <Box sx={{ minHeight: '500px' }} className={classes.dataGridOuterBox}>
                              <LoadingComponent boxMinHeight='500px' />
                            </Box>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="success-cont">
                        <i className="fas fa-check" />
                        <h3>Bill paid Successfully!</h3>
                        <div className="col-md-12 col-lg-12 " style={muiVar}>
                          <div className="card booking-card">
                            <div className="card-header">
                              <h4 className="card-title">Bill Summary</h4>
                            </div>
                            <div className="card-body">
                              <div className="booking-doc-info" style={{ display: 'flex', justifyContent: 'center' }}>
                                <Link target="_blank" aria-label='booking-doc' rel="noopener noreferrer" href={`/doctors/profile/${btoa(singleBill?.doctorId)}`} className="booking-doc-img">
                                  <Avatar sx={{
                                    width: 'auto',
                                    height: 'auto',
                                    transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                                    "&:hover": {
                                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                      transform: "scale(1.15)",
                                    },

                                  }} variant="square" alt="" src={singleBill?.doctorProfile?.profileImage}
                                    key={singleBill?.doctorProfile?.profileImage}
                                  >
                                    <img className="img-fluid" src={doctors_profile} alt="" />
                                  </Avatar>
                                </Link>
                                <div className="booking-info">
                                  <h4>
                                    <Link target="_blank" rel="noopener noreferrer" href={`/doctors/profile/${btoa(singleBill?.doctorId)}`}>
                                      Dr. {singleBill?.doctorProfile?.firstName} {" "} {singleBill?.doctorProfile?.lastName}
                                    </Link>
                                  </h4>
                                  <span style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', justifyContent: 'center' }}>
                                    <Rating
                                      name="read-only"
                                      precision={0.5}
                                      value={
                                        singleBill?.doctorProfile?.rate_array.length == 0 ?
                                          0 :
                                          (singleBill?.doctorProfile?.rate_array.reduce((acc, num) => acc + num, 0) / singleBill?.doctorProfile?.rate_array.length)}
                                      readOnly
                                      className='star-span'
                                      size="small"
                                      sx={{
                                        color: 'warning.main',
                                      }}
                                    />
                                    <span className="d-inline-block average-rating">({singleBill?.doctorProfile?.rate_array.length})</span>
                                  </span>
                                  <h6 className="mb-0" style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
                                    <i className="fas fa-map-marker-alt" style={{ width: 10, height: 10, backgroundColor: 'transparent', float: 'left', fontSize: '17px', marginTop: 'auto' }}></i>
                                    <span style={{ textAlign: 'left' }}>
                                      {singleBill?.doctorProfile?.city !== "" ? `City: ${singleBill?.doctorProfile?.city}` : `City: -----`} <br />
                                      {singleBill?.doctorProfile?.state !== "" ? `State: ${singleBill?.doctorProfile?.state}` : `State: -----`} <br />
                                      {singleBill?.doctorProfile?.country !== "" ? `Country: ${singleBill?.doctorProfile?.country}` : `Country: -----`}
                                    </span>
                                  </h6>
                                </div>
                              </div>
                              <div className="booking-summary">
                                <div className="booking-item-wrap">
                                  <ul className="booking-fee booking-total">
                                    <li style={{ display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
                                      <div style={{ display: 'flex' }}>
                                        <p style={{ marginBottom: "unset" }}>Invoice Id </p>&nbsp;
                                        <span></span>
                                      </div>
                                      <span>{singleBill?.invoiceId}</span>
                                    </li>
                                    <li className='booking-total' style={{ display: 'flex', justifyContent: "space-around", borderBottom: `1px solid ${theme.palette.secondary.main}` }}>
                                      <div>
                                        <p style={{ marginBottom: "unset" }}>Title</p> &nbsp;
                                        <span></span>
                                      </div>
                                      <span>Price</span>
                                    </li>
                                    {
                                      singleBill?.billDetailsArray.map((bill: BillingDetailsArrayType, index: number) => {
                                        let singleBillObj: any = Object.entries(bill)

                                        return (
                                          <li key={index} style={{ display: 'flex', justifyContent: "space-around" }}>
                                            {
                                              singleBillObj.map(([key, value]: [string, any], index: number) => {
                                                if (key !== 'doctorProfile') {
                                                  if (key === 'title' || key === 'total') {
                                                    return (
                                                      <div key={key}>
                                                        {
                                                          singleBillObj[index][0] == 'title'
                                                          && <p style={{ marginBottom: "unset" }}>{singleBillObj[index][1]}</p>
                                                        } &nbsp;
                                                        <span>
                                                          {
                                                            singleBillObj[index][0] == 'total'
                                                            && `${singleBill?.currencySymbol} ${formatNumberWithCommas(singleBillObj[index][1])}`
                                                          }
                                                        </span>
                                                      </div>
                                                    );
                                                  }
                                                }
                                                return null;
                                              })
                                            }
                                          </li>
                                        )
                                      })
                                    }
                                  </ul>
                                  <div className="booking-total">
                                    <ul className="booking-total-list">
                                      <li style={{ display: 'flex', justifyContent: "space-around" }}>
                                        <span>Total</span>
                                        <span className="total-cost">
                                          {singleBill?.currencySymbol || 'THB'}
                                          {" "}
                                          {formatNumberWithCommas(singleBill?.total.toString())}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link href={`/patient/dashboard/bill-view/${btoa(singleBill?._id!)}`} className="btn btn-primary view-inv-btn">View Invoice</Link>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default BillPaymentSuccess