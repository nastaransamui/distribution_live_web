/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '@/public/assets/imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles';
import { AppointmentReservationExtendType } from './PaymentSuccess';
import { base64regex } from '../Profile/PublicProfilePage';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';

export function truncateString(str: string, maxLength: number) {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

const Invoice: FC = (() => {
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceHeaderRef = useRef<HTMLDivElement>(null);
  const invoiceBodyRef = useRef<HTMLDivElement>(null);
  const invoiceFooterRef = useRef<HTMLDivElement>(null);
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [reload, setReload] = useState<boolean>(false)
  const [reservation, setReservation] = useState<AppointmentReservationExtendType | null>(null)


  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`findReservationById`, { _id })
          homeSocket.current.once(`findReservationByIdReturn`, (msg: { status: number, reservation: AppointmentReservationExtendType, reason?: string }) => {
            const { status, reservation, reason } = msg;
            if (status !== 200) {
              toast.error(reason || `Error ${status} find Reservation`, {
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
              homeSocket.current.once(`updateReservationById`, () => {
                setReload(!reload)
              })
              setReservation(reservation)
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

  const handleExport = async () => {
    if (!exportRef.current) return;
    const customStyles = `
      #pdf-content {
         width: 794px; /* A4 width in pixels at 96 DPI */
  background-color: #fff;
  font-size: 18px;
  overflow: hidden;
  margin: 0 auto; 
      }
      #pdf-content p,
      #pdf-content td {
        color: black !important;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "pdf-styles";
    styleSheet.innerText = customStyles;

    // Append styles to the exportRef content
    exportRef.current.appendChild(styleSheet);
    // Define A4 page dimensions in pixels (at 96 DPI)
    const DPI = 96; // Dots per inch
    const PX_PER_MM = DPI / 25.4; // Pixels per mm
    const A4_WIDTH_PX = Math.floor(210 * PX_PER_MM); // A4 width in pixels
    const A4_HEIGHT_PX = Math.floor(297 * PX_PER_MM); // A4 height in pixels

    // Ensure the export container matches A4 dimensions
    const exportContent = exportRef.current;
    exportContent.style.width = `${A4_WIDTH_PX}px`;
    exportContent.style.height = `auto`; // Let height adjust naturally for content

    // Render the HTML content to a canvas
    const canvas = await html2canvas(exportContent, {
      scale: 1, // No scaling
      width: A4_WIDTH_PX,
      height: exportContent.offsetHeight, // Render full content height
      scrollX: 0,
      scrollY: 0,
    });

    // Create a jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");

    // Slice the canvas into A4-sized chunks and add to PDF
    const imgData = canvas.toDataURL("image/png");
    const totalHeight = canvas.height;
    let positionY = 0;

    while (positionY < totalHeight) {
      // Add the current slice to the PDF
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        210, // Full A4 width in mm
        (canvas.height * 210) / canvas.width // Scale height proportionally
      );

      positionY += A4_HEIGHT_PX; // Move to the next slice
      if (positionY < totalHeight) pdf.addPage(); // Add a new page if needed
    }

    // Save the PDF
    pdf.save(`${reservation?.invoiceId || "document"}.pdf`);
    // Clean up the custom styles
    exportRef.current.removeChild(styleSheet);
    exportContent.style.width = "";
    exportContent.style.height = "";
  };

  return (
    <Fragment>
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            {
              reservation == null ?
                <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                  minWidth: '90%',
                  display: 'flex',
                  justifyContent: 'center',
                }} />
                :
                <div className="col-lg-8 offset-lg-2">
                  <button onClick={handleExport} style={{ width: '100%', marginBottom: 30 }} className='btn btn-primary'>Export as PDF</button>
                  <div className="invoice-content" ref={exportRef} id="pdf-content">
                    <span ref={invoiceHeaderRef}>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-logo">
                              <img src={logo} alt="logo" />
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <p className="invoice-details">
                              <strong>Order:</strong> {reservation.invoiceId} <br />
                              <strong>Issued:</strong> {dayjs(reservation?.createdDate).format(`D MMM YYYY HH:mm`)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Invoice From</strong>
                              <p className="invoice-details invoice-details-two">
                                Dr. {reservation?.doctorProfile?.firstName} {" "} {reservation?.doctorProfile?.lastName} <br />
                                {reservation?.doctorProfile?.address1} {reservation?.doctorProfile?.address1 !== '' ? ',' : '-----'}{reservation?.doctorProfile?.address2}
                                <br />
                                {`${reservation?.doctorProfile?.city} ${reservation?.doctorProfile?.state} ${reservation?.doctorProfile?.country}`}<br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info invoice-info2">
                              <strong className="customer-text" style={{ textAlign: "left" }}>Invoice To</strong>
                              <p className="invoice-details" style={{ textAlign: 'left' }}>
                                {`${reservation?.patientProfile?.gender !== '' ? reservation?.patientProfile?.gender + '.' : ''} ${reservation?.patientProfile.firstName} ${reservation?.patientProfile?.lastName}`} <br />
                                {`${reservation?.patientProfile?.address1}`} {reservation?.patientProfile?.address1 !== '' ? ',' : '-----'}{reservation?.patientProfile?.address2}<br />
                                {`${reservation?.patientProfile?.city} ${reservation?.patientProfile?.state} ${reservation?.patientProfile?.country}`}<br /> <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Payment Method</strong>
                              <Tooltip title={reservation?.paymentToken} arrow placement='top'>
                                <p className="invoice-details invoice-details-two">
                                  {reservation?.paymentType} <br />
                                  {truncateString(reservation?.paymentToken, 20)} <br />
                                  <br />
                                </p>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="invoice-item invoice-table-wrap" ref={invoiceBodyRef}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="invoice-table table table-bordered">
                              <thead style={{ borderBottom: "none" }}>
                                <tr>
                                  <th>Description</th>
                                  <th className="text-center">Quantity</th>
                                  <th className="text-center">Price</th>
                                  <th className="text-end">Total</th>
                                </tr>
                              </thead>
                              <tbody style={{ borderTop: "none" }}>
                                <tr>
                                  <td style={{ padding: '10px 0px' }}>{dayjs(reservation.selectedDate).format('DD MMM YYYY')} - {reservation.timeSlot?.period}</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price.toString())}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price.toString())}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '10px 0px' }}>Booking Fee</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice.toString()
                                  )}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice.toString()
                                  )}</td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                        {userProfile?.roleName == 'doctors' ?
                          <div className="col-md-6 col-xl-6 " style={{ minHeight: '300px', position: 'relative' }}>
                            <div className={
                              `${reservation?.doctorPaymentStatus == "Awaiting Request"
                                ? "rubber_stamp_await"
                                : reservation?.doctorPaymentStatus == "Paid"
                                  ? "rubber_stamp_paid" : "rubber_stamp_pendign"}
                              `}>{reservation?.doctorPaymentStatus}</div>
                          </div> :
                          <div className="col-md-6 col-xl-6 " style={{ minHeight: '300px', position: 'relative' }}></div>
                        }
                        <div className="col-md-6 col-xl-6 ">
                          <div className="table-responsive">
                            <table className="invoice-table-two table">
                              <tbody>
                                <tr>
                                  <th >Subtotal:</th>
                                  <td style={{ padding: '10px 18px', width: '100%' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total.toString()
                                    )}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th>Discount:</th>
                                  <td>
                                    <span>---</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th style={{ width: '40%', }}>Total Amount:</th>
                                  <td style={{ padding: '10px 18px', width: '100%' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total.toString()
                                    )}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="other-info" ref={invoiceFooterRef}>
                      <h1 style={{ fontSize: 18 }}>Other information</h1>
                      <p className="text-muted mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                        sed dictum ligula, cursus blandit risus. Maecenas eget metus non
                        tellus dignissim aliquam ut a ex. Maecenas sed vehicula dui, ac
                        suscipit lacus. Sed finibus leo vitae lorem interdum, eu
                        scelerisque tellus fermentum. Curabitur sit amet lacinia lorem.
                        Nullam finibus pellentesque libero.
                      </p>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>

    </Fragment>
  )
});

export default Invoice;